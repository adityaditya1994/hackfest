#!/bin/bash

echo "🚀 Starting HR Analytics Chatbot..."

# Function to check if a port is in use
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null; then
        return 0
    else
        return 1
    fi
}

# Check if Ollama is running
echo "🔍 Checking Ollama..."
if ! curl -s http://localhost:11434/api/tags > /dev/null; then
    echo "❌ Ollama is not running. Please start it first:"
    echo "   ollama serve"
    exit 1
fi
echo "✅ Ollama is running"

# Check if CodeLlama is available
if ! ollama list | grep -q "codellama:7b"; then
    echo "❌ CodeLlama 7B not found. Please install it:"
    echo "   ollama pull codellama:7b"
    exit 1
fi
echo "✅ CodeLlama 7B is available"

# Check if port 5001 is available
if check_port 5001; then
    echo "⚠️  Port 5001 is already in use. Stopping existing service..."
    # Kill existing service on port 5001
    lsof -ti:5001 | xargs kill -9 2>/dev/null || true
    sleep 2
fi

# Start the chatbot backend
echo "🚀 Starting chatbot backend on port 5001..."
cd chatbot/backend

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Start the server
echo "✅ Starting server..."
echo "🌐 Chatbot backend will be available at http://localhost:5001"
echo "🔌 WebSocket server will be available at ws://localhost:5001"
echo ""
echo "Press Ctrl+C to stop the server"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

npm run dev 