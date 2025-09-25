// utils/publishUtils.js
import JSZip from 'jszip';

const NETLIFY_API_BASE = 'https://api.netlify.com/api/v1';
const GITHUB_API_BASE = 'https://api.github.com';
const VERCEL_API_BASE = 'https://api.vercel.com';
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

// Configuration from environment variables
const CONFIG = {
  netlify: {
    apiToken: process.env.REACT_APP_NETLIFY_API_TOKEN,
  },
  github: {
    token: process.env.REACT_APP_GITHUB_TOKEN,
    username: process.env.REACT_APP_GITHUB_USERNAME,
  },
  vercel: {
    token: process.env.REACT_APP_VERCEL_TOKEN,
  },
  demoMode: process.env.REACT_APP_DEMO_MODE === 'true'
};

// Debug logging
console.log('Environment check:', {
  apiUrl: API_URL,
  netlifyToken: process.env.REACT_APP_NETLIFY_API_TOKEN ? 'Present' : 'Missing',
  tokenLength: process.env.REACT_APP_NETLIFY_API_TOKEN?.length || 0,
  demoMode: CONFIG.demoMode
});

// Check if service is configured
const isServiceConfigured = (service) => {
  switch (service) {
    case 'netlify':
      return !!CONFIG.netlify.apiToken;
    case 'github-pages':
      return !!(CONFIG.github.token && CONFIG.github.username);
    case 'vercel':
      return !!CONFIG.vercel.token;
    default:
      return false;
  }
};

export class PublishService {
  constructor() {
    this.publishHistory = JSON.parse(localStorage.getItem('publishHistory') || '[]');
  }

  async publishToNetlify(files, projectName) {
    if (!CONFIG.netlify.apiToken) {
      throw new Error('Netlify API token not configured. Please add REACT_APP_NETLIFY_API_TOKEN to your .env file');
    }

    try {
      // Ensure we have an index.html file
      if (!files['index.html']) {
        throw new Error('index.html file is required for Netlify deployment');
      }

      // Validate file structure
      const validFiles = {};
      Object.entries(files).forEach(([filename, content]) => {
        if (content && content.trim()) {
          validFiles[filename] = content;
        }
      });

      if (Object.keys(validFiles).length === 0) {
        throw new Error('No valid files to publish');
      }

      console.log('Publishing files to Netlify:', Object.keys(validFiles));

      // Use backend proxy for real Netlify publishing
      console.log('Making request to backend...');
      const response = await fetch(`${API_URL}/api/publish/netlify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          files: validFiles,
          projectName,
          apiToken: CONFIG.netlify.apiToken
        })
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        console.error('Error response:', errorData);
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      console.log('Parsing response...');
      const result = await response.json();
      console.log('Success result:', result);
      
      const publishRecord = {
        ...result,
        note: 'Published to real Netlify with proper file structure'
      };
      
      this.addToHistory(publishRecord);
      
      return publishRecord;
    } catch (error) {
      console.error('Netlify publish error:', error);
      throw new Error(`Failed to publish to Netlify: ${error.message}`);
    }
  }

  async publishToGitHubPages(files, projectName) {
    if (!CONFIG.github.token || !CONFIG.github.username) {
      throw new Error('GitHub credentials not configured. Please add REACT_APP_GITHUB_TOKEN and REACT_APP_GITHUB_USERNAME to your .env file');
    }

    try {
      // Use backend proxy for GitHub Pages publishing
      const response = await fetch(`${API_URL}/api/publish/github`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          files,
          projectName,
          token: CONFIG.github.token,
          username: CONFIG.github.username
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      const result = await response.json();
      
      this.addToHistory(result);
      
      return result;
    } catch (error) {
      console.error('GitHub Pages publish error:', error);
      
      // Fallback to demo if backend is not available
      if (error.message.includes('fetch')) {
        console.warn('Backend not available, falling back to demo deployment');
        return this.publishToMockService(files, projectName);
      }
      
      throw new Error(`Failed to publish to GitHub Pages: ${error.message}`);
    }
  }

  async publishToVercel(files, projectName) {
    if (!CONFIG.vercel.token) {
      throw new Error('Vercel token not configured. Please add REACT_APP_VERCEL_TOKEN to your .env file');
    }

    try {
      // Create deployment files for Vercel
      const deploymentFiles = {};
      Object.entries(files).forEach(([filename, content]) => {
        deploymentFiles[filename] = {
          file: content
        };
      });

      // Deploy to Vercel
      const response = await fetch(`${VERCEL_API_BASE}/v13/deployments`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${CONFIG.vercel.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: projectName.toLowerCase().replace(/\s+/g, '-'),
          files: deploymentFiles,
          projectSettings: {
            framework: null
          }
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `Vercel API error: ${response.status}`);
      }

      const result = await response.json();

      const publishRecord = {
        id: result.id,
        name: projectName,
        url: `https://${result.alias || result.url}`,
        service: 'vercel',
        timestamp: new Date().toISOString(),
        status: 'published',
        files: Object.keys(files),
        deploymentUrl: result.inspectorUrl
      };

      this.addToHistory(publishRecord);

      return publishRecord;
    } catch (error) {
      console.error('Vercel publish error:', error);
      throw new Error(`Failed to publish to Vercel: ${error.message}`);
    }
  }

  // Mock publish service for demo
  async publishToMockService(files, projectName) {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate mock URL
      const projectId = Math.random().toString(36).substring(2, 15);
      const mockUrl = `https://${projectId}.ai-web-builder.app`;
      
      const publishRecord = {
        id: projectId,
        name: projectName,
        url: mockUrl,
        service: 'ai-web-builder',
        timestamp: new Date().toISOString(),
        status: 'published',
        files: Object.keys(files),
        preview: true // Mark as preview/mock
      };
      
      this.addToHistory(publishRecord);
      
      return publishRecord;
    } catch (error) {
      console.error('Mock publish error:', error);
      throw new Error(`Failed to publish: ${error.message}`);
    }
  }

  async publish(files, projectName, service = 'netlify') {
    // Only support Netlify for now
    if (!isServiceConfigured('netlify')) {
      throw new Error('Netlify is not configured. Please add your API token to the .env file.');
    }
    return await this.publishToNetlify(files, projectName);
  }

  addToHistory(record) {
    this.publishHistory.unshift(record);
    // Keep only last 10 publishes
    this.publishHistory = this.publishHistory.slice(0, 10);
    localStorage.setItem('publishHistory', JSON.stringify(this.publishHistory));
  }

  getHistory() {
    return this.publishHistory;
  }

  async updateProject(publishId, files) {
    // Find the publish record
    const record = this.publishHistory.find(r => r.id === publishId);
    if (!record) {
      throw new Error('Publish record not found');
    }
    
    // Update based on service
    if (record.service === 'ai-web-builder') {
      // Mock update
      await new Promise(resolve => setTimeout(resolve, 1500));
      record.timestamp = new Date().toISOString();
      record.files = Object.keys(files);
      localStorage.setItem('publishHistory', JSON.stringify(this.publishHistory));
      return record;
    }
    
    // Add real update logic for other services
    throw new Error('Update not implemented for this service');
  }

  async deleteProject(publishId) {
    this.publishHistory = this.publishHistory.filter(r => r.id !== publishId);
    localStorage.setItem('publishHistory', JSON.stringify(this.publishHistory));
  }
}

// Get available publishing services
export const getAvailableServices = () => {
  const services = [
    {
      id: 'ai-web-builder',
      name: 'AI Web Builder (Demo)',
      available: true,
      free: true,
      description: 'Free demo hosting for testing'
    }
  ];

  if (isServiceConfigured('netlify')) {
    services.push({
      id: 'netlify',
      name: 'Netlify',
      available: true,
      free: true,
      description: 'Professional hosting with SSL'
    });
  }

  if (isServiceConfigured('github-pages')) {
    services.push({
      id: 'github-pages',
      name: 'GitHub Pages',
      available: true,
      free: true,
      description: 'Host on GitHub with version control'
    });
  }

  if (isServiceConfigured('vercel')) {
    services.push({
      id: 'vercel',
      name: 'Vercel',
      available: true,
      free: true,
      description: 'Modern hosting with edge functions'
    });
  }

  return services;
};

// Check if any real services are configured
export const hasRealServices = () => {
  return isServiceConfigured('netlify') || 
         isServiceConfigured('github-pages') || 
         isServiceConfigured('vercel');
};

// Get service configuration status
export const getServiceStatus = () => {
  return {
    netlify: isServiceConfigured('netlify'),
    github: isServiceConfigured('github-pages'),
    vercel: isServiceConfigured('vercel'),
    demoMode: CONFIG.demoMode
  };
};

export const publishService = new PublishService();

// Utility to generate shareable link
export const generateShareableLink = (publishRecord) => {
  const shareData = {
    title: publishRecord.name,
    text: `Check out this AI-generated web project: ${publishRecord.name}`,
    url: publishRecord.url
  };
  
  return shareData;
};

// Utility to copy publish URL to clipboard
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      document.body.removeChild(textArea);
      return true;
    } catch (fallbackErr) {
      document.body.removeChild(textArea);
      return false;
    }
  }
};
