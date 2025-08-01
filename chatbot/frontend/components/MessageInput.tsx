import React, { useState, useRef, useEffect } from 'react';

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export const MessageInput: React.FC<MessageInputProps> = ({ 
  onSendMessage, 
  disabled = false,
  placeholder = "Type your message..."
}) => {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px';
    }
  }, [message]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message);
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const suggestedQuestions = [
    "How many employees are in OneMind?",
    "What's the gender ratio?",
    "How many PhDs do we have?",
    "Show me team locations"
  ];

  const handleSuggestionClick = (suggestion: string) => {
    if (!disabled) {
      onSendMessage(suggestion);
    }
  };

  return (
    <div className="space-y-3">
      {/* Suggested Questions (show only when input is empty) */}
      {message.length === 0 && (
        <div className="flex flex-wrap gap-2">
          {suggestedQuestions.map((question, index) => (
            <button
              key={index}
              onClick={() => handleSuggestionClick(question)}
              disabled={disabled}
              className="text-xs px-3 py-1.5 bg-primary-50 text-primary-700 rounded-full border border-primary-200 hover:bg-primary-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {question}
            </button>
          ))}
        </div>
      )}

      {/* Message Input Form */}
      <form onSubmit={handleSubmit} className="flex items-end space-x-2">
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            disabled={disabled}
            rows={1}
            className="w-full px-4 py-3 pr-12 bg-gray-50 border border-gray-200 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            style={{ minHeight: '48px', maxHeight: '120px' }}
          />
          
          {/* Character Count */}
          {message.length > 0 && (
            <div className="absolute bottom-1 right-1 text-xs text-gray-400">
              {message.length}/500
            </div>
          )}
        </div>

        {/* Send Button */}
        <button
          type="submit"
          disabled={!message.trim() || disabled}
          className="w-12 h-12 bg-primary-500 hover:bg-primary-600 disabled:bg-gray-300 text-white rounded-full flex items-center justify-center transition-colors disabled:cursor-not-allowed shadow-lg hover:shadow-xl disabled:shadow-none"
        >
          {disabled ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          )}
        </button>
      </form>
      
      {/* Input Help Text */}
      <p className="text-xs text-gray-500 text-center">
        Press Enter to send, Shift+Enter for new line
      </p>
    </div>
  );
}; 