// components/PreviewPanel.js
import React, { useState, useEffect } from 'react';

const PreviewPanel = ({ files, onRunProject, showPreview }) => {
  const [previewContent, setPreviewContent] = useState('');

  useEffect(() => {
    // Combine HTML, CSS, and JS into a single document for preview
    const combineFiles = () => {
      let html = files['index.html'] || '';
      const css = files['styles.css'] || '';
      const js = files['script.js'] || '';

      // If no files exist, return empty string to show empty state
      if (!html && !css && !js) {
        return '';
      }

      // Clean and inject CSS
      if (css && css.trim()) {
        const styleTag = `<style>${css}</style>`;
        
        // Try multiple injection points for better compatibility
        if (html.includes('</head>')) {
          html = html.replace('</head>', `  ${styleTag}\n</head>`);
        } else if (html.includes('<head>')) {
          html = html.replace('<head>', `<head>\n  ${styleTag}`);
        } else if (html.includes('<title>')) {
          html = html.replace('</title>', `</title>\n  ${styleTag}`);
        } else {
          // Fallback: inject at the beginning
          html = `${styleTag}\n${html}`;
        }
      }

      // Clean and inject JavaScript
      if (js && js.trim()) {
        const scriptTag = `<script>\n${js}\n</script>`;
        
        if (html.includes('</body>')) {
          html = html.replace('</body>', `  ${scriptTag}\n</body>`);
        } else if (html.includes('<script src="script.js">')) {
          html = html.replace('<script src="script.js"></script>', scriptTag);
        } else {
          // Fallback: inject at the end
          html = `${html}\n${scriptTag}`;
        }
      }

      // Remove external file references since we're inlining everything
      html = html.replace(/<link[^>]*href=["']styles\.css["'][^>]*>/gi, '');
      html = html.replace(/<script[^>]*src=["']script\.js["'][^>]*><\/script>/gi, '');

      return html;
    };

    setPreviewContent(combineFiles());
  }, [files]);

  if (!showPreview) return null;

  return (
    <div style={{ 
      flex: showPreview ? 1 : 0,
      display: showPreview ? 'flex' : 'none',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      flexDirection: 'column',
      minHeight: 'calc(100vh - 60px)',
      position: 'relative',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      opacity: showPreview ? 1 : 0,
      transform: showPreview ? 'translateX(0)' : 'translateX(20px)'
    }}>
      <div style={{
        padding: '12px 20px',
        background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(0,0,0,0.1)',
        fontSize: '14px',
        color: '#374151',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        minHeight: '45px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px',
          fontWeight: '600' 
        }}>
          <span style={{
            background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
            color: 'white',
            padding: '4px 8px',
            borderRadius: '6px',
            fontSize: '12px'
          }}>🌐</span>
          Live Preview
        </div>
        
        <div style={{ display: 'flex', gap: '8px' }}>
          <button 
            onClick={onRunProject}
            style={{
              padding: '6px 12px',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              transition: 'all 0.3s ease',
              boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-1px)';
              e.target.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 2px 8px rgba(16, 185, 129, 0.3)';
            }}
          >
            <span>🚀</span>
            Open in New Tab
          </button>
          
          {/* Refresh button for preview */}
          <button 
            onClick={() => window.location.reload()}
            style={{
              padding: '6px 8px',
              background: 'rgba(107, 114, 128, 0.1)',
              color: '#6b7280',
              border: '1px solid rgba(107, 114, 128, 0.2)',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(107, 114, 128, 0.2)';
              e.target.style.color = '#374151';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'rgba(107, 114, 128, 0.1)';
              e.target.style.color = '#6b7280';
            }}
          >
            🔄
          </button>
        </div>
      </div>
      
      <div style={{ 
        flex: 1, 
        overflow: 'hidden',
        position: 'relative',
        margin: '8px',
        borderRadius: '12px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        border: '1px solid rgba(0,0,0,0.1)'
      }}>
        {/* Loading/Empty overlay */}
        {!previewContent && (
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.95) 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10,
            backdropFilter: 'blur(20px)'
          }}>
            <div style={{
              textAlign: 'center',
              color: '#6b7280',
              maxWidth: '280px'
            }}>
              <div style={{
                width: '48px',
                height: '48px',
                border: '3px solid #e5e7eb',
                borderTop: '3px solid #a855f7',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                margin: '0 auto 16px'
              }}></div>
              <h3 style={{ 
                margin: '0 0 8px 0', 
                fontSize: '16px', 
                fontWeight: '600',
                color: '#374151'
              }}>
                {Object.keys(files).length === 0 ? 'No project generated yet' : 'Preparing preview...'}
              </h3>
              <p style={{ 
                margin: 0, 
                fontSize: '14px',
                lineHeight: '1.5'
              }}>
                {Object.keys(files).length === 0 
                  ? 'Generate some code first, then switch to preview mode to see it in action.'
                  : 'Loading your web project preview...'
                }
              </p>
            </div>
          </div>
        )}
        
        <iframe
          title="preview"
          srcDoc={previewContent}
          style={{ 
            width: '100%', 
            height: '100%', 
            border: 'none',
            background: 'white',
            borderRadius: '12px'
          }}
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
        />
      </div>
    </div>
  );
};

export default PreviewPanel;
