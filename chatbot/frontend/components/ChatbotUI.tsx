import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from './ChatMessage';
import { MessageInput } from './MessageInput';
import { TypingIndicator } from './TypingIndicator';

export interface Message {
  id: string;
  content: string;
  type: 'user' | 'bot';
  timestamp: Date;
}

interface ChatbotUIProps {
  onClose: () => void;
}

export const ChatbotUI: React.FC<ChatbotUIProps> = ({ onClose }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const wsRef = useRef<WebSocket | null>(null);

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Initialize WebSocket connection
  useEffect(() => {
    const connectWebSocket = () => {
      try {
        wsRef.current = new WebSocket('ws://localhost:5001');
        
        wsRef.current.onopen = () => {
          console.log('WebSocket connected');
          setIsConnected(true);
        };

        wsRef.current.onmessage = (event) => {
          const data = JSON.parse(event.data);
          
          if (data.type === 'response') {
            setMessages(prev => [...prev, {
              id: Date.now().toString(),
              content: data.content,
              type: 'bot',
              timestamp: new Date(data.timestamp)
            }]);
            setIsTyping(false);
          } else if (data.type === 'typing') {
            setIsTyping(data.isTyping);
          } else if (data.type === 'error') {
            setMessages(prev => [...prev, {
              id: Date.now().toString(),
              content: data.content,
              type: 'bot',
              timestamp: new Date()
            }]);
            setIsTyping(false);
          }
        };

        wsRef.current.onclose = () => {
          console.log('WebSocket disconnected');
          setIsConnected(false);
          // Attempt to reconnect after 3 seconds
          setTimeout(connectWebSocket, 3000);
        };

        wsRef.current.onerror = (error) => {
          console.error('WebSocket error:', error);
          setIsConnected(false);
        };
      } catch (error) {
        console.error('Failed to connect WebSocket:', error);
        setIsConnected(false);
      }
    };

    connectWebSocket();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  const sendMessage = (content: string) => {
    if (!content.trim() || !wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      return;
    }

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: content.trim(),
      type: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);

    // Send to WebSocket
    wsRef.current.send(JSON.stringify({
      type: 'chat',
      content: content.trim()
    }));
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      backgroundColor: 'white',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px',
        background: 'linear-gradient(135deg, #E10075, #8B5CF6)',
        color: 'white'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <span style={{ fontSize: '14px', fontWeight: 'bold' }}>🤖</span>
          </div>
          <div>
            <h3 style={{ margin: 0, fontWeight: '600', fontSize: '16px' }}>HR Analytics Assistant</h3>
            <p style={{ 
              margin: 0, 
              fontSize: '12px', 
              opacity: 0.9,
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              {isConnected ? (
                <>
                  <div style={{
                    width: '8px',
                    height: '8px',
                    backgroundColor: '#10B981',
                    borderRadius: '50%',
                    animation: 'pulse 2s infinite'
                  }} />
                  Online
                </>
              ) : (
                <>
                  <div style={{
                    width: '8px',
                    height: '8px',
                    backgroundColor: '#EF4444',
                    borderRadius: '50%'
                  }} />
                  Connecting...
                </>
              )}
            </p>
          </div>
        </div>
        
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            color: 'rgba(255, 255, 255, 0.8)',
            cursor: 'pointer',
            padding: '8px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '20px',
            fontWeight: 'bold',
            transition: 'all 0.2s',
            width: '32px',
            height: '32px'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = 'white';
            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)';
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
          title="Close chat"
        >
          ✕
        </button>
      </div>

      {/* Messages Area - Fixed Scroll */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '16px',
        backgroundColor: '#F9FAFB',
        maxHeight: 'calc(600px - 140px)', // Total height minus header and input
        minHeight: '300px'
      }}>
        {messages.length === 0 && (
          <div style={{ textAlign: 'center', padding: '32px 0' }}>
            <div style={{
              width: '64px',
              height: '64px',
              backgroundColor: '#FEF3F2',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px'
            }}>
              <span style={{ fontSize: '24px' }}>👋</span>
            </div>
            <h4 style={{ 
              fontWeight: '600', 
              color: '#111827', 
              margin: '0 0 8px',
              fontSize: '16px'
            }}>Welcome to HR Analytics!</h4>
            <p style={{ 
              fontSize: '14px', 
              color: '#6B7280', 
              margin: '0 0 16px',
              lineHeight: '1.5'
            }}>
              I can help you with questions about employees, teams, and performance data.
            </p>
            <div style={{ 
              fontSize: '12px', 
              color: '#9CA3AF', 
              lineHeight: '1.6'
            }}>
              <p style={{ margin: '4px 0' }}>• "How many employees are in OneMind?"</p>
              <p style={{ margin: '4px 0' }}>• "What's the gender ratio in my team?"</p>
              <p style={{ margin: '4px 0' }}>• "How many PhDs do we have?"</p>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}

          {isTyping && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div style={{
        borderTop: '1px solid #E5E7EB',
        padding: '16px',
        backgroundColor: 'white'
      }}>
        <MessageInput 
          onSendMessage={sendMessage} 
          disabled={!isConnected}
          placeholder={isConnected ? "Ask me about HR data..." : "Connecting..."}
        />
      </div>
    </div>
  );
}; 