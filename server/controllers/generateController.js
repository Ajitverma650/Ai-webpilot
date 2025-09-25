// controllers/generateController.js
const model = require('../config/genai');
const validateAndFixFiles = require('../utils/validateFiles');

const generateWebApp = async (req, res) => {
    try {
        const { prompt } = req.body;
        if (!prompt) throw new Error("Prompt is required");

        const enhancedPrompt = `
Generate a complete web application based on this request: "${prompt}"

IMPORTANT: Please provide THREE separate files with clean separation of concerns:

1. HTML file (index.html): Structure only, no inline CSS or JavaScript
2. CSS file (styles.css): All styling, including responsive design and animations
3. JavaScript file (script.js): All interactive functionality

Please provide the response in this EXACT JSON format:
{
  "files": {
    "index.html": "HTML structure with proper links to external CSS and JS files",
    "styles.css": "Complete CSS styling including responsive design and animations",
    "script.js": "All JavaScript functionality and event handlers"
  }
}

Requirements:
- HTML should link to styles.css and script.js using: <link rel="stylesheet" href="styles.css"> and <script src="script.js"></script>
- Create a fully functional, responsive web application
- Include modern CSS with animations/transitions
- Make it interactive with JavaScript
- Ensure all files work together seamlessly
- Use modern web development best practices
- Make it visually appealing and professional
- Include proper error handling in JavaScript
- Make the design responsive for mobile and desktop

The application should be: ${prompt}
`;

        const result = await model.generateContent(enhancedPrompt);
        const response = await result.response;
        let aiResponse = response.text();

        const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            try {
                const parsedResponse = JSON.parse(jsonMatch[0]);
                const validatedFiles = validateAndFixFiles(parsedResponse.files || {});
                res.json({ files: validatedFiles });
            } catch (parseError) {
                const fallbackFiles = {
                    'index.html': `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Generated App</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="container">
        <h1>Generated Application</h1>
        <div class="content">
            <p>AI Response:</p>
            <pre class="ai-response">${aiResponse.substring(0, 500)}...</pre>
        </div>
    </div>
    <script src="script.js"></script>
</body>
</html>`,
                    'styles.css': `body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    margin: 0;
    padding: 20px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
}
.container {
    max-width: 800px;
    margin: 0 auto;
    background: white;
    padding: 30px;
    border-radius: 10px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.2);
}
.ai-response {
    background: #f5f5f5;
    padding: 15px;
    border-radius: 5px;
    overflow-x: auto;
}`,
                    'script.js': `console.log('Generated app loaded successfully');
// Add any interactive functionality here`
                };
                const validatedFiles = validateAndFixFiles(fallbackFiles);
                res.json({ files: validatedFiles });
            }
        } else {
            res.json({
                files: {
                    'index.html': `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AI Generated Response</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="container">
        <h1>AI Generated Response</h1>
        <div class="response-content">${aiResponse.replace(/\n/g, '<br>')}</div>
    </div>
    <script src="script.js"></script>
</body>
</html>`,
                    'styles.css': `body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    margin: 0;
    padding: 20px;
    background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
    min-height: 100vh;
}
.container {
    max-width: 900px;
    margin: 0 auto;
    background: white;
    padding: 40px;
    border-radius: 15px;
    box-shadow: 0 15px 35px rgba(0,0,0,0.1);
}
h1 {
    color: #333;
    text-align: center;
    margin-bottom: 30px;
}
.response-content {
    background: #f8f9fa;
    padding: 20px;
    border-radius: 8px;
    border-left: 4px solid #007acc;
    line-height: 1.6;
}`,
                    'script.js': `document.addEventListener('DOMContentLoaded', function() {
    console.log('AI Web Builder - Response loaded');
    document.documentElement.style.scrollBehavior = 'smooth';
});`
                }
            });
        }
    } catch (error) {
        console.error("Error:", error);
        const errorFiles = validateAndFixFiles({
            'index.html': `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AI Service Temporarily Unavailable</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="container">
        <h1>🤖 AI Service Temporarily Unavailable</h1>
        <p>The AI service is currently experiencing high demand. Please try again in a few minutes.</p>
        <p>This is a temporary issue with Google's AI service, not with our application.</p>
        <button onclick="window.history.back()" style="background: #667eea; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer;">Go Back</button>
    </div>
    <script src="script.js"></script>
</body>
</html>`
        });
        res.status(503).json({ files: errorFiles });
    }
};

module.exports = { generateWebApp };