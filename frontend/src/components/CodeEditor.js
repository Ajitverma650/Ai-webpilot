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

  const handleEditorChange = (value) => {
    setFiles(prevFiles => ({
      ...prevFiles,
      [activeFile]: value || ''
    }));
  };

  const copyToClipboard = async () => {
    if (!files[activeFile]) return;
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
      minHeight: 0,
      background: '#111827',
      transition: 'all 0.3s ease'
    }}>
      <div style={{
        padding: '10px 20px',
        background: '#1F2937',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        fontSize: '14px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        color: '#F9FAFB',
        minHeight: '48px'
      }}>
        <span style={{ fontWeight: '500' }}>{activeFile}</span>
        <button
          onClick={copyToClipboard}
          style={{
            padding: '6px 12px',
            background: copied ? '#2DD4BF' : 'rgba(255,255,255,0.1)',
            color: copied ? '#111827' : 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: '500',
          }}
        >
          {copied ? 'Copied!' : 'Copy'}
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
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            automaticLayout: true,
          }}
        />
      </div>
    </div>
  );
};

export default CodeEditor;