// src/services/api.js
import api from './axiosInstance';

export const loginDoctor = (phone, password) =>
  api.post('/doctors/login', { phone, password });

export const registerPatient = (data) =>
  api.post('/patients/register', data);

export const checkPatient = (phone) =>
  api.post('/patients/check', { phone });

export const addVisit = (data) =>
  api.post('/visits', data);

export const updateVisit = (visitId, data) =>
  api.patch(`/visits/${visitId}`, data);

export const getVisits = (patientId) =>
  api.get(`/patients/${patientId}/visits`);

export const getDashboardSummary = () =>
  api.get('/dashboard/summary');

export const getTrends = () =>
  api.get('/analytics/trends');

export const getDoctors = () =>
  api.get('/doctors');

export const createDoctor = (data) =>
  api.post('/doctors', data);

export const promoteDoctor = (id) =>
  api.patch(`/doctors/${id}/promote`);

export const updateDoctor = (id, data) =>
  api.patch(`/doctors/${id}`, data);

export const deleteDoctor = (id) =>
  api.delete(`/doctors/${id}`);


export const getPatients = (params) =>
  api.get('/patients', { params });

export const getPatientById = (id) => api.get(`/patients/${id}`);

// Appointment APIs
export const getAppointments = (params) =>
  api.get('/appointments', { params });

export const getAppointmentById = (id) =>
  api.get(`/appointments/${id}`);

export const createAppointment = (data) =>
  api.post('/appointments', data);

export const updateAppointment = (id, data) =>
  api.patch(`/appointments/${id}`, data);

export const deleteAppointment = (id) =>
  api.delete(`/appointments/${id}`);

export const getPatientAppointments = (patientId) =>
  api.get(`/appointments/patient/${patientId}`);

export const getTodayAppointments = () =>
  api.get('/appointments/today');

// Admin APIs
export const getAdminDashboard = () =>
  api.get('/admin/dashboard');

export const getAuditLogs = (params) =>
  api.get('/admin/audit-logs', { params });

// Tenant APIs
export const registerTenant = (data) =>
  api.post('/tenants/register', data);

export const getTenantConfig = () =>
  api.get('/tenants/config');

export const updateTenantConfig = (data) =>
  api.patch('/tenants/config', data);

export const getTenantStats = () =>
  api.get('/tenants/stats');
