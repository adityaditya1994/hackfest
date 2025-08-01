import React from 'react';
import { Message } from './ChatbotUI';

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.type === 'user';
  
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
      <div className={`max-w-[80%] ${isUser ? 'order-2' : 'order-1'}`}>
        {/* Avatar */}
        {!isUser && (
          <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center mb-1">
            <span className="text-white text-sm font-bold">🤖</span>
          </div>
        )}
        
        {/* Message Bubble */}
        <div
          className={`
            px-4 py-3 rounded-2xl text-sm leading-relaxed
            ${isUser 
              ? 'bg-primary-500 text-white rounded-br-md' 
              : 'bg-white text-gray-800 border border-gray-200 rounded-bl-md shadow-sm'
            }
          `}
        >
          <div className="whitespace-pre-wrap break-words">
            {message.content}
          </div>
        </div>
        
        {/* Timestamp */}
        <div className={`text-xs text-gray-500 mt-1 ${isUser ? 'text-right' : 'text-left'}`}>
          {message.timestamp.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: true 
          })}
        </div>
      </div>
      
      {/* User Avatar */}
      {isUser && (
        <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center mb-1 ml-2">
          <span className="text-white text-sm font-bold">👤</span>
        </div>
      )}
    </div>
  );
}; 