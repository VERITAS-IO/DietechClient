import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { nutritionService } from '@/services/nutrition-service';
import {
    CreateNutritionInfoRequest,
    UpdateNutritionInfoRequest,
    QueryNutritionInfoRequest
} from '@/types/nutrition';
import { useToast } from './use-toast';

const NUTRITION_INFO_KEYS = {
    all: ['nutrition-info'] as const,
    lists: () => [...NUTRITION_INFO_KEYS.all, 'list'] as const,
    list: (filters: QueryNutritionInfoRequest) => [...NUTRITION_INFO_KEYS.lists(), filters] as const,
    details: () => [...NUTRITION_INFO_KEYS.all, 'detail'] as const,
    detail: (id: number) => [...NUTRITION_INFO_KEYS.details(), id] as const,
};

export const useNutritionInfoQuery = (request: QueryNutritionInfoRequest) => {
    return useQuery({
        queryKey: NUTRITION_INFO_KEYS.list(request),
        queryFn: () => nutritionService.query(request)
    });
};

export const useNutritionInfoDetail = (id: number) => {
    return useQuery({
        queryKey: NUTRITION_INFO_KEYS.detail(id),
        queryFn: () => nutritionService.getById(id),
        enabled: !!id
    });
};

export const useCreateNutritionInfo = () => {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    return useMutation({
        mutationFn: (request: CreateNutritionInfoRequest) => nutritionService.create(request),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: NUTRITION_INFO_KEYS.lists() });
            toast({
                title: "Success",
                description: "Nutrition info created successfully",
            });
        },
        onError: (error) => {
            toast({
                title: "Error",
                description: "Failed to create nutrition info",
                variant: "destructive",
            });
        }
    });
};

export const useUpdateNutritionInfo = () => {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    return useMutation({
        mutationFn: ({ id, request }: { id: number; request: UpdateNutritionInfoRequest }) => 
            nutritionService.update(id, request),
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: NUTRITION_INFO_KEYS.lists() });
            queryClient.invalidateQueries({ queryKey: NUTRITION_INFO_KEYS.detail(id) });
            toast({
                title: "Success",
                description: "Nutrition info updated successfully",
            });
        },
        onError: (error) => {
            toast({
                title: "Error",
                description: "Failed to update nutrition info",
                variant: "destructive",
            });
        }
    });
};

export const useDeleteNutritionInfo = () => {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    return useMutation({
        mutationFn: (id: number) => nutritionService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: NUTRITION_INFO_KEYS.lists() });
            toast({
                title: "Success",
                description: "Nutrition info deleted successfully",
            });
        },
        onError: (error) => {
            toast({
                title: "Error",
                description: "Failed to delete nutrition info",
                variant: "destructive",
            });
        }
    });
};
