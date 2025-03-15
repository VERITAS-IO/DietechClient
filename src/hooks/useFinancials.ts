import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { 
  Financial, 
  CreateFinancialRequest, 
  UpdateFinancialRequest, 
  QueryFinancialsRequest,
  QueryFinancialsResponse
} from '@/types/financial';
import { api } from '@/lib/api';

// Query key factory
const financialKeys = {
  all: ['financials'] as const,
  lists: () => [...financialKeys.all, 'list'] as const,
  list: (filters: QueryFinancialsRequest) => [...financialKeys.lists(), filters] as const,
  details: () => [...financialKeys.all, 'detail'] as const,
  detail: (id: string) => [...financialKeys.details(), id] as const,
};

// Get financials with pagination and filters
export const useGetFinancials = (params: QueryFinancialsRequest) => {
  const { t } = useTranslation();
  
  return useQuery<QueryFinancialsResponse, Error>({
    queryKey: financialKeys.list(params),
    queryFn: async (): Promise<QueryFinancialsResponse> => {
      try {
        const response = await api.get('/financials', { params });
        return response.data;
      } catch (error) {
        toast.error(t('common.error.fetch'));
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get a single financial by ID
export const useGetFinancial = (id: string) => {
  const { t } = useTranslation();
  
  return useQuery<Financial, Error>({
    queryKey: financialKeys.detail(id),
    queryFn: async (): Promise<Financial> => {
      try {
        const response = await api.get(`/financials/${id}`);
        return response.data;
      } catch (error) {
        toast.error(t('common.error.fetch'));
        throw error;
      }
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Create a new financial
export const useCreateFinancial = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  
  return useMutation({
    mutationFn: async (data: CreateFinancialRequest): Promise<Financial> => {
      const response = await api.post('/financials', data);
      return response.data;
    },
    onSuccess: () => {
      toast.success(t('financial.createSuccess'));
      queryClient.invalidateQueries({ queryKey: financialKeys.lists() });
    },
    onError: () => {
      toast.error(t('financial.createError'));
    }
  });
};

// Update an existing financial
export const useUpdateFinancial = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  
  return useMutation({
    mutationFn: async (data: UpdateFinancialRequest): Promise<Financial> => {
      const response = await api.put(`/financials/${data.id}`, data);
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(t('financial.updateSuccess'));
      queryClient.invalidateQueries({ queryKey: financialKeys.lists() });
      queryClient.invalidateQueries({ queryKey: financialKeys.detail(data.id) });
    },
    onError: () => {
      toast.error(t('financial.updateError'));
    }
  });
};

// Delete a financial
export const useDeleteFinancial = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  
  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      await api.delete(`/financials/${id}`);
    },
    onSuccess: (_, id) => {
      toast.success(t('financial.deleteSuccess'));
      queryClient.invalidateQueries({ queryKey: financialKeys.lists() });
      queryClient.invalidateQueries({ queryKey: financialKeys.detail(id) });
    },
    onError: () => {
      toast.error(t('financial.deleteError'));
    }
  });
}; 