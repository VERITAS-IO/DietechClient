import { api } from '@/lib/axios';
import { 
    CreateMealRequest, 
    MealDetailResponse, 
    MealListResponse, 
    QueryMealRequest, 
    UpdateMealRequest,
    PaginatedMealListResponse
} from '../types/meal';
import { PagedDataResponse } from '@/types/response-types';

const BASE_URL = '/meals';

export const mealService = {
    async queryMeals(request: QueryMealRequest): Promise<PagedDataResponse<MealListResponse>> {
        const { data } = await api.get<PagedDataResponse<MealListResponse> | MealListResponse[]>(BASE_URL, { params: request });        
        if (Array.isArray(data)) {
            const pageNumber = request.pageNumber || 1;
            const pageSize = request.pageSize || 10;
            return {
                items: data,
                totalCount: data.length,
                pageNumber: pageNumber,
                pageSize: pageSize,
                totalPages: Math.ceil(data.length / pageSize),
                hasPreviousPage: pageNumber > 1,
                hasNextPage: pageNumber * pageSize < data.length
            };
        }
        
        return data;
    },

    async getById(id: number): Promise<MealDetailResponse> {
        const { data } = await api.get<MealDetailResponse>(`${BASE_URL}/${id}`);
        return data;
    },

    async create(request: CreateMealRequest): Promise<{ id: number }> {
        const { data } = await api.post<{ id: number }>(BASE_URL, request);
        return data;
    },

    async update(id: number, request: UpdateMealRequest): Promise<void> {
        await api.put(`${BASE_URL}/${id}`, request);
    },

    async delete(id: number): Promise<void> {
        await api.delete(`${BASE_URL}/${id}`);
    }
};
