// Environment configuration for different deployment stages
const environment = {
  // Development
  development: {
    VITE_API_BASE_URL: 'http://localhost:5001/api',
    VITE_APP_NAME: 'Digital Hospital',
    VITE_APP_VERSION: '1.0.0',
    VITE_ENVIRONMENT: 'development',
  },
  
  // Production
  production: {
    VITE_API_BASE_URL: process.env.VITE_API_BASE_URL || 'https://your-backend-url.railway.app/api',
    VITE_APP_NAME: 'Digital Hospital',
    VITE_APP_VERSION: '1.0.0',
    VITE_ENVIRONMENT: 'production',
  },
  
  // Staging
  staging: {
    VITE_API_BASE_URL: process.env.VITE_API_BASE_URL || 'https://your-staging-backend.railway.app/api',
    VITE_APP_NAME: 'Digital Hospital (Staging)',
    VITE_APP_VERSION: '1.0.0',
    VITE_ENVIRONMENT: 'staging',
  }
};

// Get current environment
const currentEnv = import.meta.env.MODE || 'development';
const config = environment[currentEnv] || environment.development;

// Helper functions
export const isDevelopment = () => currentEnv === 'development';
export const isProduction = () => currentEnv === 'production';
export const isStaging = () => currentEnv === 'staging';

// Get API base URL
export const getApiBaseUrl = () => config.VITE_API_BASE_URL;

// App constants
export const APP_CONSTANTS = {
  APP_NAME: config.VITE_APP_NAME,
  APP_VERSION: config.VITE_APP_VERSION,
  API_BASE_URL: config.VITE_API_BASE_URL,
  ENVIRONMENT: config.VITE_ENVIRONMENT,
  DEFAULT_PAGE_SIZE: 10,
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  SUPPORTED_FILE_TYPES: ['.pdf', '.jpg', '.jpeg', '.png'],
  SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutes
};

// Feature flags
export const FEATURE_FLAGS = {
  ANALYTICS: true,
  PATIENT_COMMUNICATION: true,
  ADVANCED_REPORTS: true,
  FILE_UPLOAD: true,
  REAL_TIME_NOTIFICATIONS: false,
};

// API endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/doctors/login',
    LOGOUT: '/doctors/logout',
    REFRESH: '/doctors/refresh',
    VERIFY: '/doctors/verify',
  },
  PATIENTS: {
    REGISTER: '/patients/register',
    LIST: '/patients',
    DETAILS: '/patients/:id',
    UPDATE: '/patients/:id',
    DELETE: '/patients/:id',
    SEARCH: '/patients/search',
  },
  APPOINTMENTS: {
    CREATE: '/appointments',
    LIST: '/appointments',
    DETAILS: '/appointments/:id',
    UPDATE: '/appointments/:id',
    DELETE: '/appointments/:id',
  },
  VISITS: {
    CREATE: '/visits',
    LIST: '/visits',
    DETAILS: '/visits/:id',
    UPDATE: '/visits/:id',
    DELETE: '/visits/:id',
  },
  DASHBOARD: {
    SUMMARY: '/dashboard/summary',
    ACTIVITY: '/dashboard/activity',
  },
  ANALYTICS: {
    OVERVIEW: '/analytics/overview',
    PATIENT_TRENDS: '/analytics/patient-trends',
    VISIT_TRENDS: '/analytics/visit-trends',
  },
  TENANTS: {
    REGISTER: '/tenants/register',
    DETAILS: '/tenants/:id',
    UPDATE: '/tenants/:id',
  },
};

export default config;
