import { api } from '@/lib/axios';
import { CreateDietRequest, CreateDietResponse, DietDetailResponse, DietListResponse, QueryDietsRequest, UpdateDietRequest } from '../types/diet';
import { ApiService } from '@/types/api';
import { ApiResponse, PagedResponse } from '@/types/common';

const BASE_URL = '/diets';

// ✅ Diet Service Class (Rehberinizden: API template kullan)
class DietService extends ApiService {
  constructor() {
    super(BASE_URL);
  }

  // ✅ Generic methods using template
  async queryDiets(request: QueryDietsRequest): Promise<PagedResponse<DietListResponse>> {
    return this.getPaged('', request as Record<string, unknown>);
  }

  async getDiet(id: number): Promise<ApiResponse<DietDetailResponse>> {
    return this.get(`/${id}`);
  }

  async createDiet(request: CreateDietRequest): Promise<ApiResponse<CreateDietResponse>> {
    return this.post('', request);
  }

  async updateDiet(id: number, request: UpdateDietRequest): Promise<ApiResponse<void>> {
    return this.put(`/${id}`, request);
  }

  async deleteDiet(id: number): Promise<ApiResponse<void>> {
    return this.delete(`/${id}`);
  }
}

// ✅ Service instance (Rehberinizden: Singleton pattern)
export const dietService = new DietService();
