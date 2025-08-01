# Quick Start Guide - HR Analytics Chatbot

## 🚀 Get Started in 5 Minutes

### 1. Prerequisites Check
- ✅ Ollama installed and running (`ollama serve`)
- ✅ CodeLlama 7B model downloaded (`ollama pull codellama:7b`)
- ✅ Backend dependencies installed (automated in setup)

### 2. Start the Chatbot
```bash
# Option 1: Use the start script (recommended)
./chatbot/start.sh

# Option 2: Manual start
cd chatbot/backend
npm run dev
```

### 3. Test the Backend
Open another terminal and test:
```bash
# Health check
curl http://localhost:5001/health

# Test chat API
curl -X POST http://localhost:5001/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "How many employees do we have?"}'
```

### 4. Integration (Optional)
Add to your React app:
```typescript
import { ChatbotWidget } from './chatbot/frontend';

function App() {
  return (
    <div>
      {/* Your app components */}
      <ChatbotWidget position="bottom-right" />
    </div>
  );
}
```

## 🧪 Example Queries

Try these questions once the chatbot is running:

### Employee Counts
- "How many employees are in OneMind?"
- "How many active employees do we have?"
- "Show me the headcount by team"

### Demographics
- "What's the gender ratio?"
- "Show me age distribution"
- "How many employees are in Gurgaon?"

### Qualifications
- "How many PhDs do we have?"
- "Show me employees with Masters degrees"
- "What are the common qualifications?"

### Performance
- "How many employees exceed expectations?"
- "What's the average engagement score?"
- "Show me performance by level"

## 🔧 Troubleshooting

### Chatbot Not Responding
1. Check if Ollama is running: `ollama list`
2. Check if backend is running: `curl http://localhost:5001/health`
3. Check backend logs for errors

### SQL Generation Issues
- Ensure CodeLlama model is properly loaded
- Try simpler queries first
- Check database connection in logs

### Frontend Integration Issues
- Ensure backend is running on port 5001
- Check browser console for WebSocket errors
- Verify component imports are correct

## 📊 Architecture Quick View

```
Frontend (React) ←→ Backend (Node.js) ←→ Ollama (CodeLlama) ←→ Database (SQLite)
     ↓                    ↓                      ↓                    ↓
WebSocket/REST         SQL Generation      Natural Language      HR Data
  Connection           & Response          Processing           (employees,
                                                               performance,
                                                               engagement)
```

## 🎯 Success Indicators

✅ Backend starts on port 5001  
✅ Health check returns `{"status":"ok"}`  
✅ WebSocket connects successfully  
✅ Test queries return meaningful responses  
✅ SQL queries are generated correctly  

---

**Need Help?** Check the full README.md for detailed configuration options and troubleshooting. 