import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useToast } from './use-toast';
import { 
  Financial, 
  CreateFinancialRequest, 
  UpdateFinancialRequest, 
  QueryFinancialsRequest
} from '@/types/financial';
import { financialService } from '@/services/financial-service';

// Query key factory
const FINANCIAL_KEYS = {
  all: ['financials'] as const,
  lists: () => [...FINANCIAL_KEYS.all, 'list'] as const,
  list: (filters: QueryFinancialsRequest) => [...FINANCIAL_KEYS.lists(), filters] as const,
  details: () => [...FINANCIAL_KEYS.all, 'detail'] as const,
  detail: (id: number) => [...FINANCIAL_KEYS.details(), id] as const,
};

// Get financials with pagination and filters
export const useGetFinancials = (request: QueryFinancialsRequest) => {
  return useQuery({
    queryKey: FINANCIAL_KEYS.list(request),
    queryFn: () => financialService.queryFinancials(request),
  });
};

// Get a single financial by ID
export const useGetFinancial = (id: number) => {
  return useQuery({
    queryKey: FINANCIAL_KEYS.detail(id),
    queryFn: () => financialService.getFinancial(id),
    enabled: !!id,
  });
};

// Create a new financial
export const useCreateFinancial = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { t } = useTranslation();
  
  return useMutation({
    mutationFn: (request: CreateFinancialRequest) => financialService.createFinancial(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FINANCIAL_KEYS.lists() });
      toast({
        title: t('common.success'),
        description: t('financial.createSuccess'),
      });
    },
    onError: () => {
      toast({
        title: t('common.error'),
        description: t('financial.createError'),
        variant: 'destructive',
      });
    }
  });
};

// Update an existing financial
export const useUpdateFinancial = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { t } = useTranslation();
  
  return useMutation({
    mutationFn: ({ id, request }: { id: number; request: UpdateFinancialRequest }) => 
      financialService.updateFinancial(id, request),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: FINANCIAL_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: FINANCIAL_KEYS.detail(id) });
      toast({
        title: t('common.success'),
        description: t('financial.updateSuccess'),
      });
    },
    onError: () => {
      toast({
        title: t('common.error'),
        description: t('financial.updateError'),
        variant: 'destructive',
      });
    }
  });
};

// Delete a financial
export const useDeleteFinancial = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { t } = useTranslation();
  
  return useMutation({
    mutationFn: (id: number) => financialService.deleteFinancial(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FINANCIAL_KEYS.lists() });
      toast({
        title: t('common.success'),
        description: t('financial.deleteSuccess'),
      });
    },
    onError: () => {
      toast({
        title: t('common.error'),
        description: t('financial.deleteError'),
        variant: 'destructive',
      });
    }
  });
}; 