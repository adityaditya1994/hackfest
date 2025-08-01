#!/bin/bash

# 🏢 HR OneMind Analytics Platform - Setup Script
# This script automates the initial setup process

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# Emojis for better UX
ROCKET="🚀"
CHECK="✅"
CROSS="❌"
INFO="ℹ️"
WARNING="⚠️"

# Function to print colored output
print_status() {
    echo -e "${GREEN}${CHECK} $1${NC}"
}

print_error() {
    echo -e "${RED}${CROSS} $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}${WARNING} $1${NC}"
}

print_info() {
    echo -e "${BLUE}${INFO} $1${NC}"
}

print_header() {
    echo -e "${PURPLE}${ROCKET} $1${NC}"
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check Node.js version
check_node_version() {
    if command_exists node; then
        NODE_VERSION=$(node -v | cut -d'v' -f2)
        REQUIRED_VERSION="18.0.0"
        
        if [ "$(printf '%s\n' "$REQUIRED_VERSION" "$NODE_VERSION" | sort -V | head -n1)" = "$REQUIRED_VERSION" ]; then
            return 0
        else
            return 1
        fi
    else
        return 1
    fi
}

# Function to check available ports
check_port() {
    local port=$1
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
        return 1  # Port is in use
    else
        return 0  # Port is free
    fi
}

echo "════════════════════════════════════════════════════════════════"
echo "🏢 HR OneMind Analytics Platform - Automated Setup"
echo "════════════════════════════════════════════════════════════════"

# Step 1: Check Prerequisites
print_header "Checking Prerequisites..."

# Check Node.js
if check_node_version; then
    NODE_VERSION=$(node -v)
    print_status "Node.js is installed (${NODE_VERSION})"
else
    print_error "Node.js 18+ is required but not found"
    print_info "Please install Node.js from https://nodejs.org/"
    exit 1
fi

# Check npm
if command_exists npm; then
    NPM_VERSION=$(npm -v)
    print_status "npm is installed (v${NPM_VERSION})"  
else
    print_error "npm is required but not found"
    exit 1
fi

# Check Git
if command_exists git; then
    GIT_VERSION=$(git --version | cut -d' ' -f3)
    print_status "Git is installed (${GIT_VERSION})"
else
    print_error "Git is required but not found"
    print_info "Please install Git from https://git-scm.com/"
    exit 1
fi

# Check Ollama (optional)
if command_exists ollama; then
    print_status "Ollama is installed"
    OLLAMA_AVAILABLE=true
else
    print_warning "Ollama not found - AI chatbot will not work"
    print_info "Install Ollama from https://ollama.ai/ for chatbot functionality"
    OLLAMA_AVAILABLE=false
fi

# Check available ports
print_info "Checking port availability..."
if check_port 5173; then
    print_status "Port 5173 (Frontend) is available"
else
    print_warning "Port 5173 is in use - frontend may fail to start"
fi

if check_port 5000; then
    print_status "Port 5000 (Backend) is available"
else
    print_warning "Port 5000 is in use - backend may fail to start"
fi

if check_port 5001; then
    print_status "Port 5001 (Chatbot) is available"
else
    print_warning "Port 5001 is in use - chatbot may fail to start"
fi

# Step 2: Install Dependencies
print_header "Installing Dependencies..."

print_info "Installing root dependencies..."
if npm install; then
    print_status "Root dependencies installed"
else
    print_error "Failed to install root dependencies"
    exit 1
fi

print_info "Installing all workspace dependencies..."
if npm run install:all; then
    print_status "All dependencies installed successfully"
else
    print_error "Failed to install workspace dependencies"
    exit 1
fi

# Step 3: Setup Database
print_header "Setting up Database..."

print_info "Initializing database and loading sample data..."
cd backend

if npm run setup-db; then
    print_status "Database setup completed"
else
    print_error "Database setup failed"
    cd ..
    exit 1
fi

cd ..

# Step 4: Setup Chatbot (if Ollama is available)
if [ "$OLLAMA_AVAILABLE" = true ]; then
    print_header "Setting up AI Chatbot..."
    
    print_info "Checking if CodeLlama model is available..."
    if ollama list | grep -q codellama:7b; then
        print_status "CodeLlama 7B model is already installed"
    else
        print_info "Pulling CodeLlama 7B model (this may take several minutes)..."
        if ollama pull codellama:7b; then
            print_status "CodeLlama 7B model installed successfully"
        else
            print_warning "Failed to pull CodeLlama model - chatbot may not work"
        fi
    fi
    
    print_info "Installing chatbot dependencies..."
    cd chatbot/backend
    if npm install; then
        print_status "Chatbot dependencies installed"
    else
        print_warning "Failed to install chatbot dependencies"
    fi
    cd ../..
    
    # Make scripts executable
    print_info "Making chatbot scripts executable..."
    chmod +x chatbot/setup.sh chatbot/start.sh
    print_status "Chatbot scripts are now executable"
else
    print_info "Skipping chatbot setup (Ollama not available)"
fi

# Step 5: Final Verification
print_header "Final Verification..."

# Check if database was created
if [ -f "backend/hr_onemind.db" ]; then
    print_status "Database file created successfully"
else
    print_error "Database file not found"
fi

# Check if essential files exist
ESSENTIAL_FILES=(
    "package.json"
    "frontend/package.json"
    "backend/package.json"
    "frontend/src/App.tsx"
    "backend/src/server.ts"
)

for file in "${ESSENTIAL_FILES[@]}"; do
    if [ -f "$file" ]; then
        print_status "Found $file"
    else
        print_error "Missing essential file: $file"
    fi
done

# Step 6: Setup Complete
echo ""
echo "════════════════════════════════════════════════════════════════"
print_header "Setup Complete!"
echo "════════════════════════════════════════════════════════════════"

print_status "HR OneMind Analytics Platform is ready to use!"

echo ""
print_info "To start the application:"
echo "  npm start                    # Start frontend + backend"
echo "  npm run start:frontend      # Start frontend only"
echo "  npm run start:backend       # Start backend only"

if [ "$OLLAMA_AVAILABLE" = true ]; then
    echo ""
    print_info "To start the AI chatbot:"
    echo "  ./chatbot/start.sh           # Start chatbot backend"
fi

echo ""
print_info "Application URLs:"
echo "  Frontend: http://localhost:5173"
echo "  Backend:  http://localhost:5000"
if [ "$OLLAMA_AVAILABLE" = true ]; then
    echo "  Chatbot:  http://localhost:5001"
fi

echo ""
print_info "For more information, see:"
echo "  README.md         # Complete documentation"
echo "  REQUIREMENTS.md   # System requirements"

echo ""
print_header "Happy coding! 🎉"

# Optional: Ask if user wants to start the application
echo ""
read -p "Would you like to start the application now? (y/N): " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    print_info "Starting the application..."
    npm start
fi 