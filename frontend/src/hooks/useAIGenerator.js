// hooks/useAIGenerator.js
import { useState } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

const useAIGenerator = () => {
  const [isLoading, setIsLoading] = useState(false);

  const generateCode = async (prompt) => {
    if (!prompt.trim()) return null;
    
    setIsLoading(true);
    try {
      const response = await axios.post(`${API_URL}/api/generate`, { prompt });
      if (response.data.files) {
        return response.data.files;
      }
      return null;
    } catch (error) {
      console.error("Error generating code:", error);
      alert("Error generating code. Please check your connection and try again.");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    generateCode,
    isLoading
  };
};

export default useAIGenerator;
