import { api as apiClient } from '@/mocks/axios';
import {
  CreateFinancialRequest,
  Financial,
  QueryFinancialsRequest,
  QueryFinancialsResponse,
  UpdateFinancialRequest
} from '@/types/financial';

const BASE_URL = '/api/v1/financials';

export const financialService = {
  async queryFinancials(request: QueryFinancialsRequest): Promise<{ items: Financial[]; totalCount: number; pageNumber: number; pageSize: number }> {
    const { data } = await apiClient.get(BASE_URL, { params: request });
    return data;
  },

  async getFinancial(id: number): Promise<Financial> {
    const { data } = await apiClient.get(`${BASE_URL}/${id}`);
    return data;
  },

  async createFinancial(request: CreateFinancialRequest): Promise<Financial> {
    const { data } = await apiClient.post(BASE_URL, request);
    return data;
  },

  async updateFinancial(id: number, request: UpdateFinancialRequest): Promise<void> {
    await apiClient.patch(`${BASE_URL}/${id}`, request);
  },

  async deleteFinancial(id: number): Promise<void> {
    await apiClient.delete(`${BASE_URL}/${id}`);
  }
}; 