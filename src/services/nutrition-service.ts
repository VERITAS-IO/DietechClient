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
        try {
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
            
            // Ensure data.items is always an array
            if (data && !data.items) {
                return {
                    ...data,
                    items: []
                };
            }
        
        return data;
        } catch (error) {
            // Return empty response on error to prevent UI crashes
            return {
                items: [],
                totalCount: 0,
                pageNumber: request.pageNumber || 1,
                pageSize: request.pageSize || 10,
                totalPages: 0,
                hasPreviousPage: false,
                hasNextPage: false
            };
        }
    },

    async getById(id: number): Promise<NutritionInfoDetail> {
        try {
        const { data } = await api.get<NutritionInfoDetail>(`${BASE_URL}/${id}`);
        return data;
        } catch (error) {
            throw error;
        }
    },

    async create(request: CreateNutritionInfoRequest): Promise<{ id: number }> {
        try {
        const { data } = await api.post<{ id: number }>(BASE_URL, request);
        return data;
        } catch (error) {
            throw error;
        }
    },

    async update(id: number, request: UpdateNutritionInfoRequest): Promise<void> {
        try {
        await api.put(`${BASE_URL}/${id}`, request);
        } catch (error) {
            throw error;
        }
    },

    async delete(id: number): Promise<void> {
        try {
        await api.delete(`${BASE_URL}/${id}`);
        } catch (error) {
            throw error;
        }
    }
};
