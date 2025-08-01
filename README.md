# HR OneMind - AI-Powered People Analytics Platform

A comprehensive AI-powered people analytics web application built for Deutsche Telekom Digital Labs, providing managers and HR leaders with intelligent insights into team health, employee engagement, and actionable recommendations.

## 🚀 Features

### 📊 Dashboard Analytics
- **Real-time Metrics**: Team composition, engagement scores, performance data
- **Interactive Charts**: Age distribution and seniority mix pie charts using real data
- **Role-based Views**: Different dashboards for HR, Leaders, and Managers
- **HRBP Feedback Integration**: Visual indicators and recommendations from Amber data

### 👥 Employee Management
- **Team Hierarchy**: Interactive organizational chart with drill-down capabilities
- **Employee Profiles**: Comprehensive details including basic info, career history, performance, skills, and risk assessment
- **Search & Filters**: Advanced filtering by level, HRBP status, and team
- **HRBP Feedback**: Color-coded status indicators (Green/Amber/Red) with actionable insights

### 💼 Hiring Management
- **Requisition Tracking**: Complete hiring pipeline management
- **Statistics Dashboard**: Real-time hiring metrics and KPIs
- **Offer Management**: Track offers made, accepted, and pending
- **Advanced Filtering**: Filter by department, status, level, and time range

### 🎯 Key Capabilities
- **Role-Based Access Control**: HR, Leader, and Manager specific views
- **Department Switching**: Leaders can toggle between OneAI, Commerce, and OneMind teams
- **Real Data Integration**: Uses actual CSV data loaded into SQLite database
- **Responsive Design**: Modern UI built with Tailwind CSS
- **Interactive Visualizations**: Charts and graphs using Recharts library

## 🛠 Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **Headless UI** for accessible components
- **React Query** for data fetching and caching
- **React Router** for navigation
- **Recharts** for data visualization

### Backend
- **Node.js** with Express
- **TypeScript** for type safety
- **SQLite** database with CSV data loading
- **csv-parse** for data processing
- **CORS** enabled for frontend integration

### Database
- **SQLite** with structured schema
- **CSV data loading** from actual HR datasets
- **Foreign key relationships** for data integrity
- **Metadata documentation** with table descriptions

## 📁 Project Structure

```
HR_OneMind/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/          # Application pages
│   │   ├── contexts/       # React contexts (Auth)
│   │   ├── services/       # API services
│   │   └── assets/         # Static assets
│   ├── package.json
│   └── tailwind.config.js
├── backend/                  # Node.js backend API
│   ├── src/
│   │   ├── controllers/    # Route controllers
│   │   ├── routes/         # API routes
│   │   ├── database/       # Database setup and migration
│   │   ├── middleware/     # Express middleware
│   │   └── services/       # Business logic
│   ├── package.json
│   └── tsconfig.json
├── data/                    # CSV data files and metadata
│   ├── Master Data UPDATED.csv
│   ├── Amber data.csv
│   ├── Performance & OKR UPDATED.csv
│   └── TABLE_METADATA.md
├── package.json            # Root package.json with workspaces
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/adityaditya1994/hackfest.git
   cd hackfest
   ```

2. **Install dependencies**
   ```bash
   npm run install:all
   ```

3. **Setup database**
   ```bash
   cd backend
   npm run setup-db
   ```

4. **Start the application**
   ```bash
   cd ..
   npm start
   ```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

### Development Commands

```bash
# Install all dependencies
npm run install:all

# Start both frontend and backend
npm start

# Start frontend only
npm run start:frontend

# Start backend only
npm run start:backend

# Build both applications
npm run build

# Setup database (backend)
cd backend && npm run setup-db
```

## 📊 Data Sources

The application uses real CSV data from multiple HR systems:

- **Master Data**: Employee information, demographics, roles
- **Amber Data**: Engagement scores and HRBP feedback
- **Performance Data**: Performance ratings and OKRs
- **Hiring Data**: Job requisitions and offers

All data is loaded into a structured SQLite database with proper relationships and metadata documentation.

## 🔐 User Roles

### HR View
- Company-wide analytics (474 employees)
- All departments and teams visible
- Full hiring and performance data access

### Leader View
- Department-level data (OneAI: 165, Commerce: 160, OneMind: 149)
- Team composition and engagement metrics
- Department-specific hiring pipeline

### Manager View
- Team-specific data for direct and indirect reports
- Individual employee performance tracking
- Team health and risk indicators

## 📈 Key Metrics

### Team Composition
- Total employees by role/department
- Gender distribution
- Average experience and tenure
- Age and seniority mix with interactive charts

### Performance & Engagement
- HRBP feedback status (Green/Amber/Red)
- Engagement scores from Amber data
- Performance ratings and OKR tracking
- Risk assessment and recommendations

### Hiring Pipeline
- Open requisitions and pipeline status
- Offer statistics and acceptance rates
- Time-to-hire metrics
- Department-wise hiring trends

## 🔧 API Endpoints

### Dashboard
- `GET /api/dashboard/metrics` - Main dashboard metrics
- `GET /api/dashboard/age-mix` - Age distribution data
- `GET /api/dashboard/seniority-mix` - Seniority distribution data

### Employees
- `GET /api/employees` - All employees list
- `GET /api/employees/:id` - Employee details
- `GET /api/employees/level/:level` - Employees by level
- `GET /api/employees/:id/hierarchy` - Team hierarchy

### Hiring
- `GET /api/hiring/stats` - Hiring statistics
- `GET /api/hiring/requisitions` - Job requisitions
- `GET /api/hiring/offers` - Offer management

## 🎨 UI Components

### Charts & Visualizations
- **Pie Charts**: Age and seniority distribution with Recharts
- **Metric Cards**: Key performance indicators
- **Status Badges**: Color-coded HRBP feedback
- **Progress Indicators**: Hiring pipeline status

### Interactive Elements
- **Employee Cards**: Clickable with detailed modals
- **Filters**: Advanced search and filtering options
- **Role Switcher**: Dynamic view changes
- **Department Selector**: Team-specific data views

## 🔄 Data Flow

1. **CSV Data Loading**: Automated import from data folder
2. **Database Normalization**: Structured SQLite schema
3. **API Layer**: Express routes with TypeScript
4. **Frontend Caching**: React Query for performance
5. **Real-time Updates**: Dynamic filtering and role-based views

## 🚦 Getting Started Guide

### For HR Users
1. Login with HR role
2. View company-wide dashboard
3. Access all employee data and hiring metrics
4. Switch between different team views

### For Leaders
1. Select Leader role from profile menu
2. Choose department (OneAI/Commerce/OneMind)
3. View department-specific analytics
4. Review team composition and performance

### For Managers
1. Use Manager role for team-specific data
2. Access direct reports and hierarchy
3. Review individual employee profiles
4. Monitor team health indicators

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Deutsche Telekom Digital Labs for the project requirements
- React and Node.js communities for excellent tooling
- Recharts for beautiful data visualizations
- Tailwind CSS for rapid UI development

---

**Built with ❤️ for Deutsche Telekom Digital Labs** 