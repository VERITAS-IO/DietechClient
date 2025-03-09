import { api as apiClient } from '@/mocks/axios';
import { CreateDietRequest, DietDetailResponse, DietListResponse, QueryDietsRequest, UpdateDietRequest } from '../types/diet';

const BASE_URL = '/api/v1/diets';

export const dietService = {
    async queryDiets(request: QueryDietsRequest): Promise<{ items: DietListResponse[]; totalCount: number }> {
        const { data } = await apiClient.get(BASE_URL, { params: request });
        // Transform the array response into a paginated structure
        return {
            items: data,
            totalCount: data.length,
        };
    },

    async getDiet(id: number): Promise<DietDetailResponse> {
        const { data } = await apiClient.get(`${BASE_URL}/${id}`);
        return data;
    },

    async createDiet(request: CreateDietRequest): Promise<{ id: number; name: string }> {
        const { data } = await apiClient.post(BASE_URL, request);
        return data;
    },

    async updateDiet(id: number, request: UpdateDietRequest): Promise<void> {
        await apiClient.put(`${BASE_URL}/${id}`, request);
    },

    async deleteDiet(id: number): Promise<void> {
        await apiClient.delete(`${BASE_URL}/${id}`);
    }
};
