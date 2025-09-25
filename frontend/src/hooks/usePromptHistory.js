// hooks/usePromptHistory.js
import { useState } from 'react';

const usePromptHistory = () => {
  const [history, setHistory] = useState([]);
  const [currentPrompt, setCurrentPrompt] = useState('');

  const addToHistory = (prompt) => {
    if (prompt.trim()) {
      setHistory(prev => [prompt, ...prev.slice(0, 9)]); // Keep last 10 prompts
      setCurrentPrompt('');
    }
  };

  const selectFromHistory = (prompt) => {
    setCurrentPrompt(prompt);
  };

  return {
    history,
    currentPrompt,
    setCurrentPrompt,
    addToHistory,
    selectFromHistory
  };
};

export default usePromptHistory;
