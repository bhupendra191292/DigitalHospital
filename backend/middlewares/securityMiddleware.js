const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

// Rate limiting for API endpoints
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Specific limiter for login attempts
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 login attempts per windowMs
  message: {
    error: 'Too many login attempts, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Security headers middleware
const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
});

// Demo environment warning middleware
const demoWarning = (req, res, next) => {
  if (process.env.NODE_ENV === 'production') {
    res.setHeader('X-Demo-System', 'true');
    res.setHeader('X-Data-Type', 'sample-data-only');
  }
  next();
};

// Disable tenant registration in production
const disableTenantRegistration = (req, res, next) => {
  if (process.env.NODE_ENV === 'production' && req.path.includes('/tenants/register')) {
    return res.status(403).json({
      error: 'Tenant registration is disabled in production demo environment'
    });
  }
  next();
};

module.exports = {
  apiLimiter,
  loginLimiter,
  securityHeaders,
  demoWarning,
  disableTenantRegistration
};
