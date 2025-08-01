# HR OneMind - AI-Powered People Analytics Platform

An intelligent interface for HR leaders and managers to view people data, assess team health, and act on recommendations. Built for Deutsche Telekom Digital Labs.

## Features

- **Access Control**: Toggle between Leader and Manager views
- **Smart Dashboard**: Real-time alerts and insights
- **Team Analytics**: Comprehensive team composition and performance metrics
- **Hiring Management**: Track open positions and recruitment pipeline
- **Experience Monitoring**: Team satisfaction and engagement insights
- **AI-Powered Recommendations**: Actionable suggestions for leaders

## Tech Stack

- **Frontend**:
  - React with TypeScript
  - Tailwind CSS for styling
  - Headless UI for accessible components
  - React Query for data fetching
  - Recharts & Nivo for data visualization

- **Backend**:
  - Node.js with Express
  - TypeScript
  - MongoDB for data storage
  - JWT for authentication

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone [repository-url]
   cd hr-onemind
   ```

2. Install dependencies:
   ```bash
   npm install:all
   ```

3. Set up environment variables:
   ```bash
   # Backend (.env)
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/hr-onemind
   JWT_SECRET=your-secret-key
   NODE_ENV=development

   # External API Keys
   DARWINBOX_API_KEY=
   TURBOHIRE_API_KEY=
   AMBER_API_KEY=
   GT_PORTAL_API_KEY=
   ```

4. Start the development servers:
   ```bash
   npm start
   ```

The application will be available at:
- Frontend: http://localhost:5173
- Backend: http://localhost:5000

## Project Structure

```
hr-onemind/
├── frontend/                # React frontend application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── services/      # API services
│   │   └── utils/         # Helper functions
│   └── public/            # Static assets
│
└── backend/               # Node.js backend application
    ├── src/
    │   ├── controllers/   # Request handlers
    │   ├── models/        # Database models
    │   ├── routes/        # API routes
    │   ├── middleware/    # Custom middleware
    │   └── utils/         # Helper functions
    └── tests/            # Backend tests
```

## API Integration

The platform integrates with multiple HR systems:
- Darwinbox
- TurboHire
- Amber
- GT Portal

API documentation and integration details will be provided separately.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is proprietary and confidential. Unauthorized copying or distribution is prohibited. 