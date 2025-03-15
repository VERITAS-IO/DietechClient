import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { financialService } from '@/services/financial-service';
import {
  CreateFinancialRequest,
  Financial,
  QueryFinancialsRequest,
  UpdateFinancialRequest
} from '@/types/financial';
import { useToast } from './use-toast';

export const useFinancials = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [financials, setFinancials] = useState<Financial[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const { toast } = useToast();
  const { t } = useTranslation();

  const fetchFinancials = async (request: QueryFinancialsRequest) => {
    setIsLoading(true);
    try {
      const response = await financialService.queryFinancials(request);
      setFinancials(response.items);
      setTotalCount(response.totalCount);
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

export const useFinancial = (id?: number) => {
  const [isLoading, setIsLoading] = useState(false);
  const [financial, setFinancial] = useState<Financial | null>(null);
  const { toast } = useToast();
  const { t } = useTranslation();

  const fetchFinancial = async (financialId: number) => {
    setIsLoading(true);
    try {
      const response = await financialService.getFinancial(financialId);
      setFinancial(response);
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

  const updateFinancial = async (financialId: number, data: UpdateFinancialRequest) => {
    setIsLoading(true);
    try {
      await financialService.updateFinancial(financialId, data);
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