import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { financialService } from '@/services/financial-service';
import {
  CreateFinancialRequest,
  Financial,
  QueryFinancialsRequest,
  UpdateFinancialRequest,
  GetFinancialOverviewInitRequest,
  GetFinancialOverviewInitResponse,
  QueryFinancialsResponse
} from '@/types/financial';
import { useToast } from './use-toast';

// ✅ Basit Interface (Rehberinizden: Karmaşık yapma)
interface PaginatedResponse<T> {
  items: T[];
  totalCount: number;
}

export const useFinancials = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [financials, setFinancials] = useState<Financial[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const { toast } = useToast();
  const { t } = useTranslation();

  const fetchFinancials = async (request: QueryFinancialsRequest) => {
    setIsLoading(true);
    try {
      const response = await financialService.getFinancials(request);
      
      // Handle both array responses and paginated responses
      if (Array.isArray(response)) {
        setFinancials(response);
        setTotalCount(response.length);
      } else if (response && typeof response === 'object' && 'items' in response) {
        const paginatedResponse = response as PaginatedResponse<Financial>;
        setFinancials(paginatedResponse.items);
        setTotalCount(paginatedResponse.totalCount);
      }
      
      return response;
    } catch (error) {
      toast({
        title: t('financial.fetchError'),
        description: t('common.errorOccurred'),
        variant: 'destructive',
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    financials,
    totalCount,
    isLoading,
    fetchFinancials,
  };
};

export const useFinancialOverview = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [overview, setOverview] = useState<GetFinancialOverviewInitResponse | null>(null);
  const { toast } = useToast();
  const { t } = useTranslation();

  const fetchOverview = async (request: GetFinancialOverviewInitRequest = {}) => {
    setIsLoading(true);
    try {
      const response = await financialService.getFinancialOverview(request);
      setOverview(response.data);
      return response.data;
    } catch (error) {
      toast({
        title: t('financial.fetchOverviewError'),
        description: t('common.errorOccurred'),
        variant: 'destructive',
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    overview,
    isLoading,
    fetchOverview,
  };
};

export const useFinancial = (id?: number) => {
  const [isLoading, setIsLoading] = useState(false);
  const [financial, setFinancial] = useState<Financial | null>(null);
  const { toast } = useToast();
  const { t } = useTranslation();

  const fetchFinancial = async (financialId: number) => {
    setIsLoading(true);
    try {
      const response = await financialService.getFinancial(financialId);
      setFinancial(response.data);
      return response.data;
    } catch (error) {
      toast({
        title: t('financial.fetchError'),
        description: t('common.errorOccurred'),
        variant: 'destructive',
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const createFinancial = async (data: CreateFinancialRequest) => {
    setIsLoading(true);
    try {
      const response = await financialService.createFinancial(data);
      toast({
        title: t('financial.createSuccess'),
        description: t('financial.recordCreated'),
      });
      return response;
    } catch (error) {
      toast({
        title: t('financial.createError'),
        description: t('common.errorOccurred'),
        variant: 'destructive',
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const updateFinancial = async (id: number, data: UpdateFinancialRequest) => {
    setIsLoading(true);
    try {
      await financialService.updateFinancial(id, data);
      toast({
        title: t('financial.updateSuccess'),
        description: t('financial.recordUpdated'),
      });
      return true;
    } catch (error) {
      toast({
        title: t('financial.updateError'),
        description: t('common.errorOccurred'),
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteFinancial = async (financialId: number) => {
    setIsLoading(true);
    try {
      await financialService.deleteFinancial(financialId);
      toast({
        title: t('financial.deleteSuccess'),
        description: t('financial.recordDeleted'),
      });
      return true;
    } catch (error) {
      toast({
        title: t('financial.deleteError'),
        description: t('common.errorOccurred'),
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // If an ID is provided, fetch the financial record
  useEffect(() => {
    if (id) {
      fetchFinancial(id);
    }
  }, [id]);

  return {
    financial,
    isLoading,
    fetchFinancial,
    createFinancial,
    updateFinancial,
    deleteFinancial,
  };
}; 