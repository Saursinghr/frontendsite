import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { API_BASE_URL } from '../config';

// API Configuration
const API_TIMEOUT = 30000; // 30 seconds

// Create axios instance with default configuration
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
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
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    // Handle common errors
    if (error.response?.status === 401) {
      // Unauthorized - redirect to login
      localStorage.removeItem('token');
      window.location.href = '/login';
    } else if (error.response?.status === 403) {
      // Forbidden
      console.error('Access forbidden');
    } else if (error.response?.status >= 500) {
      // Server error
      console.error('Server error:', error.response?.data);
    }
    
    return Promise.reject(error);
  }
);

// Generic API methods
export const api = {
  // GET request
  get: async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    const response = await apiClient.get<T>(url, config);
    return response.data;
  },

  // POST request
  post: async <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    const response = await apiClient.post<T>(url, data, config);
    return response.data;
  },

  // PUT request
  put: async <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    const response = await apiClient.put<T>(url, data, config);
    return response.data;
  },

  // PATCH request
  patch: async <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    const response = await apiClient.patch<T>(url, data, config);
    return response.data;
  },

  // DELETE request
  delete: async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    const response = await apiClient.delete<T>(url, config);
    return response.data;
  },

  // File upload
  upload: async <T>(url: string, formData: FormData, config?: AxiosRequestConfig): Promise<T> => {
    const response = await apiClient.post<T>(url, formData, {
      ...config,
      headers: {
        'Content-Type': 'multipart/form-data',
        ...config?.headers,
      },
    });
    return response.data;
  },
};

// API endpoints configuration
export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    PROFILE: '/auth/profile',
  },

  // Dashboard
  DASHBOARD: {
    STATS: '/dashboard/stats',
    OVERVIEW: '/dashboard',
  },

  // Sites
  SITES: {
    ALL: '/dashboard',
    BY_ID: (id: string) => `/dashboard/${id}`,
    CREATE: '/dashboard',
    UPDATE: (id: string) => `/dashboard/${id}`,
    DELETE: (id: string) => `/dashboard/${id}`,
  },

  // Employees/Team
  EMPLOYEES: {
    ALL: '/employee',
    BY_ID: (id: string) => `/employee/${id}`,
    CREATE: '/employee',
    UPDATE: (id: string) => `/employee/${id}`,
    DELETE: (id: string) => `/employee/${id}`,
    ASSIGN_SITE: (id: string) => `/employee/${id}/assign-site`,
  },

  // Attendance
  ATTENDANCE: {
    ALL: '/attendance',
    BY_ID: (id: string) => `/attendance/${id}`,
    CREATE: '/attendance',
    UPDATE: (id: string) => `/attendance/${id}`,
    DELETE: (id: string) => `/attendance/${id}`,
    CLOCK_IN: '/clock-in',
    CLOCK_OUT: '/clock-out',
  },

  // Materials
  MATERIALS: {
    ALL: '/materials',
    BY_ID: (id: string) => `/materials/${id}`,
    CREATE: '/materials',
    UPDATE: (id: string) => `/materials/${id}`,
    DELETE: (id: string) => `/materials/${id}`,
  },

  // Inventory
  INVENTORY: {
    ALL: '/inventory',
    BY_ID: (id: string) => `/inventory/${id}`,
    CREATE: '/inventory',
    UPDATE: (id: string) => `/inventory/${id}`,
    DELETE: (id: string) => `/inventory/${id}`,
    TRANSACTIONS: '/inventory/transactions',
  },

  // Labour
  LABOUR: {
    ALL: '/labour',
    BY_ID: (id: string) => `/labour/${id}`,
    CREATE: '/labour',
    UPDATE: (id: string) => `/labour/${id}`,
    DELETE: (id: string) => `/labour/${id}`,
  },

  // Milestones
  MILESTONES: {
    ALL: '/milestones',
    BY_ID: (id: string) => `/milestones/${id}`,
    CREATE: '/milestones',
    UPDATE: (id: string) => `/milestones/${id}`,
    DELETE: (id: string) => `/milestones/${id}`,
  },

  // Finance
  FINANCE: {
    ALL: '/finance',
    BY_ID: (id: string) => `/finance/${id}`,
    CREATE: '/finance',
    UPDATE: (id: string) => `/finance/${id}`,
    DELETE: (id: string) => `/finance/${id}`,
    EXPENSES: '/finance/expenses',
    PAYROLL: '/payroll',
  },

  // Documents
  DOCUMENTS: {
    ALL: '/document',
    BY_ID: (id: string) => `/document/${id}`,
    UPLOAD: '/document/upload',
    DELETE: (id: string) => `/document/${id}`,
  },

  // Site Expenses
  SITE_EXPENSES: {
    ALL: '/site-expenses',
    BY_ID: (id: string) => `/site-expenses/${id}`,
    CREATE: '/site-expenses',
    UPDATE: (id: string) => `/site-expenses/${id}`,
    DELETE: (id: string) => `/site-expenses/${id}`,
  },

  // Site Photos
  SITE_PHOTOS: {
    ALL: '/site-photos',
    BY_ID: (id: string) => `/site-photos/${id}`,
    UPLOAD: '/site-photos/upload',
    DELETE: (id: string) => `/site-photos/${id}`,
  },

  // Procurement
  PROCUREMENT: {
    ALL: '/procurement',
    BY_ID: (id: string) => `/procurement/${id}`,
    CREATE: '/procurement',
    UPDATE: (id: string) => `/procurement/${id}`,
    DELETE: (id: string) => `/procurement/${id}`,
  },

  // Tenders
  TENDERS: {
    ALL: '/tender',
    BY_ID: (id: string) => `/tender/${id}`,
    CREATE: '/tender',
    UPDATE: (id: string) => `/tender/${id}`,
    DELETE: (id: string) => `/tender/${id}`,
  },

  // Weeks
  WEEKS: {
    ALL: '/weeks',
    BY_ID: (id: string) => `/weeks/${id}`,
    CREATE: '/weeks',
    UPDATE: (id: string) => `/weeks/${id}`,
    DELETE: (id: string) => `/weeks/${id}`,
  },

  // Reports
  REPORTS: {
    ALL: '/reports',
    GENERATE: '/reports/generate',
    DOWNLOAD: (id: string) => `/reports/${id}/download`,
  },

  // Chat
  CHAT: {
    MESSAGES: '/chat',
    SEND: '/chat/send',
  },
};

// Export the axios instance for direct use if needed
export { apiClient };

// Export default api object
export default api;
