import { api as apiClient } from '@/mocks/axios';
import { 
    CreateMealRequest, 
    MealDetailResponse, 
    MealListResponse, 
    QueryMealRequest, 
    UpdateMealRequest 
} from '../types/meal';

const BASE_URL = '/api/v1/meals';

export const mealService = {
    async queryMeals(request: QueryMealRequest): Promise<{ items: MealListResponse[]; totalCount: number; pageNumber: number; pageSize: number }> {
        const { data } = await apiClient.get(BASE_URL, { params: request });
        // The API already returns a paginated structure
        return data;
    },

    async getMeal(id: number): Promise<MealDetailResponse> {
        const { data } = await apiClient.get(`${BASE_URL}/${id}`);
        return data;
    },

    async createMeal(request: CreateMealRequest): Promise<{ id: number; name: string }> {
        const { data } = await apiClient.post(BASE_URL, request);
        return data;
    },

    async updateMeal(id: number, request: UpdateMealRequest): Promise<void> {
        await apiClient.put(`${BASE_URL}/${id}`, request);
    },

    async deleteMeal(id: number): Promise<void> {
        await apiClient.delete(`${BASE_URL}/${id}`);
    }
};
