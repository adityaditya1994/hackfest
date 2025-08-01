# HR Analytics Chatbot

An AI-powered chatbot system that provides natural language access to HR analytics data. Built with Ollama, CodeLlama, and React.

## Features

- 🤖 **Natural Language Processing**: Ask questions in plain English
- 📊 **SQL Generation**: Automatically converts queries to SQL
- 💬 **Real-time Chat**: WebSocket-based communication
- 🎨 **Modern UI**: Clean, minimal interface with magenta theme
- 📱 **Responsive Design**: Works on desktop and mobile
- 🔄 **Auto-reconnection**: Handles connection issues gracefully

## Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Ollama        │
│   (React)       │◄──►│   (Node.js)     │◄──►│   (CodeLlama)   │
│                 │    │                 │    │                 │
│ - ChatbotWidget │    │ - ChatbotService│    │ - SQL Generation│
│ - WebSocket     │    │ - DatabaseService│    │ - NL Response   │
│ - UI Components │    │ - WebSocket     │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                              ▼
                       ┌─────────────────┐
                       │   HR Database   │
                       │   (SQLite)      │
                       │                 │
                       │ - employees     │
                       │ - engagement    │
                       │ - performance   │
                       └─────────────────┘
```

## Setup Instructions

### 1. Install Dependencies

```bash
# Backend dependencies
cd chatbot/backend
npm install

# Frontend is integrated with main app
```

### 2. Ensure Ollama is Running

```bash
# Check if Ollama is running
ollama list

# If CodeLlama is not installed
ollama pull codellama:7b

# Start Ollama if not running
ollama serve
```

### 3. Start the Chatbot Backend

```bash
cd chatbot/backend
npm run dev
```

The backend will start on port 5001.

### 4. Integration with Main App

Add the chatbot widget to your main application:

```typescript
import React from 'react';
import { ChatbotWidget } from '../chatbot/frontend';

function App() {
  return (
    <div>
      {/* Your existing app components */}
      
      {/* Add chatbot widget */}
      <ChatbotWidget position="bottom-right" />
    </div>
  );
}
```

## Example Queries

The chatbot can handle various HR-related questions:

### Employee Information
- "How many employees are in OneMind value stream?"
- "What is the gender ratio in my team?"
- "Show me employees by location"
- "How many active employees do we have?"

### Qualifications & Skills
- "How many PhDs work in OneMind?"
- "What are the common qualifications?"
- "Show me employees with Masters degrees"

### Performance & Engagement
- "What is the average engagement score?"
- "How many employees exceed expectations?"
- "Show me performance ratings by level"
- "What are the common career aspirations?"

### Demographics
- "What is the age distribution of our team?"
- "Show me employees by marital status"
- "What is the average experience level?"

## Database Schema

The chatbot has access to the following tables:

### employees
- emp_id, name, gender, level, designation
- department, team, location, manager_name
- highest_qualification, age, total_experience
- tenure, status, doj, marital_status

### engagement  
- name, engagement_score, hrbp_tagging

### performance
- emp_id, performance_rating, potential_rating
- short_term_aspiration, long_term_aspiration

## Configuration

### Environment Variables

Create a `.env` file in `chatbot/backend/`:

```env
CHATBOT_PORT=5001
OLLAMA_URL=http://localhost:11434
MODEL_NAME=codellama:7b
```

### Customization

#### Change AI Model
Update the model in `ChatbotService.ts`:

```typescript
private model = 'codellama:13b'; // or any other model
```

#### Modify Database Connection
Update the database path in `DatabaseService.ts`:

```typescript
const dbPath = path.join(__dirname, '../../../../your-db-path');
```

## API Endpoints

### REST API
- `GET /health` - Health check
- `POST /api/chat` - Send message (alternative to WebSocket)

### WebSocket
- `ws://localhost:5001` - Real-time chat communication

## Troubleshooting

### Common Issues

1. **Ollama not responding**
   ```bash
   ollama serve
   ollama pull codellama:7b
   ```

2. **Database connection error**
   - Check if the HR database file exists
   - Verify the path in DatabaseService.ts

3. **WebSocket connection failed**
   - Ensure backend is running on port 5001
   - Check firewall settings

4. **No SQL generated**
   - Verify Ollama is running
   - Check if CodeLlama model is downloaded
   - Review query complexity

### Debugging

Enable debug logging:

```bash
DEBUG=chatbot* npm run dev
```

## Deployment

### Production Build

```bash
# Build backend
cd chatbot/backend
npm run build
npm start

# Frontend is built with main app
```

### Docker Deployment

```dockerfile
# Dockerfile example
FROM node:18-alpine

# Install Ollama
RUN curl -fsSL https://ollama.ai/install.sh | sh

# Copy and build backend
WORKDIR /app/chatbot/backend
COPY chatbot/backend/package*.json ./
RUN npm ci --only=production

COPY chatbot/backend ./
RUN npm run build

# Start services
CMD ["sh", "-c", "ollama serve & npm start"]
```

## Contributing

1. Follow the existing code structure
2. Add proper TypeScript types
3. Include error handling
4. Test with various query types
5. Update documentation

## License

Part of the HR Analytics project. 