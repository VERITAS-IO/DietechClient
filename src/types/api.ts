// 🎯 API Service Template (Rehberinizden)
// Copy-paste friendly, basit ve pratik

import { ApiResponse, PagedResponse } from './common';

// ✅ Generic API Service Template
export class ApiService {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  // ✅ Generic GET Request
  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    const response = await fetch(`${this.baseUrl}${endpoint}`);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Request failed');
    }
    
    return { data, success: true, message: 'OK' };
  }

  // ✅ Generic POST Request
  async post<T, R>(endpoint: string, data: T): Promise<ApiResponse<R>> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    
    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.message || 'Request failed');
    }
    
    return { data: result, success: true, message: 'OK' };
  }

  // ✅ Generic PUT Request
  async put<T, R>(endpoint: string, data: T): Promise<ApiResponse<R>> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    
    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.message || 'Request failed');
    }
    
    return { data: result, success: true, message: 'OK' };
  }

  // ✅ Generic DELETE Request
  async delete(endpoint: string): Promise<ApiResponse<void>> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Request failed');
    }
    
    return { data: undefined, success: true, message: 'OK' };
  }

  // ✅ Paged Request Helper
  async getPaged<T>(endpoint: string, params?: Record<string, unknown>): Promise<PagedResponse<T>> {
    const url = new URL(`${this.baseUrl}${endpoint}`);
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }
    
    const response = await fetch(url.toString());
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Request failed');
    }
    
    return data;
  }
}

// ✅ Specific Service Examples
export class UserService extends ApiService {
  constructor(baseUrl: string) {
    super(baseUrl);
  }

  async getUsers(params?: { pageNumber?: number; pageSize?: number; search?: string }) {
    return this.getPaged('/users', params);
  }

  async getUser(id: number) {
    return this.get(`/users/${id}`);
  }

  async createUser(userData: Record<string, unknown>) {
    return this.post('/users', userData);
  }

  async updateUser(id: number, userData: Record<string, unknown>) {
    return this.put(`/users/${id}`, userData);
  }

  async deleteUser(id: number) {
    return this.delete(`/users/${id}`);
  }
}

// ✅ Financial Service Example
export class FinancialService extends ApiService {
  constructor(baseUrl: string) {
    super(baseUrl);
  }

  async getFinancials(params?: {
    pageNumber?: number;
    pageSize?: number;
    type?: string;
    status?: string;
    startDate?: string;
    endDate?: string;
  }) {
    return this.getPaged('/financials', params);
  }

  async createFinancial(financialData: Record<string, unknown>) {
    return this.post('/financials', financialData);
  }

  async updateFinancial(id: number, financialData: Record<string, unknown>) {
    return this.put(`/financials/${id}`, financialData);
  }

  async deleteFinancial(id: number) {
    return this.delete(`/financials/${id}`);
  }
}

// ✅ Service Factory (Rehberinizden: Basit pattern)
export function createApiService(baseUrl: string) {
  return {
    users: new UserService(baseUrl),
    financials: new FinancialService(baseUrl),
    // Diğer servisler buraya eklenebilir
  };
}

// ✅ Usage Example
// const api = createApiService('https://api.example.com');
// const users = await api.users.getUsers({ pageNumber: 1, pageSize: 10 });
// const financial = await api.financials.createFinancial({ amount: 100, type: 'Income' });
