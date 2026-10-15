/**
 * Centralized API client prepared for future Node/Express/MongoDB MERN backend integration.
 * In development without a live backend, falls back gracefully to client state and mockData.
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

class ApiClient {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    // Attach token if present in localStorage (MERN JWT standard)
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        throw new Error(errorBody.message || `API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      // Return null or let caller fallback to local demo store
      console.warn(`[ApiClient] Request to ${url} failed or running in frontend-only mode:`, error.message);
      throw error;
    }
  }

  // Projects & Tasks
  getProjects() {
    return this.request('/projects');
  }

  createProject(data) {
    return this.request('/projects', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  getTasks() {
    return this.request('/tasks');
  }

  updateTask(taskId, data) {
    return this.request(`/tasks/${taskId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  // Team & Payroll
  getPayrollRecords() {
    return this.request('/payroll');
  }

  updatePayrollStatus(employeeId, status) {
    return this.request(`/payroll/${employeeId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }
}

export const api = new ApiClient(API_BASE_URL);
export default api;
