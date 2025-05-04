import { api } from '@/lib/axios';
import { CreateDietRequest, CreateDietResponse, DietDetailResponse, DietListResponse, QueryDietsRequest, UpdateDietRequest } from '../types/diet';

const BASE_URL = '/diets';

export const dietService = {
    async queryDiets(request: QueryDietsRequest): Promise<{ items: DietListResponse[]; totalCount: number; pageNumber: number; pageSize: number }> {
        const { data } = await api.get(BASE_URL, { params: request });
        
        // Handle the array response from the API
        const items = Array.isArray(data) ? data : [];
        
        return {
            items,
            totalCount: items.length,
            pageNumber: request.pageNumber || 1,
            pageSize: request.pageSize || 10
        };
    },

    async getDiet(id: number): Promise<DietDetailResponse> {
        const { data } = await api.get(`${BASE_URL}/${id}`);
        return data;
    },

    async createDiet(request: CreateDietRequest): Promise<CreateDietResponse> {
        const { data } = await api.post(BASE_URL, request);
        return data;
    },

    async updateDiet(id: number, request: UpdateDietRequest): Promise<void> {
        await api.put(`${BASE_URL}/${id}`, request);
    },

    async deleteDiet(id: number): Promise<void> {
        await api.delete(`${BASE_URL}/${id}`);
    }
};
