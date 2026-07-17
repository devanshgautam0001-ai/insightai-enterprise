import React from 'react';

export const TypingAnimation: React.FC = () => {
  return (
    <div className="flex items-center space-x-1 py-2 px-1" id="typing-indicator">
      <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
      <div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
      <div className="w-1.5 h-1.5 bg-purple-600 rounded-full animate-bounce"></div>
    </div>
  );
};
export default TypingAnimation;
