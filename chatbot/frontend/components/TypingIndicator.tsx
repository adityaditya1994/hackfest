import React from 'react';

export const TypingIndicator: React.FC = () => {
  return (
    <div className="flex justify-start animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="max-w-[80%]">
        {/* Bot Avatar */}
        <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center mb-1">
          <span className="text-white text-sm font-bold">🤖</span>
        </div>
        
        {/* Typing Bubble */}
        <div className="bg-white text-gray-800 border border-gray-200 rounded-2xl rounded-bl-md shadow-sm px-4 py-3">
          <div className="flex items-center space-x-1">
            <span className="text-sm text-gray-600">Thinking</span>
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 