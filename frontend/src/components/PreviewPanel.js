// components/PreviewPanel.js
import React, { useState, useEffect } from 'react';

const PreviewPanel = ({ files, onRunProject, showPreview }) => {
  const [previewContent, setPreviewContent] = useState('');

  useEffect(() => {
    const combineFiles = () => {
      let html = files['index.html'] || '';
      const css = files['styles.css'] || '';
      const js = files['script.js'] || '';

      if (!html && !css && !js) return '';

      if (css) {
        const styleTag = `<style>${css}</style>`;
        html = html.includes('</head>') 
          ? html.replace('</head>', `  ${styleTag}\n</head>`)
          : `${styleTag}\n${html}`;
      }

      if (js) {
        const scriptTag = `<script>${js}<\/script>`;
        html = html.includes('</body>')
          ? html.replace('</body>', `  ${scriptTag}\n</body>`)
          : `${html}\n${scriptTag}`;
      }
      
      html = html.replace(/<link[^>]*href=["']styles\.css["'][^>]*>/gi, '');
      html = html.replace(/<script[^>]*src=["']script\.js["'][^>]*><\/script>/gi, '');

      return html;
    };

    setPreviewContent(combineFiles());
  }, [files]);

  if (!showPreview) return null;

  return (
    <div style={{ 
      flex: 1,
      background: '#F9FAFB',
      display: 'flex',
      flexDirection: 'column',
      minHeight: 0
    }}>
      <div style={{
        padding: '12px 20px',
        background: '#ffffff',
        borderTop: '1px solid #E5E7EB',
        fontSize: '14px',
        color: '#1F2937',
        display: 'flex',
        alignItems: 'center',
        fontWeight: '600',
        minHeight: '48px',
        boxShadow: '0 -1px 3px rgba(0,0,0,0.05)'
      }}>
        Live Preview
      </div>
      
      <div style={{ flex: 1, position: 'relative' }}>
        <iframe
          title="preview"
          srcDoc={previewContent}
          style={{ width: '100%', height: '100%', border: 'none' }}
          sandbox="allow-scripts allow-same-origin"
        />
      </div>
    </div>
  );
};

export default PreviewPanel;