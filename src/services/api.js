// src/services/api.js
import axios from 'axios';
import { getApiBaseUrl } from '../config/environment';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: getApiBaseUrl(),
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      sessionStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API service functions
export const authAPI = {
  login: (credentials) => api.post('/doctors/login', credentials),
  logout: () => api.post('/doctors/logout'),
  verify: () => api.get('/doctors/verify'),
};

export const patientAPI = {
  register: (patientData) => api.post('/patients/register', patientData),
  getAll: (params) => api.get('/patients', { params }),
  getById: (id) => api.get(`/patients/${id}`),
  update: (id, data) => api.put(`/patients/${id}`, data),
  delete: (id) => api.delete(`/patients/${id}`),
  search: (query) => api.get('/patients/search', { params: { q: query } }),
};

export const appointmentAPI = {
  create: (appointmentData) => api.post('/appointments', appointmentData),
  getAll: (params) => api.get('/appointments', { params }),
  getById: (id) => api.get(`/appointments/${id}`),
  update: (id, data) => api.put(`/appointments/${id}`, data),
  delete: (id) => api.delete(`/appointments/${id}`),
};

export const visitAPI = {
  create: (visitData) => api.post('/visits', visitData),
  getAll: (params) => api.get('/visits', { params }),
  getById: (id) => api.get(`/visits/${id}`),
  update: (id, data) => api.put(`/visits/${id}`, data),
  delete: (id) => api.delete(`/visits/${id}`),
};

export const dashboardAPI = {
  getSummary: () => api.get('/dashboard/summary'),
  getActivity: () => api.get('/dashboard/activity'),
};

export const analyticsAPI = {
  getOverview: (params) => api.get('/analytics/overview', { params }),
  getPatientTrends: (params) => api.get('/analytics/patient-trends', { params }),
  getVisitTrends: (params) => api.get('/analytics/visit-trends', { params }),
};

export const tenantAPI = {
  register: (tenantData) => api.post('/tenants/register', tenantData),
  getById: (id) => api.get(`/tenants/${id}`),
  update: (id, data) => api.put(`/tenants/${id}`, data),
};

export default api;
