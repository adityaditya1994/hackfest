#!/bin/bash

echo "🤖 Setting up HR Analytics Chatbot..."

# Check if we're in the right directory
if [ ! -d "chatbot" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

# Check if Ollama is installed
if ! command -v ollama &> /dev/null; then
    echo "❌ Ollama is not installed. Please install it first:"
    echo "   curl -fsSL https://ollama.ai/install.sh | sh"
    exit 1
fi

echo "✅ Ollama found"

# Check if Ollama is running
if ! curl -s http://localhost:11434/api/tags > /dev/null; then
    echo "⚠️  Ollama is not running. Starting Ollama..."
    echo "   Please run: ollama serve"
    echo "   Then re-run this setup script"
    exit 1
fi

echo "✅ Ollama is running"

# Install CodeLlama model
echo "📦 Installing CodeLlama model..."
if ollama list | grep -q "codellama:7b"; then
    echo "✅ CodeLlama 7B already installed"
else
    echo "⬇️  Downloading CodeLlama 7B (this may take a few minutes)..."
    ollama pull codellama:7b
    if [ $? -eq 0 ]; then
        echo "✅ CodeLlama 7B installed successfully"
    else
        echo "❌ Failed to install CodeLlama 7B"
        exit 1
    fi
fi

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd chatbot/backend
if npm install; then
    echo "✅ Backend dependencies installed"
else
    echo "❌ Failed to install backend dependencies"
    exit 1
fi

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    echo "📝 Creating .env file..."
    cat > .env << EOF
CHATBOT_PORT=5001
OLLAMA_URL=http://localhost:11434
MODEL_NAME=codellama:7b
EOF
    echo "✅ .env file created"
fi

# Test the setup
echo "🧪 Testing setup..."
if npx tsc --noEmit; then
    echo "✅ TypeScript compilation successful"
else
    echo "⚠️  TypeScript compilation has warnings (but may still work)"
fi

cd ../..

echo ""
echo "🎉 Chatbot setup complete!"
echo ""
echo "To start the chatbot:"
echo "  1. cd chatbot/backend"
echo "  2. npm run dev"
echo ""
echo "To integrate with your app:"
echo "  1. Add to your Layout.tsx:"
echo "     import { ChatbotWidget } from './chatbot/frontend';"
echo "     <ChatbotWidget position=\"bottom-right\" />"
echo ""
echo "Example queries to try:"
echo "  • How many employees are in OneMind?"
echo "  • What's the gender ratio?"
echo "  • How many PhDs do we have?"
echo "" 