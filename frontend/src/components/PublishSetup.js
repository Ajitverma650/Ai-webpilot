// components/PublishSetup.js
import React, { useState } from 'react';
import { getServiceStatus } from '../utils/publishUtils';

const PublishSetup = ({ onClose }) => {
  const [serviceStatus] = useState(getServiceStatus());

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      alert('Copied to clipboard!');
    } catch (err) {
      alert('Failed to copy to clipboard');
    }
  };

  const services = [
    {
      name: 'Netlify',
      key: 'netlify',
      envVar: 'REACT_APP_NETLIFY_API_TOKEN',
      url: 'https://app.netlify.com/user/applications/personal',
      instructions: 'Go to User Settings → Applications → New access token'
    },
    {
      name: 'GitHub Pages',
      key: 'github',
      envVar: 'REACT_APP_GITHUB_TOKEN',
      url: 'https://github.com/settings/tokens',
      instructions: 'Generate new token with "repo" and "public_repo" scopes'
    },
    {
      name: 'Vercel',
      key: 'vercel',
      envVar: 'REACT_APP_VERCEL_TOKEN',
      url: 'https://vercel.com/account/tokens',
      instructions: 'Create new token in Account Settings → Tokens'
    }
  ];

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      backdropFilter: 'blur(10px)'
    }}>
      <div style={{
        background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.1) 100%)',
        backdropFilter: 'blur(20px)',
        borderRadius: '20px',
        border: '1px solid rgba(255,255,255,0.2)',
        padding: '32px',
        maxWidth: '600px',
        width: '90%',
        maxHeight: '80vh',
        overflowY: 'auto'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px'
        }}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: '700',
            color: '#ffffff',
            margin: 0
          }}>
            🚀 Publishing Setup
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '8px',
              color: '#ffffff',
              padding: '8px 12px',
              cursor: 'pointer'
            }}
          >
            ✕ Close
          </button>
        </div>

        <p style={{
          fontSize: '16px',
          color: 'rgba(255,255,255,0.8)',
          marginBottom: '24px',
          lineHeight: '1.5'
        }}>
          Configure publishing services to deploy your AI-generated projects to the web. 
          Add your API keys to the <code>.env</code> file in the frontend directory.
        </p>

        {services.map((service) => (
          <div
            key={service.key}
            style={{
              background: 'rgba(255,255,255,0.05)',
              borderRadius: '12px',
              border: '1px solid rgba(255,255,255,0.1)',
              padding: '20px',
              marginBottom: '16px'
            }}
          >
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '12px'
            }}>
              <h3 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#ffffff',
                margin: 0
              }}>
                {service.name}
              </h3>
              <span style={{
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '12px',
                fontWeight: '600',
                background: serviceStatus[service.key] 
                  ? 'rgba(34, 197, 94, 0.2)' 
                  : 'rgba(239, 68, 68, 0.2)',
                color: serviceStatus[service.key] ? '#22c55e' : '#ef4444'
              }}>
                {serviceStatus[service.key] ? '✅ Configured' : '❌ Not configured'}
              </span>
            </div>

            <p style={{
              fontSize: '14px',
              color: 'rgba(255,255,255,0.7)',
              marginBottom: '12px'
            }}>
              {service.instructions}
            </p>

            <div style={{
              background: 'rgba(0,0,0,0.3)',
              padding: '12px',
              borderRadius: '8px',
              fontFamily: 'monospace',
              fontSize: '13px',
              color: '#ffffff',
              marginBottom: '12px',
              wordBreak: 'break-all'
            }}>
              {service.envVar}=your_token_here
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => window.open(service.url, '_blank')}
                style={{
                  padding: '8px 12px',
                  background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: '600'
                }}
              >
                🔗 Get Token
              </button>
              <button
                onClick={() => copyToClipboard(service.envVar)}
                style={{
                  padding: '8px 12px',
                  background: 'rgba(255,255,255,0.1)',
                  color: 'white',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: '600'
                }}
              >
                📋 Copy Env Var
              </button>
            </div>
          </div>
        ))}

        <div style={{
          background: 'rgba(59, 130, 246, 0.1)',
          border: '1px solid rgba(59, 130, 246, 0.3)',
          borderRadius: '12px',
          padding: '16px',
          marginTop: '20px'
        }}>
          <h4 style={{
            fontSize: '16px',
            fontWeight: '600',
            color: '#3b82f6',
            margin: '0 0 8px 0'
          }}>
            💡 Quick Start
          </h4>
          <ol style={{
            fontSize: '14px',
            color: 'rgba(255,255,255,0.8)',
            lineHeight: '1.6',
            paddingLeft: '20px'
          }}>
            <li>Choose a service (Netlify recommended for beginners)</li>
            <li>Click "🔗 Get Token" to open the service</li>
            <li>Generate an API token</li>
            <li>Add it to your <code>.env</code> file</li>
            <li>Restart your development server</li>
            <li>Start publishing! 🚀</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default PublishSetup;
