import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { WebSocketServer } from 'ws';
import http from 'http';
import { ChatbotService } from './services/ChatbotService';
import { DatabaseService } from './services/DatabaseService';

dotenv.config();

const app = express();
const PORT = process.env.CHATBOT_PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize services
const databaseService = new DatabaseService();
const chatbotService = new ChatbotService(databaseService);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'chatbot-backend' });
});

// Chat endpoint for REST API
app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const response = await chatbotService.processQuery(message);
    res.json({ response });
  } catch (error) {
    console.error('Chat API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create HTTP server
const server = http.createServer(app);

// Setup WebSocket server
const wss = new WebSocketServer({ server });

wss.on('connection', (ws) => {
  console.log('New WebSocket connection');

  ws.on('message', async (data) => {
    try {
      const message = JSON.parse(data.toString());
      
      if (message.type === 'chat') {
        // Send typing indicator
        ws.send(JSON.stringify({ type: 'typing', isTyping: true }));
        
        const response = await chatbotService.processQuery(message.content);
        
        // Send response
        ws.send(JSON.stringify({ 
          type: 'response', 
          content: response,
          timestamp: new Date().toISOString()
        }));
        
        // Stop typing indicator
        ws.send(JSON.stringify({ type: 'typing', isTyping: false }));
      }
    } catch (error) {
      console.error('WebSocket message error:', error);
      ws.send(JSON.stringify({ 
        type: 'error', 
        content: 'Sorry, I encountered an error processing your request.' 
      }));
    }
  });

  ws.on('close', () => {
    console.log('WebSocket connection closed');
  });

  // Send welcome message
  ws.send(JSON.stringify({
    type: 'response',
    content: 'Hi! I\'m your HR Analytics assistant. I can help you with questions about employees, teams, gender ratios, qualifications, and more. What would you like to know?',
    timestamp: new Date().toISOString()
  }));
});

// Start server
server.listen(PORT, () => {
  console.log(`Chatbot backend server running on port ${PORT}`);
  console.log(`WebSocket server available at ws://localhost:${PORT}`);
}); 