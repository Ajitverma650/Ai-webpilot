// components/Header.js
import React from 'react';

// Reusable button component for the new theme
const AuroraButton = ({ onClick, children, title, style = {}, onMouseEnter, onMouseLeave }) => (
  <button
    onClick={onClick}
    title={title}
    style={{
      padding: '8px 16px',
      background: 'rgba(255, 255, 255, 0.05)',
      color: '#F9FAFB',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '500',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      transition: 'all 0.2s ease',
      ...style,
    }}
    onMouseEnter={(e) => {
      e.target.style.background = 'rgba(255, 255, 255, 0.1)';
      e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
      if (onMouseEnter) onMouseEnter(e);
    }}
    onMouseLeave={(e) => {
      e.target.style.background = 'rgba(255, 255, 255, 0.05)';
      e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
      if (onMouseLeave) onMouseLeave(e);
    }}
  >
    {children}
  </button>
);

const Header = ({ showPreview, setShowPreview, onRunProject, onDownloadProject, showPublishPanel, setShowPublishPanel }) => {
  return (
    <div style={{
      padding: '10px 24px',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      background: 'rgba(31, 41, 55, 0.3)',
      backdropFilter: 'blur(10px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      minHeight: '60px',
      zIndex: 10
    }}>
      {/* Left Side: Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span style={{ fontSize: '24px' }}>🌌</span>
        <h1 style={{ margin: 0, fontSize: '20px', fontWeight: '600', color: '#ffffff' }}>
          WebPilot
        </h1>
      </div>
      
      {/* Center: Toggle */}
      <div style={{
        background: 'rgba(0,0,0,0.2)',
        borderRadius: '10px',
        padding: '4px',
        display: 'flex',
        border: '1px solid rgba(255,255,255,0.1)',
      }}>
        <button 
          onClick={() => setShowPreview(false)}
          style={{
            padding: '6px 16px',
            background: !showPreview ? '#2DD4BF' : 'transparent',
            color: '#ffffff',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600',
            transition: 'all 0.3s ease',
            boxShadow: !showPreview ? '0 0 15px rgba(45, 212, 191, 0.3)' : 'none',
          }}>
          Code
        </button>
        <button 
          onClick={() => setShowPreview(true)}
          style={{
            padding: '6px 16px',
            background: showPreview ? '#2DD4BF' : 'transparent',
            color: '#ffffff',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600',
            transition: 'all 0.3s ease',
            boxShadow: showPreview ? '0 0 15px rgba(45, 212, 191, 0.3)' : 'none',
          }}>
          Preview
        </button>
      </div>

      {/* Right Side: Action Buttons */}
      <div style={{ display: 'flex', gap: '12px' }}>
        <AuroraButton onClick={onDownloadProject} title="Download project files as .zip">
          <span>📥</span> Download
        </AuroraButton>
        <AuroraButton onClick={() => setShowPublishPanel(!showPublishPanel)} title={showPublishPanel ? 'Close Publish Panel' : 'Publish Project'}>
          <span>🚀</span> Publish
        </AuroraButton>
      </div>
    </div>
  );
};

export default Header;