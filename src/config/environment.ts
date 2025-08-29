import { Environment } from '@/types';

/**
 * Environment configuration for the healthcare application
 * Provides type-safe access to environment variables
 */
export const environment: Environment = {
  VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api',
  VITE_APP_NAME: import.meta.env.VITE_APP_NAME || 'Digital Hospital',
  VITE_APP_VERSION: import.meta.env.VITE_APP_VERSION || '1.0.0',
  VITE_ENVIRONMENT: (import.meta.env.VITE_ENVIRONMENT as Environment['VITE_ENVIRONMENT']) || 'development',
};

/**
 * Validates that all required environment variables are present
 * @throws Error if required environment variables are missing
 */
export const validateEnvironment = (): void => {
  const requiredVars = ['VITE_API_BASE_URL'];
  
  for (const varName of requiredVars) {
    if (!import.meta.env[varName]) {
      console.warn(`Missing environment variable: ${varName}`);
    }
  }
};

/**
 * Checks if the application is running in development mode
 */
export const isDevelopment = (): boolean => environment.VITE_ENVIRONMENT === 'development';

/**
 * Checks if the application is running in production mode
 */
export const isProduction = (): boolean => environment.VITE_ENVIRONMENT === 'production';

/**
 * Checks if the application is running in staging mode
 */
export const isStaging = (): boolean => environment.VITE_ENVIRONMENT === 'staging';

/**
 * Gets the API base URL with proper formatting
 */
export const getApiBaseUrl = (): string => {
  const baseUrl = environment.VITE_API_BASE_URL;
  return baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
};

/**
 * Application constants
 */
export const APP_CONSTANTS = {
  APP_NAME: environment.VITE_APP_NAME,
  APP_VERSION: environment.VITE_APP_VERSION,
  API_BASE_URL: getApiBaseUrl(),
  ENVIRONMENT: environment.VITE_ENVIRONMENT,
  DEFAULT_PAGE_SIZE: 10,
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  SUPPORTED_FILE_TYPES: ['.pdf', '.jpg', '.jpeg', '.png'],
  SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutes
} as const;

/**
 * Feature flags for enabling/disabling features
 */
export const FEATURE_FLAGS = {
  ANALYTICS: true,
  PATIENT_COMMUNICATION: true,
  ADVANCED_REPORTS: true,
  FILE_UPLOAD: true,
  REAL_TIME_NOTIFICATIONS: false, // Disabled for now
} as const;

/**
 * API endpoints configuration
 */
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/doctors/login',
    LOGOUT: '/doctors/logout',
    REFRESH: '/doctors/refresh',
  },
  PATIENTS: {
    LIST: '/patients',
    CREATE: '/patients/register',
    GET_BY_ID: (id: string) => `/patients/${id}`,
    UPDATE: (id: string) => `/patients/${id}`,
    DELETE: (id: string) => `/patients/${id}`,
    CHECK: '/patients/check',
  },
  VISITS: {
    LIST: '/visits',
    CREATE: '/visits',
    GET_BY_ID: (id: string) => `/visits/${id}`,
    UPDATE: (id: string) => `/visits/${id}`,
    DELETE: (id: string) => `/visits/${id}`,
    GET_BY_PATIENT: (patientId: string) => `/patients/${patientId}/visits`,
    UPLOAD_REPORT: (id: string) => `/visits/${id}/report`,
  },
  APPOINTMENTS: {
    LIST: '/appointments',
    CREATE: '/appointments',
    GET_BY_ID: (id: string) => `/appointments/${id}`,
    UPDATE: (id: string) => `/appointments/${id}`,
    DELETE: (id: string) => `/appointments/${id}`,
    GET_BY_PATIENT: (patientId: string) => `/appointments/patient/${patientId}`,
    GET_TODAY: '/appointments/today',
  },
  DOCTORS: {
    LIST: '/doctors',
    CREATE: '/doctors',
    GET_BY_ID: (id: string) => `/doctors/${id}`,
    UPDATE: (id: string) => `/doctors/${id}`,
    DELETE: (id: string) => `/doctors/${id}`,
    PROMOTE: (id: string) => `/doctors/${id}/promote`,
  },
  ANALYTICS: {
    TRENDS: '/analytics/trends',
    DASHBOARD_SUMMARY: '/dashboard/summary',
  },
  REPORTS: {
    GENERATE: '/reports/generate',
    DOWNLOAD: (id: string) => `/reports/${id}/download`,
  },
} as const;

export default environment;
