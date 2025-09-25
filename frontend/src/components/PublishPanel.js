// components/PublishPanel.js
import React, { useState, useEffect } from 'react';
import { 
  publishService, 
  copyToClipboard
} from '../utils/publishUtils';

const PublishPanel = ({ files, projectName = 'My AI Project', isVisible = false, onClose }) => {
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishHistory, setPublishHistory] = useState([]);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [publishResult, setPublishResult] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setPublishHistory(publishService.getHistory());
  }, []);

  const handlePublish = async () => {
    if (Object.keys(files).length === 0) {
      alert('No files to publish. Generate some code first!');
      return;
    }

    setIsPublishing(true);
    try {
      const result = await publishService.publishToNetlify(files, projectName);
      
      setPublishResult(result);
      setPublishHistory(publishService.getHistory());
      setShowPublishModal(true);
    } catch (error) {
      alert(`Failed to publish: ${error.message}`);
    } finally {
      setIsPublishing(false);
    }
  };

  const handleCopyUrl = async (url) => {
    const success = await copyToClipboard(url);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } else {
      alert('Failed to copy URL to clipboard');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <>
      {/* Overlay */}
      {isVisible && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.3)',
            backdropFilter: 'blur(4px)',
            zIndex: 999,
            transition: 'all 0.3s ease'
          }}
          onClick={onClose}
        />
      )}
      
      {/* Slide-in Panel */}
      <div style={{
        position: 'fixed',
        top: 0,
        right: isVisible ? 0 : '-420px',
        width: '420px',
        height: '100vh',
        background: 'linear-gradient(135deg, rgba(15, 15, 35, 0.95) 0%, rgba(26, 26, 46, 0.95) 100%)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRight: 'none',
        zIndex: 1000,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Header */}
        <div style={{
          padding: '20px',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <h3 style={{
            margin: 0,
            fontSize: '18px',
            fontWeight: '700',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span style={{
              background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
              padding: '6px',
              borderRadius: '8px',
              fontSize: '14px'
            }}>🚀</span>
            Publish Project
          </h3>
          
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '8px',
              color: '#ffffff',
              padding: '8px',
              cursor: 'pointer',
              fontSize: '16px',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(255,255,255,0.2)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'rgba(255,255,255,0.1)';
            }}
          >
            ✕
          </button>
        </div>
        
        {/* Content */}
        <div style={{ padding: '20px', flex: 1 }}>
          {/* Project Info */}
          <div style={{
            background: 'rgba(255,255,255,0.05)',
            padding: '16px',
            borderRadius: '12px',
            marginBottom: '20px',
            border: '1px solid rgba(255,255,255,0.1)'
          }}>
            <h4 style={{
              margin: '0 0 8px 0',
              fontSize: '14px',
              fontWeight: '600',
              color: 'rgba(255,255,255,0.9)'
            }}>
              Project: {projectName}
            </h4>
            <p style={{
              margin: 0,
              fontSize: '12px',
              color: 'rgba(255,255,255,0.6)'
            }}>
              {Object.keys(files).length} files ready to publish
            </p>
          </div>

          {/* Publish Button */}
          <button
            onClick={handlePublish}
            disabled={isPublishing || Object.keys(files).length === 0}
            style={{
              width: '100%',
              padding: '14px',
              background: isPublishing
                ? 'rgba(245, 158, 11, 0.5)'
                : 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
              color: 'white',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '10px',
              cursor: isPublishing || Object.keys(files).length === 0 ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'all 0.3s ease',
              marginBottom: '20px'
            }}
          >
            {isPublishing ? (
              <>
                <div style={{
                  width: '16px',
                  height: '16px',
                  border: '2px solid rgba(255,255,255,0.3)',
                  borderTop: '2px solid white',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }}></div>
                Publishing...
              </>
            ) : (
              <>
                <span>🚀</span>
                Publish to Netlify
              </>
            )}
          </button>

          {/* Publish History */}
          {publishHistory.length > 0 && (
            <div>
              <h4 style={{
                margin: '0 0 12px 0',
                fontSize: '16px',
                fontWeight: '600',
                color: 'rgba(255,255,255,0.9)'
              }}>
                Recent Publishes
              </h4>
              
              <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                {publishHistory.map((record) => (
                  <div
                    key={record.id}
                    style={{
                      background: 'rgba(255,255,255,0.05)',
                      padding: '12px',
                      borderRadius: '8px',
                      marginBottom: '8px',
                      border: '1px solid rgba(255,255,255,0.1)'
                    }}
                  >
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: '6px'
                    }}>
                      <div>
                        <div style={{
                          fontSize: '13px',
                          fontWeight: '600',
                          color: '#ffffff',
                          marginBottom: '2px'
                        }}>
                          {record.name}
                        </div>
                        <div style={{
                          fontSize: '11px',
                          color: 'rgba(255,255,255,0.6)'
                        }}>
                          {formatDate(record.timestamp)} • {record.service}
                        </div>
                      </div>
                      
                      <div style={{ display: 'flex', gap: '4px' }}>
                        <button
                          onClick={() => handleCopyUrl(record.url)}
                          style={{
                            padding: '4px 6px',
                            background: 'rgba(255,255,255,0.1)',
                            border: 'none',
                            borderRadius: '4px',
                            color: 'rgba(255,255,255,0.8)',
                            cursor: 'pointer',
                            fontSize: '10px'
                          }}
                          title="Copy URL"
                        >
                          📋
                        </button>
                        <button
                          onClick={() => window.open(record.url, '_blank')}
                          style={{
                            padding: '4px 6px',
                            background: 'rgba(255,255,255,0.1)',
                            border: 'none',
                            borderRadius: '4px',
                            color: 'rgba(255,255,255,0.8)',
                            cursor: 'pointer',
                            fontSize: '10px'
                          }}
                          title="Open URL"
                        >
                          🔗
                        </button>
                      </div>
                    </div>
                    
                    <div style={{
                      fontSize: '10px',
                      color: 'rgba(255,255,255,0.5)',
                      fontFamily: 'monospace',
                      wordBreak: 'break-all'
                    }}>
                      {record.url}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Success Modal */}
        {showPublishModal && publishResult && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.7)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1001
          }}>
            <div style={{
              background: 'linear-gradient(135deg, rgba(15, 15, 35, 0.95) 0%, rgba(26, 26, 46, 0.95) 100%)',
              backdropFilter: 'blur(20px)',
              borderRadius: '16px',
              border: '1px solid rgba(255,255,255,0.2)',
              padding: '32px',
              maxWidth: '400px',
              width: '90%',
              textAlign: 'center'
            }}>
              <div style={{
                fontSize: '48px',
                marginBottom: '16px'
              }}>🎉</div>
              
              <h3 style={{
                fontSize: '24px',
                fontWeight: '700',
                color: '#ffffff',
                marginBottom: '12px'
              }}>
                Published Successfully!
              </h3>
              
              <p style={{
                fontSize: '16px',
                color: 'rgba(255,255,255,0.8)',
                marginBottom: '24px'
              }}>
                Your project is now live and accessible.
              </p>
              
              <div style={{
                background: 'rgba(0,0,0,0.3)',
                padding: '12px',
                borderRadius: '10px',
                marginBottom: '24px',
                wordBreak: 'break-all',
                fontSize: '14px',
                color: '#ffffff',
                fontFamily: 'monospace'
              }}>
                {publishResult.url}
              </div>
              
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                <button
                  onClick={() => handleCopyUrl(publishResult.url)}
                  style={{
                    padding: '10px 20px',
                    background: copied 
                      ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                      : 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.1) 100%)',
                    color: 'white',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '600',
                    transition: 'all 0.3s ease'
                  }}
                >
                  {copied ? '✅ Copied!' : '📋 Copy URL'}
                </button>
                
                <button
                  onClick={() => window.open(publishResult.url, '_blank')}
                  style={{
                    padding: '10px 20px',
                    background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '600',
                    transition: 'all 0.3s ease'
                  }}
                >
                  🔗 Open Site
                </button>
                
                <button
                  onClick={() => setShowPublishModal(false)}
                  style={{
                    padding: '10px 20px',
                    background: 'rgba(255,255,255,0.1)',
                    color: 'white',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '600',
                    transition: 'all 0.3s ease'
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default PublishPanel;
