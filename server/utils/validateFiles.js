// utils/validateFiles.js

function validateAndFixFiles(files) {
  const validatedFiles = { ...files };

  if (!validatedFiles['index.html'] || !validatedFiles['index.html'].trim()) {
    validatedFiles['index.html'] = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AI Generated Project</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <div class="container">
    <h1>Welcome</h1>
    <p>This is an AI-generated web application.</p>
  </div>
  <script src="script.js"></script>
</body>
</html>`;
  }

  if (!validatedFiles['styles.css'] || !validatedFiles['styles.css'].trim()) {
    validatedFiles['styles.css'] = `body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: linear-gradient(135deg, #667eea, #764ba2);
  margin: 0; padding: 20px; min-height: 100vh;
}
.container {
  max-width: 800px; margin: auto; background: white; padding: 30px;
  border-radius: 10px; box-shadow: 0 10px 30px rgba(0,0,0,0.2);
}`;
  }

  if (!validatedFiles['script.js'] || !validatedFiles['script.js'].trim()) {
    validatedFiles['script.js'] = `console.log('AI Project loaded successfully');`;
  }

  return validatedFiles;
}

module.exports = validateAndFixFiles;
