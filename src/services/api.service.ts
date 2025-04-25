import axios from 'axios';

const API_URL = 'http://localhost:3000';

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth services
export const authService = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.access_token) {
      localStorage.setItem('token', response.data.access_token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },
  
  register: async (userData: any) => {
    const response = await api.post('/auth/register', userData);
    if (response.data.access_token) {
      localStorage.setItem('token', response.data.access_token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },
  
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    if (userStr) return JSON.parse(userStr);
    return null;
  },
  
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  }
};

// HCM services
export const hcmService = {
  getEmployees: async (tenantId: string) => {
    return api.get(`/hcm/employees?tenantId=${tenantId}`);
  },
  
  createEmployee: async (employeeData: any) => {
    return api.post('/hcm/employees', employeeData);
  },
  
  updateEmployee: async (id: string, tenantId: string, employeeData: any) => {
    return api.put(`/hcm/employees/${id}?tenantId=${tenantId}`, employeeData);
  },
  
  deleteEmployee: async (id: string, tenantId: string) => {
    return api.delete(`/hcm/employees/${id}?tenantId=${tenantId}`);
  }
};

// Licensing services
export const licensingService = {
  getTenantLicense: async (tenantId: string) => {
    return api.get(`/licensing/tenant/${tenantId}`);
  },
  
  checkModuleAccess: async (tenantId: string, moduleName: string) => {
    return api.get(`/licensing/check/${tenantId}/${moduleName}`);
  }
};

// src/services/api.service.ts - Add these to your existing services

// Enums
export enum LeaveStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  CANCELLED = 'cancelled'
}

export enum LeaveType {
  VACATION = 'vacation',
  SICK = 'sick',
  PERSONAL = 'personal',
  BEREAVEMENT = 'bereavement',
  UNPAID = 'unpaid'
}

// Leave services
export const leaveService = {
  // Get leaves for an employee
  getEmployeeLeaves: async (employeeId: string) => {
    return api.get(`/leave?employeeId=${employeeId}`);
  },
  
  // Get pending leaves for a manager
  getPendingLeaves: async (managerId: string) => {
    return api.get('/leave/pending');
  },
  
  // Create a new leave request
  createLeaveRequest: async (leaveData: any) => {
    return api.post('/leave', leaveData);
  },
  
  // Approve a leave request
  approveLeaveRequest: async (leaveId: string) => {
    return api.put(`/leave/${leaveId}/approve`);
  },
  
  // Reject a leave request
  rejectLeaveRequest: async (leaveId: string, data: { rejectionReason: string }) => {
    return api.put(`/leave/${leaveId}/reject`, data);
  },
  
  // Cancel a leave request
  cancelLeaveRequest: async (leaveId: string) => {
    return api.put(`/leave/${leaveId}/cancel`);
  }
};

export default api;