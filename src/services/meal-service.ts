import { api } from '@/lib/axios';
import { 
    CreateMealRequest, 
    MealDetailResponse, 
    MealListResponse, 
    QueryMealRequest, 
    UpdateMealRequest
} from '../types/meal';
import { ApiService } from '@/types/api';
import { ApiResponse, PagedResponse } from '@/types/common';

const BASE_URL = '/meals';

// ✅ Meal Service Class (Rehberinizden: API template kullan)
class MealService extends ApiService {
  constructor() {
    super(BASE_URL);
  }

  // ✅ Generic methods using template
  async queryMeals(request: QueryMealRequest): Promise<PagedResponse<MealListResponse>> {
    return this.getPaged('', request as Record<string, unknown>);
  }

  async getById(id: number): Promise<ApiResponse<MealDetailResponse>> {
    return this.get(`/${id}`);
  }

  async create(request: CreateMealRequest): Promise<ApiResponse<{ id: number }>> {
    return this.post('', request);
  }

  async update(id: number, request: UpdateMealRequest): Promise<ApiResponse<void>> {
    return this.put(`/${id}`, request);
  }

  async deleteMeal(id: number): Promise<ApiResponse<void>> {
    return this.delete(`/${id}`);
  }
}

// ✅ Service instance (Rehberinizden: Singleton pattern)
export const mealService = new MealService();
