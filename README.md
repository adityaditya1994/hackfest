# 🏢 HR OneMind Analytics Platform

A comprehensive HR Analytics platform built with React, Node.js, and AI-powered chatbot capabilities. This platform provides real-time insights into employee data, performance metrics, organizational structure, and hiring analytics.

## ✨ Features

### 📊 **Dashboard Analytics**
- Real-time employee metrics and KPIs
- Gender ratio and demographic analytics
- Age distribution and seniority mix visualization
- Performance analytics with interactive charts
- Risk signals and attrition predictions

### 👥 **Team Management**
- Interactive organizational chart with hierarchical tree view
- Employee detail modals with comprehensive data
- Level-based organization structure (L1-L5)
- Manager-employee relationship mapping
- Skills and aspirations tracking

### 🔍 **Hiring & Recruitment**
- Job requisitions and offer management
- Hiring pipeline visualization
- Candidate tracking and status updates

### 📈 **Employee Experience**
- Engagement metrics and satisfaction scores
- NPS tracking and trend analysis
- Employee feedback and sentiment analysis

### 🤖 **AI-Powered Chatbot**
- Natural language queries about HR data
- Real-time data analysis via Ollama + CodeLlama
- Smart SQL generation from natural language
- WebSocket-based real-time communication

## 🛠️ Tech Stack

### **Frontend**
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **React Router** for navigation
- **TanStack React Query** for data fetching
- **Recharts** for data visualization
- **Headless UI** for accessible components

### **Backend**
- **Node.js** with Express and TypeScript
- **SQLite** database for data storage
- **CSV parsing** for data import
- **JWT** authentication
- **CORS** enabled for cross-origin requests

### **AI Chatbot**
- **Ollama** with CodeLlama 7B model
- **WebSocket** for real-time communication
- **Natural Language Processing** for query understanding
- **SQL generation** from natural language

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Ollama** - [Download here](https://ollama.ai/)
- **Git** - [Download here](https://git-scm.com/)

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone <repository-url>
cd hackfest
```

### 2. Install Dependencies
```bash
# Install all dependencies (root, frontend, backend)
npm run install:all
```

### 3. Setup Database
```bash
# Initialize and populate the database with sample HR data
cd backend
npm run setup-db
cd ..
```

### 4. Setup AI Chatbot
```bash
# Install Ollama (if not already installed)
# Visit https://ollama.ai/ and follow installation instructions

# Pull the CodeLlama model
ollama pull codellama:7b

# Install chatbot dependencies
cd chatbot/backend
npm install
cd ../..

# Make scripts executable
chmod +x chatbot/setup.sh chatbot/start.sh
```

### 5. Start the Application
```bash
# Start frontend and backend together
npm start
```

### 6. Start the AI Chatbot (Optional)
```bash
# In a separate terminal
./chatbot/start.sh
```

## 🌐 Application URLs

- **Frontend Dashboard**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **Chatbot API**: http://localhost:5001
- **Chatbot WebSocket**: ws://localhost:5001

## 📁 Project Structure

```
hackfest/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   ├── contexts/       # React contexts
│   │   └── utils/          # Utility functions
│   ├── public/             # Static assets
│   └── package.json
├── backend/                 # Node.js backend API
│   ├── src/
│   │   ├── controllers/    # Route controllers
│   │   ├── routes/         # API routes
│   │   ├── database/       # Database setup and queries
│   │   ├── services/       # Business logic
│   │   └── middleware/     # Express middleware
│   └── package.json
├── chatbot/                 # AI chatbot system
│   ├── backend/            # Chatbot backend
│   ├── frontend/           # Chatbot UI components
│   └── integration/        # Integration examples
├── data/                    # Sample HR data (CSV files)
└── package.json            # Root package configuration
```

## 🎯 Usage Guide

### **Dashboard Navigation**
1. **Dashboard**: Overview of all HR metrics and KPIs
2. **Team**: Organizational chart and employee management
3. **Hiring**: Recruitment pipeline and job requisitions
4. **Experience**: Employee engagement and satisfaction metrics
5. **Help**: FAQ and support documentation
6. **Settings**: User preferences and configuration

### **Role-Based Views**
The platform supports different views based on user roles:
- **HR View**: Company-wide data and metrics
- **Leader View**: Department/team-level insights
- **Manager View**: Direct reports and team metrics

### **AI Chatbot Usage**
Click the chatbot icon (💬) in the bottom-right corner and ask questions like:
- "How many employees are in the OneMind team?"
- "What's the gender ratio in our company?"
- "How many L4 level employees do we have?"
- "Show me employees with high engagement scores"

## 🛠️ Development

### **Running in Development Mode**
```bash
# Start frontend only
npm run start:frontend

# Start backend only  
npm run start:backend

# Start both together
npm start
```

### **Building for Production**
```bash
# Build both frontend and backend
npm run build
```

### **Database Management**
```bash
# Reinitialize database
cd backend
npm run init-db

# Reload sample data
npm run load-data

# Full database setup
npm run setup-db
```

## 📊 Sample Data

The platform comes with comprehensive sample HR data including:
- **474 employees** across different departments and levels
- **Performance and OKR data** for goal tracking
- **Engagement survey results** for satisfaction metrics
- **Hiring requisitions and offers** for recruitment analytics
- **Leave records** for attendance tracking

## 🐛 Troubleshooting

### **Common Issues**

1. **Port Already in Use**
   - Frontend (5173): Change port in `frontend/vite.config.ts`
   - Backend (5000): Change port in `backend/src/server.ts`
   - Chatbot (5001): Change port in `chatbot/backend/src/server.ts`

2. **Database Issues**
   ```bash
   cd backend
   rm hr_onemind.db
   npm run setup-db
   ```

3. **Ollama/Chatbot Issues**
   - Ensure Ollama is running: `ollama list`
   - Pull model again: `ollama pull codellama:7b`
   - Check logs in chatbot terminal

4. **Dependencies Issues**
   ```bash
   # Clean install
   rm -rf node_modules
   rm package-lock.json
   npm run install:all
   ```

### **Environment Variables**
Create `.env` files if needed:

**Backend (.env)**
```env
PORT=5000
NODE_ENV=development
DB_PATH=./hr_onemind.db
```

**Chatbot Backend (.env)**
```env
PORT=5001
OLLAMA_BASE_URL=http://localhost:11434
MODEL_NAME=codellama:7b
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 API Documentation

### **Backend API Endpoints**

#### Dashboard
- `GET /api/dashboard/metrics` - Get dashboard metrics
- `GET /api/dashboard/age-mix` - Get age distribution data
- `GET /api/dashboard/seniority-mix` - Get seniority distribution data

#### Employees
- `GET /api/employees` - Get all employees
- `GET /api/employees/orgchart` - Get organizational chart data
- `GET /api/employees/:empId/personal` - Get employee personal data

#### Hiring
- `GET /api/hiring/stats` - Get hiring statistics
- `GET /api/hiring/requisitions` - Get job requisitions
- `GET /api/hiring/offers` - Get job offers

#### Chatbot
- `POST /api/chat` - Send message to chatbot
- `WebSocket ws://localhost:5001` - Real-time chat communication

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Ollama** for providing the AI infrastructure
- **CodeLlama** for the language model
- **React** and **Node.js** communities for the excellent frameworks
- **Tailwind CSS** for the utility-first CSS framework

---

For more detailed information or support, please refer to the [Help](http://localhost:5173/help) page or contact the development team. 