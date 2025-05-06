import { api } from '@/lib/axios';
import { PagedDataResponse } from '@/types/response-types';
import {
    CreateNutritionInfoRequest,
    UpdateNutritionInfoRequest,
    QueryNutritionInfoRequest,
    NutritionInfoListItem,
    NutritionInfoDetail
} from '@/types/nutrition';

const BASE_URL = '/nutrition-info';

export const nutritionService = {
    async query(request: QueryNutritionInfoRequest): Promise<PagedDataResponse<NutritionInfoListItem>> {
        const { data } = await api.get<PagedDataResponse<NutritionInfoListItem> | NutritionInfoListItem[]>(BASE_URL, { params: request });
        
        // Handle both array and paginated responses
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

    async getById(id: number): Promise<NutritionInfoDetail> {
        const { data } = await api.get<NutritionInfoDetail>(`${BASE_URL}/${id}`);
        return data;
    },

    async create(request: CreateNutritionInfoRequest): Promise<{ id: number }> {
        const { data } = await api.post<{ id: number }>(BASE_URL, request);
        return data;
    },

    async update(id: number, request: UpdateNutritionInfoRequest): Promise<void> {
        await api.put(`${BASE_URL}/${id}`, request);
    },

    async delete(id: number): Promise<void> {
        await api.delete(`${BASE_URL}/${id}`);
    }
};
