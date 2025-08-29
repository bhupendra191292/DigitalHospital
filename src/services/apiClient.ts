import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import Cookies from 'js-cookie';
import { 
  API_ENDPOINTS, 
  APP_CONSTANTS, 
  isDevelopment 
} from '@/config/environment';
import { 
  ApiError, 
  AuthError, 
  NetworkError, 
  handleError, 
  createErrorResponse 
} from '@/utils/errorHandler';
import { 
  ApiResponse, 
  PaginatedResponse, 
  User, 
  Patient, 
  Visit, 
  Appointment,
  LoginForm,
  PatientForm,
  VisitForm,
  AppointmentForm 
} from '@/types';

/**
 * Professional API client for healthcare application
 * Handles authentication, error handling, and request/response interceptors
 */
class ApiClient {
  private client: AxiosInstance;
  private isRefreshing = false;
  private failedQueue: Array<{
    resolve: (value?: any) => void;
    reject: (error?: any) => void;
  }> = [];

  constructor() {
    this.client = axios.create({
      baseURL: APP_CONSTANTS.API_BASE_URL,
      timeout: 30000, // 30 seconds
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  /**
   * Sets up request and response interceptors
   */
  private setupInterceptors(): void {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        const token = this.getAuthToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        // Add request ID for tracking
        config.headers['X-Request-ID'] = this.generateRequestId();

        if (isDevelopment()) {
          console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`, {
            data: config.data,
            params: config.params,
          });
        }

        return config;
      },
      (error) => {
        handleError(error, 'Request Interceptor Error');
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        if (isDevelopment()) {
          console.log(`✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url}`, {
            status: response.status,
            data: response.data,
          });
        }

        return response;
      },
      async (error: AxiosError) => {
        const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

        if (this.shouldRetryRequest(error) && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            await this.refreshToken();
            const token = this.getAuthToken();
            if (token) {
              originalRequest.headers = originalRequest.headers || {};
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return this.client(originalRequest);
          } catch (refreshError) {
            this.handleAuthFailure();
            return Promise.reject(refreshError);
          }
        }

        const apiError = this.createApiError(error);
        handleError(apiError, 'API Response Error');
        return Promise.reject(apiError);
      }
    );
  }

  /**
   * Generates a unique request ID for tracking
   */
  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Gets the authentication token from cookies
   */
  private getAuthToken(): string | null {
    return Cookies.get('token') || null;
  }

  /**
   * Determines if a request should be retried
   */
  private shouldRetryRequest(error: AxiosError): boolean {
    return error.response?.status === 401 && !this.isRefreshing;
  }

  /**
   * Refreshes the authentication token
   */
  private async refreshToken(): Promise<void> {
    if (this.isRefreshing) {
      return new Promise((resolve, reject) => {
        this.failedQueue.push({ resolve, reject });
      });
    }

    this.isRefreshing = true;

    try {
      const response = await this.client.post(API_ENDPOINTS.AUTH.REFRESH);
      const { token } = response.data;
      
      if (token) {
        Cookies.set('token', token);
        this.processQueue(null, token);
      }
    } catch (error) {
      this.processQueue(error, null);
      throw error;
    } finally {
      this.isRefreshing = false;
    }
  }

  /**
   * Processes the queue of failed requests
   */
  private processQueue(error: any, token: string | null): void {
    this.failedQueue.forEach(({ resolve, reject }) => {
      if (error) {
        reject(error);
      } else {
        resolve(token);
      }
    });

    this.failedQueue = [];
  }

  /**
   * Handles authentication failure
   */
  private handleAuthFailure(): void {
    Cookies.remove('token');
    Cookies.remove('role');
    window.location.href = '/';
  }

  /**
   * Creates a standardized API error
   */
  private createApiError(error: AxiosError): ApiError {
    const statusCode = error.response?.status || 0;
    const message = error.response?.data?.message || error.message || 'API request failed';
    const endpoint = error.config?.url || 'unknown';
    const method = error.config?.method || 'unknown';

    return new ApiError(message, statusCode, endpoint, method);
  }

  /**
   * Generic GET request
   */
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.get<ApiResponse<T>>(url, config);
      return response.data;
    } catch (error) {
      throw this.createApiError(error as AxiosError);
    }
  }

  /**
   * Generic POST request
   */
  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.post<ApiResponse<T>>(url, data, config);
      return response.data;
    } catch (error) {
      throw this.createApiError(error as AxiosError);
    }
  }

  /**
   * Generic PUT request
   */
  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.put<ApiResponse<T>>(url, data, config);
      return response.data;
    } catch (error) {
      throw this.createApiError(error as AxiosError);
    }
  }

  /**
   * Generic PATCH request
   */
  async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.patch<ApiResponse<T>>(url, data, config);
      return response.data;
    } catch (error) {
      throw this.createApiError(error as AxiosError);
    }
  }

  /**
   * Generic DELETE request
   */
  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.delete<ApiResponse<T>>(url, config);
      return response.data;
    } catch (error) {
      throw this.createApiError(error as AxiosError);
    }
  }

  /**
   * File upload request
   */
  async upload<T>(url: string, formData: FormData, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.post<ApiResponse<T>>(url, formData, {
        ...config,
        headers: {
          ...config?.headers,
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw this.createApiError(error as AxiosError);
    }
  }

  // Authentication Methods
  async login(credentials: LoginForm): Promise<ApiResponse<{ token: string; doctor: User }>> {
    return this.post(API_ENDPOINTS.AUTH.LOGIN, credentials);
  }

  async logout(): Promise<ApiResponse<void>> {
    return this.post(API_ENDPOINTS.AUTH.LOGOUT);
  }

  // Patient Methods
  async getPatients(params?: any): Promise<ApiResponse<PaginatedResponse<Patient>>> {
    return this.get(API_ENDPOINTS.PATIENTS.LIST, { params });
  }

  async getPatient(id: string): Promise<ApiResponse<Patient>> {
    return this.get(API_ENDPOINTS.PATIENTS.GET_BY_ID(id));
  }

  async createPatient(patient: PatientForm): Promise<ApiResponse<Patient>> {
    return this.post(API_ENDPOINTS.PATIENTS.CREATE, patient);
  }

  async updatePatient(id: string, patient: Partial<PatientForm>): Promise<ApiResponse<Patient>> {
    return this.patch(API_ENDPOINTS.PATIENTS.UPDATE(id), patient);
  }

  async deletePatient(id: string): Promise<ApiResponse<void>> {
    return this.delete(API_ENDPOINTS.PATIENTS.DELETE(id));
  }

  async checkPatient(phone: string): Promise<ApiResponse<Patient>> {
    return this.post(API_ENDPOINTS.PATIENTS.CHECK, { phone });
  }

  // Visit Methods
  async getVisits(patientId: string): Promise<ApiResponse<Visit[]>> {
    return this.get(API_ENDPOINTS.VISITS.GET_BY_PATIENT(patientId));
  }

  async createVisit(visit: VisitForm): Promise<ApiResponse<Visit>> {
    const formData = new FormData();
    
    // Add basic fields
    formData.append('patientId', visit.patientId);
    formData.append('symptoms', visit.symptoms);
    formData.append('diagnosis', visit.diagnosis);
    formData.append('prescription', JSON.stringify(visit.prescription));
    
    if (visit.notes) {
      formData.append('notes', visit.notes);
    }
    
    if (visit.report) {
      formData.append('report', visit.report);
    }

    return this.upload(API_ENDPOINTS.VISITS.CREATE, formData);
  }

  async updateVisit(id: string, visit: Partial<VisitForm>): Promise<ApiResponse<Visit>> {
    return this.patch(API_ENDPOINTS.VISITS.UPDATE(id), visit);
  }

  async deleteVisit(id: string): Promise<ApiResponse<void>> {
    return this.delete(API_ENDPOINTS.VISITS.DELETE(id));
  }

  async uploadVisitReport(id: string, file: File): Promise<ApiResponse<Visit>> {
    const formData = new FormData();
    formData.append('report', file);
    return this.upload(API_ENDPOINTS.VISITS.UPLOAD_REPORT(id), formData);
  }

  // Appointment Methods
  async getAppointments(params?: any): Promise<ApiResponse<PaginatedResponse<Appointment>>> {
    return this.get(API_ENDPOINTS.APPOINTMENTS.LIST, { params });
  }

  async createAppointment(appointment: AppointmentForm): Promise<ApiResponse<Appointment>> {
    return this.post(API_ENDPOINTS.APPOINTMENTS.CREATE, appointment);
  }

  async updateAppointment(id: string, appointment: Partial<AppointmentForm>): Promise<ApiResponse<Appointment>> {
    return this.patch(API_ENDPOINTS.APPOINTMENTS.UPDATE(id), appointment);
  }

  async deleteAppointment(id: string): Promise<ApiResponse<void>> {
    return this.delete(API_ENDPOINTS.APPOINTMENTS.DELETE(id));
  }

  // Analytics Methods
  async getAnalyticsTrends(params?: any): Promise<ApiResponse<any>> {
    return this.get(API_ENDPOINTS.ANALYTICS.TRENDS, { params });
  }

  async getDashboardSummary(): Promise<ApiResponse<any>> {
    return this.get(API_ENDPOINTS.ANALYTICS.DASHBOARD_SUMMARY);
  }
}

// Export singleton instance
export const apiClient = new ApiClient();

// Export for backward compatibility
export default apiClient;
