// Core Types
export interface User {
  _id: string;
  name: string;
  phone: string;
  role: 'admin' | 'doctor';
  specialization?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Patient {
  _id: string;
  name: string;
  phone: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  address: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  medicalHistory?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Visit {
  _id: string;
  patientId: string;
  doctorId: string;
  date: string;
  symptoms: string;
  diagnosis: string;
  prescription: Prescription[];
  notes?: string;
  report?: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

export interface Prescription {
  medicine: string;
  dose: string;
  frequency: string;
}

export interface Appointment {
  _id: string;
  patientId: string;
  patientName: string;
  date: string;
  time: string;
  type: 'consultation' | 'follow-up' | 'emergency' | 'checkup';
  status: 'confirmed' | 'pending' | 'cancelled';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MedicalRecord {
  id: string;
  patientId: string;
  date: string;
  type: 'consultation' | 'follow-up' | 'emergency' | 'surgery' | 'lab-test';
  diagnosis: string;
  treatment: string;
  prescription?: string;
  notes?: string;
  followUpDate?: string;
}

export interface Message {
  id: string;
  patientId: string;
  type: 'sms' | 'email' | 'voice' | 'video';
  content: string;
  timestamp: string;
  status: 'sending' | 'sent' | 'delivered' | 'read' | 'failed';
}

export interface Report {
  id: string;
  type: string;
  title: string;
  description: string;
  lastGenerated: string;
  status: 'completed' | 'generating' | 'failed';
  format: 'pdf' | 'excel' | 'csv';
}

// Analytics Types
export interface AnalyticsData {
  patientTrends: {
    labels: string[];
    data: number[];
  };
  visitTrends: {
    labels: string[];
    data: number[];
  };
  genderDistribution: {
    labels: string[];
    data: number[];
  };
  ageDistribution: {
    labels: string[];
    data: number[];
  };
  topConditions: Array<{
    condition: string;
    count: number;
  }>;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Form Types
export interface LoginForm {
  phone: string;
  password: string;
}

export interface PatientForm {
  name: string;
  phone: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  address: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  medicalHistory?: string;
}

export interface VisitForm {
  patientId: string;
  symptoms: string;
  diagnosis: string;
  prescription: Prescription[];
  notes?: string;
  report?: File;
}

export interface AppointmentForm {
  patientId: string;
  date: string;
  time: string;
  type: 'consultation' | 'follow-up' | 'emergency' | 'checkup';
  notes?: string;
}

// Component Props Types
export interface DashboardProps {
  token: string;
}

export interface PatientSearchProps {
  token: string;
}

export interface AnalyticsChartsProps {
  token: string;
}

export interface PatientManagementProps {
  token: string;
}

export interface MedicalRecordsProps {
  token: string;
}

export interface PatientCommunicationProps {
  token: string;
}

export interface ReportsProps {
  token: string;
}

// Redux Types
export interface AuthState {
  doctor: User | null;
  token: string | null;
  role: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export interface RootState {
  auth: AuthState;
}

// Environment Types
export interface Environment {
  VITE_API_BASE_URL: string;
  VITE_APP_NAME: string;
  VITE_APP_VERSION: string;
  VITE_ENVIRONMENT: 'development' | 'staging' | 'production';
}

// Utility Types
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export type SortDirection = 'asc' | 'desc';

export type FilterOperator = 'equals' | 'contains' | 'greater_than' | 'less_than' | 'in';

export interface Filter {
  field: string;
  operator: FilterOperator;
  value: string | number | string[] | number[];
}

export interface Sort {
  field: string;
  direction: SortDirection;
}

export interface QueryParams {
  page?: number;
  limit?: number;
  search?: string;
  filters?: Filter[];
  sort?: Sort[];
}

// Chart Types
export interface ChartData {
  labels: string[];
  datasets: Array<{
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string | string[];
    borderWidth?: number;
    fill?: boolean;
    tension?: number;
  }>;
}

export interface ChartOptions {
  responsive: boolean;
  plugins: {
    legend: {
      position: 'top' | 'bottom' | 'left' | 'right';
    };
    title: {
      display: boolean;
      text: string;
    };
  };
  scales?: {
    y: {
      beginAtZero: boolean;
    };
  };
}
