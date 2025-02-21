// import { api as apiClient} from '@/lib/axios';
import { api as apiClient } from '@/mocks/axios';
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
        const { data } = await apiClient.get<PagedDataResponse<NutritionInfoListItem>>(BASE_URL, { params: request });
        return data;
    },

    async getById(id: number): Promise<NutritionInfoDetail> {
        const { data } = await apiClient.get<NutritionInfoDetail>(`${BASE_URL}/${id}`);
        return data;
    },

    async create(request: CreateNutritionInfoRequest): Promise<{ id: number }> {
        const { data } = await apiClient.post<{ id: number }>(BASE_URL, request);
        return data;
    },

    async update(id: number, request: UpdateNutritionInfoRequest): Promise<void> {
        await apiClient.put(`${BASE_URL}/${id}`, request);
    },

    async delete(id: number): Promise<void> {
        await apiClient.delete(`${BASE_URL}/${id}`);
    }
};
