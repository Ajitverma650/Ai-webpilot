// components/PromptPanel.js
import React, { useState } from 'react';

const PromptPanel = ({ 
  prompt, 
  setPrompt, 
  onGenerate, 
  isLoading, 
  files, 
  activeFile, 
  setActiveFile,
  promptHistory,
  onSelectFromHistory 
}) => {
  const [showHistory, setShowHistory] = useState(false);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      onGenerate();
    }
  };

  const getFileIcon = (filename) => {
    if (filename.endsWith('.html')) return '📄';
    if (filename.endsWith('.css')) return '🎨';
    if (filename.endsWith('.js')) return '⚡';
    return '📋';
  };

  return (
    <div style={{ 
      width: '380px', 
      padding: '20px', 
      borderRight: '1px solid rgba(255,255,255,0.1)',
      background: 'linear-gradient(145deg, rgba(16,20,35,0.95) 0%, rgba(25,30,45,0.9) 100%)',
      backdropFilter: 'blur(20px)',
      display: 'flex',
      flexDirection: 'column',
      minHeight: 'calc(100vh - 60px)',
      position: 'relative'
    }}>
      {/* Floating Background Elements */}
      <div style={{
        position: 'absolute',
        top: '10%',
        right: '10%',
        width: '100px',
        height: '100px',
        background: 'linear-gradient(135deg, rgba(147, 51, 234, 0.1) 0%, rgba(79, 70, 229, 0.1) 100%)',
        borderRadius: '50%',
        filter: 'blur(40px)',
        animation: 'float 6s ease-in-out infinite'
      }}></div>
      
      <div style={{
        position: 'absolute',
        bottom: '20%',
        left: '5%',
        width: '80px',
        height: '80px',
        background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.1) 0%, rgba(147, 51, 234, 0.1) 100%)',
        borderRadius: '50%',
        filter: 'blur(30px)',
        animation: 'float 4s ease-in-out infinite reverse'
      }}></div>

      <div style={{
        background: 'linear-gradient(135deg, rgba(147, 51, 234, 0.15) 0%, rgba(79, 70, 229, 0.15) 100%)',
        padding: '24px',
        borderRadius: '20px',
        marginBottom: '24px',
        boxShadow: '0 8px 32px rgba(147, 51, 234, 0.15), inset 0 1px 0 rgba(255,255,255,0.1)',
        border: '1px solid rgba(255,255,255,0.1)',
        backdropFilter: 'blur(20px)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Header Section */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          marginBottom: '16px'
        }}>
          <h3 style={{ 
            margin: 0, 
            fontSize: '20px', 
            color: '#ffffff',
            fontWeight: '700',
            background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            ✨ Create Magic
          </h3>
          
          {promptHistory.length > 0 && (
            <button
              onClick={() => setShowHistory(!showHistory)}
              style={{
                padding: '6px 10px',
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '8px',
                color: 'white',
                fontSize: '12px',
                cursor: 'pointer',
                backdropFilter: 'blur(10px)'
              }}
            >
              📚 History
            </button>
          )}
        </div>

        <p style={{
          margin: '0 0 20px 0',
          fontSize: '14px',
          color: 'rgba(255,255,255,0.8)',
          textAlign: 'center',
          lineHeight: '1.5'
        }}>
          Describe your vision and watch it come to life
        </p>
        
        <div style={{ position: 'relative' }}>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Build a course selling website with dynamic functionality..."
            style={{ 
              width: '100%', 
              height: '110px',
              background: 'rgba(255,255,255,0.08)',
              color: '#ffffff',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: '16px',
              padding: '16px',
              fontSize: '14px',
              resize: 'vertical',
              fontFamily: 'inherit',
              boxSizing: 'border-box',
              backdropFilter: 'blur(10px)',
              transition: 'all 0.3s ease',
              lineHeight: '1.5'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = 'rgba(168, 85, 247, 0.5)';
              e.target.style.background = 'rgba(255,255,255,0.12)';
              e.target.style.boxShadow = '0 0 20px rgba(168, 85, 247, 0.2)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'rgba(255,255,255,0.15)';
              e.target.style.background = 'rgba(255,255,255,0.08)';
              e.target.style.boxShadow = 'none';
            }}
          />
          
          {/* Character count indicator */}
          <div style={{
            position: 'absolute',
            bottom: '8px',
            right: '12px',
            fontSize: '11px',
            color: 'rgba(255,255,255,0.5)',
            pointerEvents: 'none'
          }}>
            {prompt.length}/500
          </div>
        </div>
        
        <button 
          onClick={onGenerate} 
          disabled={isLoading || !prompt.trim()}
          style={{
            width: '100%',
            padding: '14px 24px',
            background: isLoading 
              ? 'rgba(255,255,255,0.1)' 
              : 'linear-gradient(135deg, #a855f7 0%, #ec4899 50%, #f59e0b 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '16px',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            fontSize: '15px',
            marginTop: '16px',
            fontWeight: '600',
            opacity: (!prompt.trim() && !isLoading) ? 0.6 : 1,
            transform: 'translateY(0)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: isLoading 
              ? 'none' 
              : '0 8px 25px rgba(168, 85, 247, 0.4), 0 2px 10px rgba(236, 72, 153, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            position: 'relative',
            overflow: 'hidden'
          }}
          onMouseEnter={(e) => {
            if (!isLoading && prompt.trim()) {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 12px 35px rgba(168, 85, 247, 0.6), 0 4px 15px rgba(236, 72, 153, 0.3)';
            }
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 8px 25px rgba(168, 85, 247, 0.4), 0 2px 10px rgba(236, 72, 153, 0.2)';
          }}
        >
          {/* Button background animation */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: '-100%',
            width: '100%',
            height: '100%',
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
            transition: 'left 0.5s'
          }}></div>
          
          {isLoading ? (
            <>
              <div style={{
                width: '18px',
                height: '18px',
                border: '2px solid rgba(255,255,255,0.3)',
                borderTop: '2px solid white',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }}></div>
              Creating Magic...
            </>
          ) : (
            <>
              <span style={{ fontSize: '16px' }}>🎨</span>
              Generate Code
            </>
          )}
        </button>
        
        <div style={{ 
          marginTop: '12px', 
          fontSize: '12px', 
          color: 'rgba(255,255,255,0.6)',
          textAlign: 'center'
        }}>
          💡 Press Cmd+Enter to generate instantly
        </div>
      </div>

      {/* History Panel */}
      {showHistory && promptHistory.length > 0 && (
        <div style={{
          background: 'rgba(255,255,255,0.05)',
          borderRadius: '16px',
          padding: '16px',
          marginBottom: '20px',
          border: '1px solid rgba(255,255,255,0.1)',
          backdropFilter: 'blur(20px)',
          maxHeight: '200px',
          overflowY: 'auto'
        }}>
          <h4 style={{ 
            margin: '0 0 12px 0', 
            fontSize: '14px', 
            color: 'rgba(255,255,255,0.8)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            📚 Recent Prompts
          </h4>
          {promptHistory.map((historyPrompt, index) => (
            <div
              key={index}
              onClick={() => onSelectFromHistory(historyPrompt)}
              style={{
                padding: '8px 12px',
                background: 'rgba(255,255,255,0.05)',
                borderRadius: '8px',
                marginBottom: '6px',
                cursor: 'pointer',
                fontSize: '12px',
                color: 'rgba(255,255,255,0.7)',
                transition: 'all 0.2s ease',
                border: '1px solid transparent'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(255,255,255,0.1)';
                e.target.style.borderColor = 'rgba(168, 85, 247, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(255,255,255,0.05)';
                e.target.style.borderColor = 'transparent';
              }}
            >
              {historyPrompt.slice(0, 60)}...
            </div>
          ))}
        </div>
      )}

      {/* Files Section */}
      <div style={{
        background: 'rgba(255,255,255,0.05)',
        borderRadius: '16px',
        padding: '20px',
        flex: 1,
        border: '1px solid rgba(255,255,255,0.1)',
        backdropFilter: 'blur(20px)'
      }}>
        <h3 style={{ 
          margin: '0 0 16px 0', 
          fontSize: '16px', 
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontWeight: '600'
        }}>
          📁 Project Files
        </h3>
        
        <div style={{ flex: 1, overflow: 'auto' }}>
          {Object.keys(files).map((file) => (
            <div 
              key={file} 
              onClick={() => setActiveFile(file)}
              style={{ 
                cursor: 'pointer',
                padding: '12px 16px',
                borderRadius: '12px',
                marginBottom: '8px',
                background: activeFile === file 
                  ? 'linear-gradient(135deg, rgba(168, 85, 247, 0.3) 0%, rgba(236, 72, 153, 0.2) 100%)' 
                  : 'rgba(255,255,255,0.05)',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                color: '#ffffff',
                transition: 'all 0.3s ease',
                border: activeFile === file 
                  ? '1px solid rgba(168, 85, 247, 0.4)' 
                  : '1px solid rgba(255,255,255,0.1)',
                boxShadow: activeFile === file 
                  ? '0 4px 20px rgba(168, 85, 247, 0.2)' 
                  : 'none'
              }}
              onMouseEnter={(e) => {
                if (activeFile !== file) {
                  e.target.style.background = 'rgba(255,255,255,0.1)';
                  e.target.style.borderColor = 'rgba(255,255,255,0.2)';
                }
              }}
              onMouseLeave={(e) => {
                if (activeFile !== file) {
                  e.target.style.background = 'rgba(255,255,255,0.05)';
                  e.target.style.borderColor = 'rgba(255,255,255,0.1)';
                }
              }}
            >
              <span style={{ marginRight: '12px', fontSize: '18px' }}>
                {getFileIcon(file)}
              </span>
              <span style={{ fontWeight: activeFile === file ? '600' : '400' }}>
                {file}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PromptPanel;
