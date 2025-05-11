import { useMutation, useQuery, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useToast } from './use-toast';
import React, { useEffect } from 'react';
import { 
  Financial, 
  CreateFinancialRequest, 
  UpdateFinancialRequest, 
  QueryFinancialsRequest,
  GetFinancialOverviewInitRequest,
  GetFinancialOverviewInitResponse,
  QueryFinancialsResponse
} from '@/types/financial';
import { financialService } from '@/services/financial-service';
import { useAuthStore } from '@/stores/auth-store';

// Query key factory
const FINANCIAL_KEYS = {
  all: ['financials'] as const,
  lists: () => [...FINANCIAL_KEYS.all, 'list'] as const,
  list: (filters: QueryFinancialsRequest) => [...FINANCIAL_KEYS.lists(), filters] as const,
  details: () => [...FINANCIAL_KEYS.all, 'detail'] as const,
  detail: (id: number) => [...FINANCIAL_KEYS.details(), id] as const,
  overview: (request?: GetFinancialOverviewInitRequest) => [...FINANCIAL_KEYS.all, 'overview', request] as const,
};

// Default value for stale time (5 minutes)
const DEFAULT_STALE_TIME = 5 * 60 * 1000;

// Function to log cache status
const logQueryStatus = (isFetching: boolean, isStale: boolean, queryKey: any) => {
  if (isFetching) {
    console.log(`Query ${JSON.stringify(queryKey)} is being fetched from network`);
  } else if (!isStale) {
    console.log(`Query ${JSON.stringify(queryKey)} using fresh cached data`);
  } else {
    console.log(`Query ${JSON.stringify(queryKey)} using stale cached data`);
  }
};

export const useGetFinancials = (
  request: QueryFinancialsRequest,
  options?: Omit<UseQueryOptions<QueryFinancialsResponse[], Error>, 'queryKey' | 'queryFn'>
) => {
  console.log('useGetFinancials hook called with request:', request);
  const { toast } = useToast();
  const { t } = useTranslation();
  
  // Create a mutable copy of the request to avoid modifying the original
  const mutableRequest = { ...request };
  
  // Check if dieticianId is missing and try to get it from auth store
  if (!mutableRequest.dieticianId) {
    const user = useAuthStore.getState().user;
    if (user?.dieticianId) {
      mutableRequest.dieticianId = user.dieticianId;
      console.log('Added dieticianId from user profile:', user.dieticianId);
    } else if (user?.id && user.roles?.includes('Dietician')) {
      mutableRequest.dieticianId = Number(user.id);
      console.log('Using user ID as dieticianId fallback:', user.id);
    } else {
      console.warn('No dieticianId available for financial request!');
    }
  } else {
    console.log('Using provided dieticianId for financials request:', mutableRequest.dieticianId);
  }
  
  const queryKey = FINANCIAL_KEYS.list(mutableRequest);
  
  const result = useQuery<QueryFinancialsResponse[], Error>({
    queryKey,
    queryFn: async ({ signal }) => {
      console.log('queryFn executing with request:', mutableRequest);
      try {
        if (!mutableRequest.dieticianId) {
          const errorMsg = 'DieticianId is required but not available';
          console.error(errorMsg);
          throw new Error(errorMsg);
        }
        
        const response = await financialService.queryFinancials(mutableRequest);
        console.log('Financial service returned data:', response.length, 'items');
        return response;
      } catch (error) {
        console.error('Error in queryFinancials:', error);
        toast({
          title: t('financial.fetchError'),
          description: error instanceof Error 
            ? error.message 
            : t('common.errorOccurred'),
          variant: 'destructive',
        });
        throw error;
      }
    },
    staleTime: DEFAULT_STALE_TIME,  // 5 minute stale time to reduce refetches
    refetchOnMount: false,           // Don't refetch automatically on mount
    refetchOnWindowFocus: false,     // Don't refetch on window focus
    retry: 1,                        // Retry once on failure
    ...options
  });
  
  // Log query status
  useEffect(() => {
    logQueryStatus(result.isFetching, result.isStale, queryKey);
  }, [result.isFetching, result.isStale, queryKey]);
  
  return result;
};

// Get financial overview data
export const useGetFinancialOverview = (
  request: GetFinancialOverviewInitRequest = {},
  options?: Omit<UseQueryOptions<GetFinancialOverviewInitResponse, Error>, 'queryKey' | 'queryFn'>
) => {
  console.log('useGetFinancialOverview hook called with request:', request);
  const { toast } = useToast();
  const { t } = useTranslation();
  
  // Create a mutable copy of the request to avoid modifying the original
  const mutableRequest = { ...request };
  
  // Check if dieticianId is missing and try to get it from auth store
  if (!mutableRequest.dieticianId) {
    const user = useAuthStore.getState().user;
    if (user?.dieticianId) {
      mutableRequest.dieticianId = user.dieticianId;
      console.log('Added dieticianId to overview request from user profile:', user.dieticianId);
    } else if (user?.id && user.roles?.includes('Dietician')) {
      mutableRequest.dieticianId = Number(user.id);
      console.log('Using user ID as dieticianId fallback for overview:', user.id);
    } else {
      console.warn('No dieticianId available for financial overview request!');
    }
  } else {
    console.log('Using provided dieticianId for overview request:', mutableRequest.dieticianId);
  }
  
  const queryKey = FINANCIAL_KEYS.overview(mutableRequest);
  
  const result = useQuery<GetFinancialOverviewInitResponse, Error>({
    queryKey,
    queryFn: async ({ signal }) => {
      console.log('Financial overview queryFn executing with request:', mutableRequest);
      try {
        if (!mutableRequest.dieticianId) {
          const errorMsg = 'DieticianId is required for financial overview but not available';
          console.error(errorMsg);
          throw new Error(errorMsg);
        }
        
        const response = await financialService.getFinancialOverview(mutableRequest);
        console.log('Financial overview service returned data with intervals:', 
          Object.keys(response.intervals || {}).length);
        return response;
      } catch (error) {
        console.error('Error in getFinancialOverview:', error);
        toast({
          title: t('financial.fetchError'),
          description: error instanceof Error 
            ? error.message 
            : t('common.errorOccurred'),
          variant: 'destructive',
        });
        throw error;
      }
    },
    staleTime: DEFAULT_STALE_TIME,  // 5 minute stale time to reduce refetches
    refetchOnMount: false,           // Don't refetch automatically on mount
    refetchOnWindowFocus: false,     // Don't refetch on window focus 
    retry: 1,                        // Retry once on failure
    ...options
  });
  
  // Log query status
  useEffect(() => {
    logQueryStatus(result.isFetching, result.isStale, queryKey);
  }, [result.isFetching, result.isStale, queryKey]);
  
  return result;
};

// Get a single financial by ID
export const useGetFinancial = (id: number) => {
  return useQuery({
    queryKey: FINANCIAL_KEYS.detail(id),
    queryFn: () => financialService.getFinancial(id),
    enabled: !!id,
    staleTime: DEFAULT_STALE_TIME,
    refetchOnWindowFocus: false
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
      // More targeted invalidation
      queryClient.invalidateQueries({ queryKey: FINANCIAL_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: FINANCIAL_KEYS.overview() });
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
    mutationFn: (request: UpdateFinancialRequest) => 
      financialService.updateFinancial(request),
    onSuccess: (_, { id }) => {
      // Precise invalidation to avoid unnecessary refetches
      queryClient.invalidateQueries({ queryKey: FINANCIAL_KEYS.detail(id) });
      
      // Since this affects aggregates, invalidate related lists and overview
      queryClient.invalidateQueries({ queryKey: FINANCIAL_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: FINANCIAL_KEYS.overview() });
      
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
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: FINANCIAL_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: FINANCIAL_KEYS.overview() });
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