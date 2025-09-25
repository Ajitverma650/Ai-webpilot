
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

let genAI;

try {
  genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENAI_API_KEY);
} catch (err) {
  console.error("Failed to initialize Gemini AI:", err);
  process.exit(1);
}

const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
module.exports = model;
