import { api } from '@/lib/axios';
import { 
    CreateMealRequest, 
    MealDetailResponse, 
    MealListResponse, 
    QueryMealRequest, 
    UpdateMealRequest,
    PaginatedMealListResponse
} from '../types/meal';

const BASE_URL = '/meals';

export const mealService = {
    async queryMeals(request: QueryMealRequest): Promise<PaginatedMealListResponse> {
        const { data } = await api.get<PaginatedMealListResponse | MealListResponse[]>(BASE_URL, { params: request });
        
        // Handle both array and paginated responses
        if (Array.isArray(data)) {
            const pageNumber = request.pageNumber || 1;
            const pageSize = request.pageSize || 10;
            return {
                items: data,
                totalCount: data.length,
                pageNumber: pageNumber,
                pageSize: pageSize
            };
        }
        
        return data;
    },

    async getMeal(id: number): Promise<MealDetailResponse> {
        const { data } = await api.get(`${BASE_URL}/${id}`);
        return data;
    },

    async createMeal(request: CreateMealRequest): Promise<{ id: number; name: string }> {
        const { data } = await api.post(BASE_URL, request);
        return data;
    },

    async updateMeal(id: number, request: UpdateMealRequest): Promise<void> {
        await api.put(`${BASE_URL}/${id}`, request);
    },

    async deleteMeal(id: number): Promise<void> {
        await api.delete(`${BASE_URL}/${id}`);
    }
};
