# 🏥 Digital Hospital Management System

A comprehensive, enterprise-grade healthcare management platform built with React, TypeScript, and Node.js. This application provides a complete solution for patient management, medical records, appointments, analytics, and communication.

## 🚀 Features

### Core Functionality
- **Patient Management** - Complete patient registration and profile management
- **Medical Records** - Digital health records with comprehensive patient history
- **Appointment Scheduling** - Advanced appointment management system
- **Analytics Dashboard** - Real-time analytics and insights
- **Patient Communication** - Multi-channel messaging system
- **Reports Generation** - Automated reports and data export
- **User Management** - Role-based access control (Admin/Doctor)

### Technical Features
- **TypeScript** - Full type safety and better development experience
- **Professional Error Handling** - Comprehensive error management system
- **API Client** - Robust HTTP client with interceptors and caching
- **Custom Hooks** - Reusable hooks for common operations
- **Responsive Design** - Mobile-first, professional UI/UX
- **Performance Optimized** - Lazy loading, memoization, and caching
- **Security** - JWT authentication and authorization

## 🛠️ Technology Stack

### Frontend
- **React 19** - Latest React with concurrent features
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and development server
- **Redux Toolkit** - State management
- **React Router** - Client-side routing
- **Axios** - HTTP client with interceptors
- **Chart.js** - Data visualization
- **JS-Cookie** - Cookie management

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Multer** - File upload handling
- **PDFKit** - PDF generation

## 📋 Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **MongoDB** (local or cloud instance)

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone <repository-url>
cd digital-hospital-system
```

### 2. Install Dependencies

#### Frontend
```bash
npm install
```

#### Backend
```bash
cd backend
npm install
```

### 3. Environment Setup

#### Frontend Environment
Create `.env` file in the root directory:
```env
VITE_API_BASE_URL=http://localhost:5002/api
VITE_APP_NAME=Digital Hospital
VITE_APP_VERSION=1.0.0
VITE_ENVIRONMENT=development
```

#### Backend Environment
Create `.env` file in the backend directory:
```env
MONGO_URI=mongodb://localhost:27017/digital-hospital
PORT=5002
JWT_SECRET=your-super-secret-jwt-key
NODE_ENV=development
```

### 4. Database Setup
```bash
# Start MongoDB (if using local instance)
mongod

# Seed the database with initial data
cd backend
node seed.js
```

### 5. Start the Application

#### Development Mode
```bash
# Terminal 1 - Start Backend
cd backend
npm run dev

# Terminal 2 - Start Frontend
npm run dev
```

#### Production Mode
```bash
# Build frontend
npm run build

# Start backend
cd backend
npm start
```

### 6. Access the Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5002/api

## 👤 Default Credentials

### Test User
- **Phone**: `9166677753`
- **Password**: `Test@123`
- **Role**: Doctor

## 📁 Project Structure

```
digital-hospital-system/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── AnalyticsCharts.jsx
│   │   ├── DashboardSummary.jsx
│   │   ├── MedicalRecords.jsx
│   │   ├── NewPatientForm.jsx
│   │   ├── PatientCommunication.jsx
│   │   ├── PatientDirectory.jsx
│   │   ├── PatientManagement.jsx
│   │   ├── PatientSearch.jsx
│   │   └── Reports.jsx
│   ├── pages/              # Page components
│   │   ├── Dashboard.jsx
│   │   ├── ForgotPassword.jsx
│   │   ├── Login.jsx
│   │   └── PatientProfile.jsx
│   ├── services/           # API services
│   │   ├── api.js
│   │   ├── apiClient.ts
│   │   └── axiosInstance.js
│   ├── store/              # Redux store
│   │   ├── index.js
│   │   └── slices/
│   │       └── authSlice.js
│   ├── types/              # TypeScript type definitions
│   │   └── index.ts
│   ├── utils/              # Utility functions
│   │   └── errorHandler.ts
│   ├── hooks/              # Custom React hooks
│   │   └── useApi.ts
│   ├── config/             # Configuration files
│   │   └── environment.ts
│   ├── App.css             # Global styles
│   ├── App.jsx             # Main App component
│   ├── main.jsx            # Application entry point
│   └── index.css           # Base styles
├── backend/                # Backend application
│   ├── models/             # Database models
│   ├── routes/             # API routes
│   ├── middleware/         # Express middleware
│   ├── server.js           # Server entry point
│   ├── seed.js             # Database seeding
│   └── package.json
├── public/                 # Static assets
├── package.json            # Frontend dependencies
├── tsconfig.json           # TypeScript configuration
├── vite.config.js          # Vite configuration
└── README.md               # Project documentation
```

## 🔧 Configuration

### Environment Variables

#### Frontend (.env)
| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Backend API URL | `http://localhost:5002/api` |
| `VITE_APP_NAME` | Application name | `Digital Hospital` |
| `VITE_APP_VERSION` | Application version | `1.0.0` |
| `VITE_ENVIRONMENT` | Environment mode | `development` |

#### Backend (.env)
| Variable | Description | Default |
|----------|-------------|---------|
| `MONGO_URI` | MongoDB connection string | `mongodb://localhost:27017/digital-hospital` |
| `PORT` | Server port | `5002` |
| `JWT_SECRET` | JWT secret key | Required |
| `NODE_ENV` | Environment mode | `development` |

### Feature Flags
The application includes feature flags for enabling/disabling features:
```typescript
export const FEATURE_FLAGS = {
  ANALYTICS: true,
  PATIENT_COMMUNICATION: true,
  ADVANCED_REPORTS: true,
  FILE_UPLOAD: true,
  REAL_TIME_NOTIFICATIONS: false,
};
```

## 🧪 Testing

### Running Tests
```bash
# Frontend tests
npm test

# Backend tests
cd backend
npm test
```

### Test Coverage
```bash
npm run test:coverage
```

## 📊 API Documentation

### Authentication Endpoints
- `POST /api/doctors/login` - Doctor login
- `POST /api/doctors/logout` - Doctor logout
- `POST /api/doctors/refresh` - Refresh token

### Patient Endpoints
- `GET /api/patients` - Get all patients
- `POST /api/patients/register` - Register new patient
- `GET /api/patients/:id` - Get patient by ID
- `PATCH /api/patients/:id` - Update patient
- `DELETE /api/patients/:id` - Delete patient
- `POST /api/patients/check` - Check patient existence

### Visit Endpoints
- `GET /api/visits` - Get all visits
- `POST /api/visits` - Create new visit
- `GET /api/visits/:id` - Get visit by ID
- `PATCH /api/visits/:id` - Update visit
- `DELETE /api/visits/:id` - Delete visit
- `GET /api/patients/:id/visits` - Get patient visits

### Analytics Endpoints
- `GET /api/analytics/trends` - Get analytics trends
- `GET /api/dashboard/summary` - Get dashboard summary

## 🔒 Security

### Authentication
- JWT-based authentication
- Token refresh mechanism
- Secure cookie storage
- Role-based access control

### Data Protection
- Password hashing with bcrypt
- Input validation and sanitization
- CORS configuration
- Rate limiting (recommended for production)

### File Upload Security
- File type validation
- File size limits
- Secure file storage
- Virus scanning (recommended for production)

## 🚀 Deployment

### Frontend Deployment
```bash
# Build for production
npm run build

# Deploy to your preferred platform
# - Vercel
# - Netlify
# - AWS S3 + CloudFront
# - Azure Static Web Apps
```

### Backend Deployment
```bash
# Build for production
cd backend
npm run build

# Deploy to your preferred platform
# - Heroku
# - AWS EC2
# - Google Cloud Run
# - Azure App Service
```

### Environment Setup for Production
1. Set `NODE_ENV=production`
2. Configure production MongoDB connection
3. Set strong JWT secret
4. Enable HTTPS
5. Configure CORS for production domain
6. Set up monitoring and logging

## 📈 Performance Optimization

### Frontend Optimizations
- Code splitting and lazy loading
- Memoization with React.memo and useMemo
- Image optimization
- Bundle size optimization
- Service worker for caching

### Backend Optimizations
- Database indexing
- Query optimization
- Caching with Redis (recommended)
- Compression middleware
- Rate limiting

## 🐛 Troubleshooting

### Common Issues

#### Frontend Issues
1. **Port already in use**: Change port in `vite.config.js`
2. **API connection failed**: Check backend URL in environment variables
3. **Build errors**: Clear node_modules and reinstall dependencies

#### Backend Issues
1. **MongoDB connection failed**: Check MONGO_URI and MongoDB status
2. **Port already in use**: Change PORT in environment variables
3. **JWT errors**: Verify JWT_SECRET is set

### Debug Mode
Enable debug logging by setting:
```env
DEBUG=app:*
```

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Update documentation
6. Submit a pull request

### Code Standards
- Follow TypeScript best practices
- Use ESLint and Prettier
- Write meaningful commit messages
- Add JSDoc comments for functions
- Follow React best practices

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## 🔄 Changelog

### Version 1.0.0
- Initial release
- Complete patient management system
- Professional UI/UX design
- TypeScript implementation
- Comprehensive error handling
- API client with interceptors
- Custom hooks for common operations

## 🙏 Acknowledgments

- React team for the amazing framework
- Vite team for the fast build tool
- MongoDB team for the database
- All contributors and maintainers

---

**Built with ❤️ for better healthcare management**
