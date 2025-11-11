import React from 'react';

const Loader = ({ message = "AI is thinking..." }) => {
  return (
    <div className="flex items-center space-x-2 p-4">
      {/* Animated dots */}
      <div className="flex items-center space-x-1">
        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
      </div>
      
      {/* Loading text */}
      <span className="text-sm text-gray-600 ml-2">{message}</span>
    </div>
  );
};

export default Loader;