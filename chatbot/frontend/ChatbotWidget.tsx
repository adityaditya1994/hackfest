import React, { useState, useRef, useEffect } from 'react';
import { ChatbotUI } from './components/ChatbotUI';

export interface ChatbotWidgetProps {
  position?: 'bottom-right' | 'bottom-left';
  theme?: 'light' | 'dark';
}

export const ChatbotWidget: React.FC<ChatbotWidgetProps> = ({ 
  position = 'bottom-right'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const chatbotRef = useRef<HTMLDivElement>(null);

  const toggleChatbot = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div 
      ref={chatbotRef}
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: 99999,
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}
    >
      {/* Chat Window */}
      {isOpen && (
        <div 
          style={{
            position: 'absolute',
            bottom: '80px',
            right: '0px',
            width: '384px',
            height: '600px',
            backgroundColor: 'white',
            borderRadius: '16px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            border: '1px solid #e5e7eb',
            overflow: 'hidden'
          }}
        >
          <ChatbotUI onClose={() => setIsOpen(false)} />
        </div>
      )}
      
      {/* Floating Button - Very Simple */}
      <button
        onClick={toggleChatbot}
        style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          border: 'none',
          background: 'linear-gradient(135deg, #E10075, #8B5CF6)',
          color: 'white',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '24px',
          boxShadow: '0 10px 25px rgba(225, 0, 117, 0.3)',
          transition: 'transform 0.2s',
          outline: 'none'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.1)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
        }}
        title={isOpen ? 'Close HR Assistant' : 'Open HR Assistant'}
      >
        {isOpen ? '✕' : '💬'}
      </button>
    </div>
  );
}; 