// App.js
import React, { useState, useEffect } from 'react';
import './App.css';
import Header from './components/Header';
import PromptPanel from './components/PromptPanel';
import CodeEditor from './components/CodeEditor';
import PreviewPanel from './components/PreviewPanel';
import PublishPanel from './components/PublishPanel';
import useFileManager from './hooks/useFileManager';
import useAIGenerator from './hooks/useAIGenerator';
import usePromptHistory from './hooks/usePromptHistory';
import { downloadProject, runProjectInNewTab } from './utils/fileUtils';

function App() {
  const [showPreview, setShowPreview] = useState(false); // Start with code view
  const [showToggleNotification, setShowToggleNotification] = useState(false);
  const [showPublishPanel, setShowPublishPanel] = useState(false); // State for publish panel
  
  const { files, activeFile, setActiveFile, setFiles } = useFileManager();
  const { generateCode, isLoading } = useAIGenerator();
  const { 
    history: promptHistory, 
    currentPrompt: prompt, 
    setCurrentPrompt: setPrompt,
    addToHistory,
    selectFromHistory
  } = usePromptHistory();

  // Add keyboard shortcut for toggle (Cmd/Ctrl + K)
  useEffect(() => {
    const handleKeyDown = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault();
        setShowPreview(prev => !prev);
        // Show notification briefly
        setShowToggleNotification(true);
        setTimeout(() => setShowToggleNotification(false), 1500);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    // Add to history and clear prompt
    addToHistory(prompt);
    
    const newFiles = await generateCode(prompt);
    if (newFiles) {
      setFiles(newFiles);
    }
  };

  const handleSelectFromHistory = (historyPrompt) => {
    selectFromHistory(historyPrompt);
  };

  const handleDownloadProject = () => {
    downloadProject(files);
  };

  const handleRunProject = () => {
    runProjectInNewTab(files);
  };

  return (
    <div style={{ 
      height: '100vh', 
      background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)',
      color: '#ffffff',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      position: 'relative'
    }}>
      {/* Animated Background */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `
          radial-gradient(circle at 20% 80%, rgba(147, 51, 234, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(236, 72, 153, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 40% 40%, rgba(79, 70, 229, 0.1) 0%, transparent 50%)
        `,
        animation: 'gradientShift 8s ease infinite'
      }}></div>
      
      <Header 
        showPreview={showPreview}
        setShowPreview={setShowPreview}
        onRunProject={handleRunProject}
        onDownloadProject={handleDownloadProject}
        files={files}
        showPublishPanel={showPublishPanel}
        setShowPublishPanel={setShowPublishPanel}
      />
      
      <div style={{ 
        display: 'flex', 
        flex: 1,
        overflow: 'hidden',
        position: 'relative',
        zIndex: 1,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
      }}>
        <PromptPanel 
          prompt={prompt}
          setPrompt={setPrompt}
          onGenerate={handleGenerate}
          isLoading={isLoading}
          files={files}
          activeFile={activeFile}
          setActiveFile={setActiveFile}
          promptHistory={promptHistory}
          onSelectFromHistory={handleSelectFromHistory}
        />
        
        <CodeEditor 
          files={files}
          activeFile={activeFile}
          setFiles={setFiles}
          showPreview={showPreview}
        />
        
        <PreviewPanel 
          files={files}
          onRunProject={handleRunProject}
          showPreview={showPreview}
        />
        
        {/* Publish Panel - Slides in from right */}
        <PublishPanel 
          files={files}
          projectName="AI Generated Project"
          isVisible={showPublishPanel}
          onClose={() => setShowPublishPanel(false)}
        />
      </div>

      {/* Toggle notification */}
      {showToggleNotification && (
        <div style={{
          position: 'fixed',
          top: '80px',
          right: '20px',
          background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.95) 0%, rgba(236, 72, 153, 0.95) 100%)',
          color: 'white',
          padding: '12px 20px',
          borderRadius: '12px',
          fontSize: '14px',
          fontWeight: '600',
          zIndex: 1000,
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.2)',
          boxShadow: '0 8px 32px rgba(168, 85, 247, 0.3)',
          animation: 'slideInRight 0.3s ease-out',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span>{showPreview ? '👁️' : '💻'}</span>
          Switched to {showPreview ? 'Preview' : 'Code'} mode
        </div>
      )}
    </div>
  );
}

export default App;