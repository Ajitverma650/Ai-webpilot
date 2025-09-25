// hooks/useFileManager.js
import { useState } from 'react';

const useFileManager = () => {
  const [files, setFiles] = useState({
    'index.html': `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 40px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .welcome {
            text-align: center;
            color: white;
            background: rgba(255,255,255,0.1);
            padding: 40px;
            border-radius: 20px;
            backdrop-filter: blur(10px);
        }
        h1 { font-size: 2.5em; margin-bottom: 20px; }
        p { font-size: 1.2em; opacity: 0.9; }
    </style>
</head>
<body>
    <div class="welcome">
        <h1>🚀 AI Code Generator</h1>
        <p>Enter a prompt to generate your web application!</p>
        <p>Try: "Create a todo app with dark mode" or "Build a calculator with animations"</p>
    </div>
</body>
</html>`,
    'styles.css': '',
    'script.js': ''
  });

  const [activeFile, setActiveFile] = useState('index.html');

  const updateFiles = (newFiles) => {
    setFiles(newFiles);
  };

  const updateFile = (filename, content) => {
    setFiles(prevFiles => ({
      ...prevFiles,
      [filename]: content
    }));
  };

  return {
    files,
    activeFile,
    setActiveFile,
    setFiles,
    updateFiles,
    updateFile
  };
};

export default useFileManager;
