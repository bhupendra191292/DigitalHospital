const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { 
  apiLimiter, 
  loginLimiter, 
  securityHeaders, 
  demoWarning, 
  disableTenantRegistration 
} = require('./middlewares/securityMiddleware');
require('dotenv').config();

const app = express();

// Security middleware
app.use(securityHeaders);
app.use(demoWarning);

// CORS configuration for production
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-frontend-domain.vercel.app', 'https://digital-hospital.vercel.app']
    : ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));

// Rate limiting
app.use('/api/', apiLimiter);
app.use('/api/doctors/login', loginLimiter);

// Disable tenant registration in production
app.use(disableTenantRegistration);

// Health check endpoint for Railway
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'Digital Hospital API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    demo: process.env.NODE_ENV === 'production' ? 'This is a demo system with sample data only' : null
  });
});

// Routes
app.use('/api/doctors', require('./routes/doctorRoutes'));
app.use('/api/patients', require('./routes/patientRoutes'));
app.use('/api/appointments', require('./routes/appointmentRoutes'));
app.use('/api/visits', require('./routes/visitRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));
app.use('/api/analytics', require('./routes/analyticsRoutes'));
app.use('/api/tenants', require('./routes/tenantRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5001;

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/digital-hospital')
  .then(() => {
    console.log('✅ Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`✅ Server running at http://localhost:${PORT}`);
      console.log(`🔒 Security features enabled`);
      if (process.env.NODE_ENV === 'production') {
        console.log(`⚠️  Demo mode: Sample data only`);
      }
    });
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
  });
