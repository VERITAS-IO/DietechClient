import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { dietService } from '../services/diet-service';
import { CreateDietRequest, QueryDietsRequest, UpdateDietRequest } from '../types/diet';
import { useTranslation } from 'react-i18next';
import { useToast } from './use-toast';

const DIET_KEYS = {
    all: ['diets'] as const,
    lists: () => [...DIET_KEYS.all, 'list'] as const,
    list: (filters: QueryDietsRequest) => [...DIET_KEYS.lists(), filters] as const,
    details: () => [...DIET_KEYS.all, 'detail'] as const,
    detail: (id: number) => [...DIET_KEYS.details(), id] as const,
};

export const useQueryDiets = (request: QueryDietsRequest) => {
    return useQuery({
        queryKey: DIET_KEYS.list(request),
        queryFn: () => dietService.queryDiets(request),
    });
};

export const useGetDiet = (id: number) => {
    return useQuery({
        queryKey: DIET_KEYS.detail(id),
        queryFn: () => dietService.getDiet(id),
    });
};

export const useCreateDiet = () => {
    const queryClient = useQueryClient();
    const { toast } = useToast();
    const { t } = useTranslation();

    return useMutation({
        mutationFn: (request: CreateDietRequest) => dietService.createDiet(request),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: DIET_KEYS.lists() });
            toast({
                title: t('common.success'),
                description: t('diet.createSuccess'),
            });
        },
        onError: () => {
            toast({
                title: t('common.error'),
                description: t('diet.createError'),
                variant: 'destructive',
            });
        },
    });
};

export const useUpdateDiet = () => {
    const queryClient = useQueryClient();
    const { toast } = useToast();
    const { t } = useTranslation();

    return useMutation({
        mutationFn: ({ id, request }: { id: number; request: UpdateDietRequest }) =>
            dietService.updateDiet(id, request),
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: DIET_KEYS.lists() });
            queryClient.invalidateQueries({ queryKey: DIET_KEYS.detail(id) });
            toast({
                title: t('common.success'),
                description: t('diet.updateSuccess'),
            });
        },
        onError: () => {
            toast({
                title: t('common.error'),
                description: t('diet.updateError'),
                variant: 'destructive',
            });
        },
    });
};

export const useDeleteDiet = () => {
    const queryClient = useQueryClient();
    const { toast } = useToast();
    const { t } = useTranslation();

    return useMutation({
        mutationFn: (id: number) => dietService.deleteDiet(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: DIET_KEYS.lists() });
            toast({
                title: t('common.success'),
                description: t('diet.deleteSuccess'),
            });
        },
        onError: () => {
            toast({
                title: t('common.error'),
                description: t('diet.deleteError'),
                variant: 'destructive',
            });
        },
    });
};
