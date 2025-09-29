// components/PromptPanel.js
import React, { useState } from 'react';

const PromptPanel = ({ prompt, setPrompt, onGenerate, isLoading, files, activeFile, setActiveFile, promptHistory, onSelectFromHistory }) => {
  const [showHistory, setShowHistory] = useState(false);

  const getFileIcon = (filename) => {
    if (filename.endsWith('.html')) return '📄';
    if (filename.endsWith('.css')) return '🎨';
    if (filename.endsWith('.js')) return '⚡️';
    return '📋';
  };

  return (
    <div style={{ 
      width: '380px', 
      padding: '20px', 
      borderRight: '1px solid rgba(255,255,255,0.1)',
      background: '#1F2937',
      display: 'flex',
      flexDirection: 'column',
      minHeight: 'calc(100vh - 60px)',
      transition: 'width 0.3s ease'
    }}>
      {/* Section 1: Prompt Input */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>
            Your Prompt
          </h3>
          {promptHistory.length > 0 && (
            <button
              onClick={() => setShowHistory(!showHistory)}
              style={{ background: 'none', border: 'none', color: '#9CA3AF', cursor: 'pointer', fontSize: '14px', padding: 0 }}
            >
              {showHistory ? 'Hide History' : 'Show History'}
            </button>
          )}
        </div>
        
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g., A sleek portfolio website for a photographer..."
          style={{ 
            width: '100%', 
            height: '120px',
            background: '#111827',
            color: '#F9FAFB',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '8px',
            padding: '12px',
            fontSize: '14px',
            resize: 'none',
            fontFamily: 'inherit',
            boxSizing: 'border-box',
            transition: 'border-color 0.2s ease, box-shadow 0.2s ease'
          }}
        />
        <button 
          onClick={onGenerate} 
          disabled={isLoading || !prompt.trim()}
          style={{
            width: '100%',
            padding: '12px',
            background: isLoading ? 'transparent' : '#2DD4BF',
            color: isLoading ? '#9CA3AF' : '#111827',
            border: isLoading ? '1px solid #2DD4BF' : 'none',
            borderRadius: '8px',
            cursor: isLoading || !prompt.trim() ? 'not-allowed' : 'pointer',
            fontSize: '16px',
            marginTop: '12px',
            fontWeight: '700',
            opacity: !prompt.trim() ? 0.5 : 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            transition: 'all 0.2s ease'
          }}
        >
          {isLoading ? (
            <>
              <div style={{ width: '18px', height: '18px', border: '2px solid #2DD4BF', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
              Generating...
            </>
          ) : '✨ Generate'}
        </button>
      </div>

      {/* Section 2: History (Conditional) */}
      {showHistory && (
        <div style={{ marginBottom: '24px', background: 'rgba(0,0,0,0.1)', padding: '12px', borderRadius: '8px' }}>
          <h3 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: '500', color: '#9CA3AF' }}>
            History
          </h3>
          <div style={{ maxHeight: '150px', overflowY: 'auto' }}>
            {promptHistory.map((p, i) => (
              <div key={i} onClick={() => onSelectFromHistory(p)} style={{ padding: '8px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', color: '#9CA3AF', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', transition: 'background 0.2s ease' }}
                onMouseEnter={e => e.target.style.background = 'rgba(255,255,255,0.1)'}
                onMouseLeave={e => e.target.style.background = 'transparent'}
              >
                {p}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Section 3: Files */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
        <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: '600' }}>
          Project Files
        </h3>
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {Object.keys(files).map((file) => (
            <div 
              key={file} 
              onClick={() => setActiveFile(file)}
              style={{ 
                cursor: 'pointer',
                padding: '10px 14px',
                borderRadius: '8px',
                marginBottom: '8px',
                background: activeFile === file ? 'rgba(45, 212, 191, 0.1)' : 'transparent',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                color: activeFile === file ? '#2DD4BF' : '#F9FAFB',
                border: `1px solid ${activeFile === file ? 'rgba(45, 212, 191, 0.5)' : 'rgba(255, 255, 255, 0.1)'}`,
                transition: 'all 0.2s ease'
              }}
            >
              <span style={{ marginRight: '10px', fontSize: '16px' }}>{getFileIcon(file)}</span>
              {file}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PromptPanel;