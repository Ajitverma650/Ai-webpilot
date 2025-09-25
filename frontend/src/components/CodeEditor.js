// components/CodeEditor.js
import React, { useState } from 'react';
import Editor from '@monaco-editor/react';

const CodeEditor = ({ files, activeFile, setFiles, showPreview }) => {
  const [copied, setCopied] = useState(false);

  const getLanguageFromFile = (filename) => {
    const ext = filename.split('.').pop();
    switch (ext) {
      case 'html': return 'html';
      case 'css': return 'css';
      case 'js': return 'javascript';
      case 'json': return 'json';
      default: return 'plaintext';
    }
  };

  const getFileIcon = (filename) => {
    if (filename.endsWith('.html')) return '📄';
    if (filename.endsWith('.css')) return '🎨';
    if (filename.endsWith('.js')) return '⚡';
    return '📋';
  };

  const handleEditorChange = (value) => {
    setFiles(prevFiles => ({
      ...prevFiles,
      [activeFile]: value || ''
    }));
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(files[activeFile]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div style={{ 
      flex: showPreview ? 0 : 1,
      display: showPreview ? 'none' : 'flex',
      flexDirection: 'column',
      minHeight: 'calc(100vh - 60px)',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      opacity: showPreview ? 0 : 1,
      transform: showPreview ? 'translateX(-20px)' : 'translateX(0)'
    }}>
      <div style={{
        padding: '10px 15px',
        background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        fontSize: '14px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        color: '#ffffff',
        minHeight: '45px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ marginRight: '8px' }}>
            {getFileIcon(activeFile)}
          </span>
          <span style={{ fontWeight: '500' }}>{activeFile}</span>
        </div>
        
        <button
          onClick={copyToClipboard}
          style={{
            padding: '6px 12px',
            background: copied 
              ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' 
              : 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.1) 100%)',
            color: 'white',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: '500',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            transition: 'all 0.3s ease',
            backdropFilter: 'blur(10px)'
          }}
          onMouseEnter={(e) => {
            if (!copied) {
              e.target.style.background = 'linear-gradient(135deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.2) 100%)';
            }
          }}
          onMouseLeave={(e) => {
            if (!copied) {
              e.target.style.background = 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.1) 100%)';
            }
          }}
        >
          {copied ? (
            <>
              <span>✓</span>
              Copied!
            </>
          ) : (
            <>
              <span>📋</span>
              Copy
            </>
          )}
        </button>
      </div>
      
      <div style={{ flex: 1, overflow: 'hidden' }}>
        <Editor
          height="100%"
          language={getLanguageFromFile(activeFile)}
          value={files[activeFile]}
          onChange={handleEditorChange}
          theme="vs-dark"
          options={{
            fontSize: 14,
            lineNumbers: 'on',
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            wordWrap: 'on',
            folding: true,
            bracketMatching: 'always',
            autoIndent: 'full',
            formatOnPaste: true,
            formatOnType: true
          }}
        />
      </div>
    </div>
  );
};

export default CodeEditor;
