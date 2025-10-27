import { api as apiClient } from '@/lib/axios';
import {
  CreateFinancialRequest,
  CreateFinancialResponse,
  QueryFinancialsRequest,
  QueryFinancialsResponse,
  UpdateFinancialRequest,
  GetFinancialResponse,
  GetFinancialOverviewInitRequest,
  GetFinancialOverviewInitResponse,
  FinancialInterval,
  FinancialIntervalMapping,
  IntervalData
} from '@/types/financial';
import { ApiService } from '@/types/api';
import { ApiResponse, PagedResponse } from '@/types/common';
import { useAuthStore } from '@/stores/auth-store';
import { formatISO } from 'date-fns';

const BASE_URL = '/financials';

// ✅ Financial Service Class (Rehberinizden: API template kullan)
class FinancialService extends ApiService {
  constructor() {
    super(BASE_URL);
  }

  // ✅ Generic methods using template
  async getFinancials(params?: QueryFinancialsRequest): Promise<PagedResponse<QueryFinancialsResponse>> {
    return this.getPaged('', params as Record<string, unknown>);
  }

  async getFinancial(id: number): Promise<ApiResponse<GetFinancialResponse>> {
    return this.get(`/${id}`);
  }

  async createFinancial(data: CreateFinancialRequest): Promise<ApiResponse<CreateFinancialResponse>> {
    return this.post('', data);
  }

  async updateFinancial(id: number, data: UpdateFinancialRequest): Promise<ApiResponse<void>> {
    return this.put(`/${id}`, data);
  }

  async deleteFinancial(id: number): Promise<ApiResponse<void>> {
    return this.delete(`/${id}`);
  }

  async getFinancialOverview(params: GetFinancialOverviewInitRequest): Promise<ApiResponse<GetFinancialOverviewInitResponse>> {
    return this.get(`/overview?${new URLSearchParams(params as any).toString()}`);
  }
}

// ✅ Service instance (Rehberinizden: Singleton pattern)
export const financialService = new FinancialService();