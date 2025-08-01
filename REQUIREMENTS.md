# 📋 System Requirements & Dependencies

This document outlines all system requirements, dependencies, and version specifications needed to run the HR OneMind Analytics Platform.

## 🖥️ System Requirements

### **Operating System**
- **Windows**: Windows 10 or later
- **macOS**: macOS 10.15 (Catalina) or later
- **Linux**: Ubuntu 18.04+, CentOS 7+, or equivalent

### **Hardware Requirements**
- **RAM**: Minimum 8GB, Recommended 16GB
- **Storage**: Minimum 5GB free space
- **CPU**: Multi-core processor (Intel i5/AMD Ryzen 5 or better)
- **Network**: Internet connection for downloading dependencies

## 🛠️ Required Software

### **Node.js & npm**
- **Node.js**: Version 18.0.0 or higher
- **npm**: Version 8.0.0 or higher (comes with Node.js)
- **Download**: https://nodejs.org/

### **Ollama (for AI Chatbot)**
- **Version**: Latest stable release
- **Purpose**: Local AI model execution
- **Download**: https://ollama.ai/
- **Supported Models**: CodeLlama 7B (4GB RAM required)

### **Git**
- **Version**: 2.20.0 or higher
- **Purpose**: Version control and repository cloning
- **Download**: https://git-scm.com/

## 📦 Project Dependencies

### **Root Package Dependencies**
```json
{
  "devDependencies": {
    "concurrently": "^8.2.2"
  }
}
```

### **Frontend Dependencies**
```json
{
  "dependencies": {
    "@headlessui/react": "^1.7.18",
    "@heroicons/react": "^2.1.1",
    "@nivo/bar": "^0.84.0",
    "@nivo/core": "^0.84.0",
    "@nivo/line": "^0.84.0",
    "@nivo/pie": "^0.84.0",
    "@tanstack/react-query": "^5.18.1",
    "axios": "^1.6.7",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.22.0",
    "recharts": "^2.12.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.43",
    "@types/react-dom": "^18.2.17",
    "@typescript-eslint/eslint-plugin": "^6.14.0",
    "@typescript-eslint/parser": "^6.14.0",
    "@vitejs/plugin-react": "^4.2.1",
    "autoprefixer": "^10.4.17",
    "eslint": "^8.55.0",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.5",
    "postcss": "^8.4.33",
    "tailwindcss": "^3.4.1",
    "typescript": "^5.2.2",
    "vite": "^5.0.8"
  }
}
```

### **Backend Dependencies**
```json
{
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "sqlite3": "^5.1.7",
    "csv-parse": "^5.5.3",
    "jsonwebtoken": "^9.0.2",
    "bcryptjs": "^2.4.3",
    "express-validator": "^7.0.1",
    "winston": "^3.11.0"
  },
  "devDependencies": {
    "@types/express": "^4.17.21",
    "@types/cors": "^2.8.17",
    "@types/node": "^20.10.5",
    "@types/jsonwebtoken": "^9.0.5",
    "@types/bcryptjs": "^2.4.6",
    "@types/sqlite3": "^3.1.11",
    "typescript": "^5.3.3",
    "ts-node-dev": "^2.0.0",
    "@typescript-eslint/eslint-plugin": "^6.15.0",
    "@typescript-eslint/parser": "^6.15.0",
    "eslint": "^8.56.0"
  }
}
```

### **Chatbot Backend Dependencies**
```json
{
  "dependencies": {
    "express": "^4.19.2",
    "cors": "^2.8.5",
    "dotenv": "^16.4.5",
    "axios": "^1.7.7",
    "sqlite3": "^5.1.7",
    "ws": "^8.18.0"
  },
  "devDependencies": {
    "@types/express": "^4.17.21",
    "@types/cors": "^2.8.17",
    "@types/node": "^20.14.9",
    "@types/ws": "^8.5.12",
    "ts-node-dev": "^2.0.0",
    "typescript": "^5.5.2"
  }
}
```

## 🔧 Development Tools (Optional but Recommended)

### **Code Editors**
- **VS Code**: With TypeScript, React, and Tailwind CSS extensions
- **WebStorm**: Full IDE support for JavaScript/TypeScript
- **Vim/Neovim**: With appropriate language server plugins

### **Browser Requirements**
- **Chrome**: Version 90+ (Recommended)
- **Firefox**: Version 88+
- **Safari**: Version 14+
- **Edge**: Version 90+

### **Database Tools (Optional)**
- **DB Browser for SQLite**: GUI for SQLite database inspection
- **SQLite CLI**: Command-line interface for database operations

## 🌐 Network Requirements

### **Ports**
The following ports need to be available:
- **5173**: Frontend development server (Vite)
- **5000**: Backend API server
- **5001**: Chatbot backend server
- **11434**: Ollama API server (default)

### **Firewall Configuration**
Ensure these ports are not blocked by your firewall for local development.

### **Internet Connectivity**
Required for:
- Downloading npm packages
- Pulling Ollama models
- Initial setup and updates

## 📊 AI Model Requirements

### **Ollama Models**
- **CodeLlama 7B**: ~4GB disk space, 8GB+ RAM recommended
- **Installation**: `ollama pull codellama:7b`
- **Alternative Models**: CodeLlama 13B (more accurate, requires 16GB+ RAM)

### **GPU Support (Optional)**
- **NVIDIA GPU**: CUDA-compatible for faster AI processing
- **Apple Silicon**: Built-in acceleration on M1/M2 Macs
- **CPU Only**: Will work but slower response times

## 🗃️ Database Requirements

### **SQLite**
- **Version**: 3.31.0 or higher (bundled with sqlite3 npm package)
- **Storage**: ~50MB for sample data
- **Concurrent Users**: Up to 10 (suitable for development/small teams)

### **Sample Data**
- **Employee Records**: 474 sample employees
- **CSV Files**: ~10MB total size
- **Processing Time**: ~30 seconds for initial data load

## 🔒 Security Requirements

### **HTTPS (Production)**
- SSL certificate for production deployment
- Environment variables for sensitive data
- CORS configuration for cross-origin requests

### **Authentication**
- JWT tokens for session management
- bcrypt for password hashing
- Input validation and sanitization

## 📱 Browser Compatibility

### **Supported Features**
- ES2020+ JavaScript features
- CSS Grid and Flexbox
- WebSocket support
- Local Storage API
- Fetch API

### **Polyfills**
Not required for modern browsers, but consider for legacy support:
- Promise polyfill for IE11
- Fetch polyfill for older browsers

## 🚀 Performance Expectations

### **Development Mode**
- **Frontend Build Time**: ~10-30 seconds
- **Backend Startup**: ~5 seconds
- **Database Init**: ~30 seconds (first time)
- **Hot Reload**: ~1-3 seconds

### **Production Mode**
- **Build Time**: ~2-5 minutes
- **Memory Usage**: ~200-500MB per service
- **Response Times**: <100ms for API calls
- **Concurrent Users**: 10-50 users

## 🔧 Optional Enhancements

### **Docker Support**
- Docker Desktop for containerized development
- Docker Compose for multi-service orchestration

### **CI/CD Tools**
- GitHub Actions for automated testing
- Docker for deployment
- PM2 for production process management

### **Monitoring**
- Winston for logging
- Custom metrics for performance monitoring
- Error tracking solutions

## 📋 Verification Checklist

Before starting development, verify:

- [ ] Node.js 18+ installed (`node --version`)
- [ ] npm 8+ installed (`npm --version`)
- [ ] Git installed (`git --version`)
- [ ] Ollama installed (`ollama --version`)
- [ ] CodeLlama model pulled (`ollama list`)
- [ ] Ports 5000, 5001, 5173 available
- [ ] Internet connection active
- [ ] 8GB+ RAM available
- [ ] 5GB+ disk space available

## 🆘 Troubleshooting Common Issues

### **Node.js Version Issues**
```bash
# Check version
node --version

# Update Node.js using nvm (recommended)
nvm install 18
nvm use 18
```

### **Permission Issues (macOS/Linux)**
```bash
# Fix npm permissions
sudo chown -R $(whoami) $(npm config get prefix)/{lib/node_modules,bin,share}
```

### **Port Conflicts**
```bash
# Check what's using a port
lsof -i :5000
netstat -tulpn | grep :5000  # Linux
netstat -an | findstr :5000  # Windows

# Kill process using port
kill -9 <PID>
```

### **Ollama Issues**
```bash
# Check if Ollama is running
ollama list

# Start Ollama service
ollama serve

# Pull model again
ollama pull codellama:7b
```

---

For additional support or questions about requirements, please refer to the main [README.md](README.md) or contact the development team. 