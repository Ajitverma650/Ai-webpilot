// components/Header.js
import React from 'react';

const Header = ({ showPreview, setShowPreview, onRunProject, onDownloadProject, files, showPublishPanel, setShowPublishPanel }) => {
  return (
    <div style={{
      padding: '12px 20px',
      borderBottom: '1px solid rgba(255,255,255,0.1)',
      background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.04) 100%)',
      backdropFilter: 'blur(20px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      minHeight: '48px'
    }}>
      <h1 style={{ 
        margin: 0, 
        fontSize: '18px', 
        fontWeight: '700', 
        color: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        <span style={{
          background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
          padding: '6px',
          borderRadius: '8px',
          fontSize: '14px'
        }}>🤖</span>
        <span>AI Web Builder</span>
        <span style={{
          fontSize: '12px',
          color: 'rgba(255,255,255,0.6)',
          fontWeight: '400',
          marginLeft: '8px',
          padding: '2px 8px',
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '12px',
          border: '1px solid rgba(255,255,255,0.1)'
        }}>
          {showPreview ? '👁️ Preview' : '💻 Code'}
        </span>
      </h1>
      
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        {/* Claude-style toggle button */}
        <div 
          style={{
            background: 'rgba(255,255,255,0.08)',
            borderRadius: '14px',
            padding: '3px',
            display: 'flex',
            border: '1px solid rgba(255,255,255,0.12)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
            position: 'relative'
          }}
          title="Toggle between code and preview (⌘K / Ctrl+K)"
        >
          <button 
            onClick={() => setShowPreview(false)}
            style={{
              padding: '10px 18px',
              background: !showPreview 
                ? 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)' 
                : 'transparent',
              color: !showPreview ? '#ffffff' : 'rgba(255,255,255,0.7)',
              border: 'none',
              borderRadius: '11px',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: !showPreview ? '0 4px 12px rgba(168, 85, 247, 0.4)' : 'none',
              transform: !showPreview ? 'translateY(-1px)' : 'translateY(0)',
              minWidth: '80px',
              justifyContent: 'center',
              animation: !showPreview ? 'pulse 2s infinite' : 'none'
            }}
            onMouseEnter={(e) => {
              if (!showPreview) {
                e.target.style.boxShadow = '0 6px 16px rgba(168, 85, 247, 0.5)';
              } else {
                e.target.style.background = 'rgba(255,255,255,0.1)';
              }
            }}
            onMouseLeave={(e) => {
              if (!showPreview) {
                e.target.style.boxShadow = '0 4px 12px rgba(168, 85, 247, 0.4)';
              } else {
                e.target.style.background = 'transparent';
              }
            }}
          >
            <span style={{ fontSize: '14px' }}>💻</span>
            Code
          </button>
          <button 
            onClick={() => setShowPreview(true)}
            style={{
              padding: '10px 18px',
              background: showPreview 
                ? 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)' 
                : 'transparent',
              color: showPreview ? '#ffffff' : 'rgba(255,255,255,0.7)',
              border: 'none',
              borderRadius: '11px',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: showPreview ? '0 4px 12px rgba(168, 85, 247, 0.4)' : 'none',
              transform: showPreview ? 'translateY(-1px)' : 'translateY(0)',
              minWidth: '90px',
              justifyContent: 'center',
              animation: showPreview ? 'pulse 2s infinite' : 'none'
            }}
            onMouseEnter={(e) => {
              if (showPreview) {
                e.target.style.boxShadow = '0 6px 16px rgba(168, 85, 247, 0.5)';
              } else {
                e.target.style.background = 'rgba(255,255,255,0.1)';
              }
            }}
            onMouseLeave={(e) => {
              if (showPreview) {
                e.target.style.boxShadow = '0 4px 12px rgba(168, 85, 247, 0.4)';
              } else {
                e.target.style.background = 'transparent';
              }
            }}
          >
            <span style={{ fontSize: '14px' }}>👁️</span>
            Preview
          </button>
        </div>
        
        
        <button 
          onClick={() => setShowPublishPanel(!showPublishPanel)}
          style={{
            padding: '8px 16px',
            background: showPublishPanel 
              ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' 
              : 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
            color: 'white',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: '10px',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'all 0.3s ease',
            boxShadow: showPublishPanel 
              ? '0 4px 12px rgba(239, 68, 68, 0.3)' 
              : '0 4px 12px rgba(245, 158, 11, 0.3)',
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-1px)';
            e.target.style.boxShadow = showPublishPanel 
              ? '0 6px 20px rgba(239, 68, 68, 0.4)' 
              : '0 6px 20px rgba(245, 158, 11, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = showPublishPanel 
              ? '0 4px 12px rgba(239, 68, 68, 0.3)' 
              : '0 4px 12px rgba(245, 158, 11, 0.3)';
          }}
          title={showPublishPanel ? 'Close publish panel' : 'Open publish panel'}
        >
          <span>{showPublishPanel ? '✕' : '🚀'}</span>
          {showPublishPanel ? 'Close' : 'Publish'}
        </button>
        
        <button 
          onClick={onRunProject}
          style={{
            padding: '8px 16px',
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            color: 'white',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: '10px',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-1px)';
            e.target.style.boxShadow = '0 6px 20px rgba(16, 185, 129, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.3)';
          }}
        >
          <span>🚀</span>
          Run
        </button>
        
        <button 
          onClick={onDownloadProject}
          style={{
            padding: '8px 16px',
            background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
            color: 'white',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: '10px',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-1px)';
            e.target.style.boxShadow = '0 6px 20px rgba(139, 92, 246, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 4px 12px rgba(139, 92, 246, 0.3)';
          }}
        >
          <span>📥</span>
          Download
        </button>
      </div>
    </div>
  );
};

export default Header;
