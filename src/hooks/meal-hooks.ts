import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { mealService } from '../services/meal-service';
import { CreateMealRequest, QueryMealRequest, UpdateMealRequest } from '../types/meal';
import { useTranslation } from 'react-i18next';
import { useToast } from './use-toast';

const MEAL_KEYS = {
    all: ['meals'] as const,
    lists: () => [...MEAL_KEYS.all, 'list'] as const,
    list: (filters: QueryMealRequest) => [...MEAL_KEYS.lists(), filters] as const,
    details: () => [...MEAL_KEYS.all, 'detail'] as const,
    detail: (id: number) => [...MEAL_KEYS.details(), id] as const,
};

export const useQueryMeals = (request: QueryMealRequest) => {
    return useQuery({
        queryKey: MEAL_KEYS.list(request),
        queryFn: () => mealService.queryMeals(request),
    });
};

export const useGetMeal = (id: number) => {
    return useQuery({
        queryKey: MEAL_KEYS.detail(id),
        queryFn: () => mealService.getMeal(id),
        enabled: !!id, // Only run the query if id is provided
    });
};

export const useCreateMeal = () => {
    const queryClient = useQueryClient();
    const { toast } = useToast();
    const { t } = useTranslation();

    return useMutation({
        mutationFn: (request: CreateMealRequest) => mealService.createMeal(request),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: MEAL_KEYS.lists() });
            toast({
                title: t('common.success'),
                description: t('meal.createSuccess'),
            });
        },
        onError: () => {
            toast({
                title: t('common.error'),
                description: t('meal.createError'),
                variant: 'destructive',
            });
        },
    });
};

export const useUpdateMeal = () => {
    const queryClient = useQueryClient();
    const { toast } = useToast();
    const { t } = useTranslation();

    return useMutation({
        mutationFn: ({ id, request }: { id: number; request: UpdateMealRequest }) =>
            mealService.updateMeal(id, request),
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: MEAL_KEYS.lists() });
            queryClient.invalidateQueries({ queryKey: MEAL_KEYS.detail(id) });
            toast({
                title: t('common.success'),
                description: t('meal.updateSuccess'),
            });
        },
        onError: () => {
            toast({
                title: t('common.error'),
                description: t('meal.updateError'),
                variant: 'destructive',
            });
        },
    });
};

export const useDeleteMeal = () => {
    const queryClient = useQueryClient();
    const { toast } = useToast();
    const { t } = useTranslation();

    return useMutation({
        mutationFn: (id: number) => mealService.deleteMeal(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: MEAL_KEYS.lists() });
            toast({
                title: t('common.success'),
                description: t('meal.deleteSuccess'),
            });
        },
        onError: () => {
            toast({
                title: t('common.error'),
                description: t('meal.deleteError'),
                variant: 'destructive',
            });
        },
    });
};
