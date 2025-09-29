/// src/App.js
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
  const [showPreview, setShowPreview] = useState(false);
  const [showToggleNotification, setShowToggleNotification] = useState(false);
  const [showPublishPanel, setShowPublishPanel] = useState(false);
  
  const { files, activeFile, setActiveFile, setFiles } = useFileManager();
  const { generateCode, isLoading } = useAIGenerator();
  const { 
    history: promptHistory, 
    currentPrompt: prompt, 
    setCurrentPrompt: setPrompt,
    addToHistory,
    selectFromHistory
  } = usePromptHistory();

  useEffect(() => {
    const handleKeyDown = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault();
        setShowPreview(prev => !prev);
        setShowToggleNotification(true);
        setTimeout(() => setShowToggleNotification(false), 1500);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
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
      background: '#111827',
      color: '#F9FAFB',
      fontFamily: "'Inter', sans-serif",
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
    }}>
      <Header 
        showPreview={showPreview}
        setShowPreview={setShowPreview}
        onRunProject={handleRunProject}
        onDownloadProject={handleDownloadProject}
        showPublishPanel={showPublishPanel}
        setShowPublishPanel={setShowPublishPanel}
      />
      
      <div style={{ 
        display: 'flex', 
        flex: 1,
        overflow: 'hidden'
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
        
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0 }}>
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
        </div>
        
        <PublishPanel 
          files={files}
          projectName="AI Generated Project"
          isVisible={showPublishPanel}
          onClose={() => setShowPublishPanel(false)}
        />
      </div>

      {showToggleNotification && (
        <div style={{
          position: 'fixed',
          top: '80px',
          right: '20px',
          background: '#1F2937',
          color: '#F9FAFB',
          padding: '12px 20px',
          borderRadius: '8px',
          fontSize: '14px',
          fontWeight: '500',
          zIndex: 1000,
          border: '1px solid rgba(255,255,255,0.1)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
          animation: 'slideInRight 0.3s ease-out',
        }}>
          Switched to {showPreview ? 'Preview' : 'Code'} mode
        </div>
      )}
    </div>
  );
}

export default App;