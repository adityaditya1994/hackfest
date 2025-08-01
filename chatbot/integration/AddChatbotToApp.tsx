import React from 'react';
import { ChatbotWidget } from '../frontend';

/**
 * Integration example for adding the chatbot to your main application
 * 
 * Usage:
 * 1. Import this component in your main App.tsx or Layout.tsx
 * 2. Add <ChatbotIntegration /> to your JSX
 * 3. The chatbot will appear as a floating widget in bottom-right
 */

export const ChatbotIntegration: React.FC = () => {
  return (
    <ChatbotWidget 
      position="bottom-right"
      theme="light"
    />
  );
};

/*
 * Alternative integration: Add directly to your existing layout
 * 
 * In your Layout.tsx or App.tsx:
 * 
 * import { ChatbotWidget } from './chatbot/frontend';
 * 
 * function Layout() {
 *   return (
 *     <div>
 *       {// Your existing layout components}
 *       <Sidebar />
 *       <MainContent />
 *       
 *       {// Add chatbot widget}
 *       <ChatbotWidget position="bottom-right" />
 *     </div>
 *   );
 * }
 */

export default ChatbotIntegration; 