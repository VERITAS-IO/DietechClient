import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';
import { FinancialOverview } from '@/components/financial/FinancialOverview';
import { FinancialList } from '@/components/financial/FinancialList';
import { FinancialDialog } from '@/components/financial/FinancialDialog';
import { useGetFinancialOverview, useGetFinancials } from '@/hooks/useFinancials';
import { useFinancialStore } from '@/stores/financial-store';
import { useAuthStore } from '@/stores/auth-store';
import { FinancialInterval } from '@/types/financial';

export const FinancialPage: React.FC = () => {
  const { t } = useTranslation();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [initialLoadDone, setInitialLoadDone] = useState(false);
  const initialFetchRef = useRef<{overview: boolean, transactions: boolean}>({
    overview: false,
    transactions: false
  });
  
  const user = useAuthStore.getState().user;
  const isAuthenticated = useAuthStore.getState().isAuthenticated;
  
  const activeTab = useFinancialStore(state => state.activeTab);
  const setActiveTab = useFinancialStore(state => state.setActiveTab);
  const filters = useFinancialStore(state => state.filters);
  const setFilters = useFinancialStore(state => state.setFilters);
  const selectedInterval = useFinancialStore(state => state.selectedInterval);
  const setSelectedInterval = useFinancialStore(state => state.setSelectedInterval);

  // Get dieticianId deterministically
  const getDieticianId = () => {
    // Check if user exists
    if (!user) {
      return undefined;
    }

    // If dieticianId exists, use it
    if (user.dieticianId) {
      return user.dieticianId;
    }
    
    // If user has Dietician role, use their ID as fallback
    if (user.id && user.roles && user.roles.includes('Dietician')) {
      const fallbackId = Number(user.id);
      return fallbackId;
    }
    
    // Final fallback - just use an arbitrary ID if we need to (in development only)
    if (process.env.NODE_ENV === 'development') {
      return 1; // Use a default ID in development
    }
    
    return undefined;
  };
  
  // Create a fallback dieticianId to guarantee we have one
  const ensureDieticianId = () => {
    const id = getDieticianId();
    if (id) return id;
    
    // Last resort - use 1 as a fallback ID in development
    if (process.env.NODE_ENV === 'development') {
      return 1;
    }
    
    return undefined;
  };
  
  const dieticianId = ensureDieticianId();

  // Ensure dieticianId is set in filters when component mounts
  useEffect(() => {
    if (dieticianId && !initialLoadDone) {
      setFilters({ dieticianId });
      setInitialLoadDone(true);
    }
  }, [dieticianId, initialLoadDone, setFilters]);

  // Make sure dieticianId is set whenever user or filters change
  useEffect(() => {
    if (dieticianId && (!filters.dieticianId || filters.dieticianId !== dieticianId)) {
      setFilters({ dieticianId });
    }
  }, [dieticianId, filters, setFilters]);

  // Handler for interval changes
  const handleIntervalChange = useCallback((interval: FinancialInterval) => {
    setSelectedInterval(interval);
    // No need to manually refetch here - React Query will handle it based on query key changes
  }, [setSelectedInterval]);

  // Use explicitly passed dieticianId and interval for the overview
  const { 
    data: overviewData, 
    isLoading: isLoadingOverview, 
    refetch: refetchOverview,
    error: overviewError
  } = useGetFinancialOverview({
    dieticianId,
    interval: selectedInterval
  }, {
    enabled: activeTab === 'overview' && !!dieticianId,
    staleTime: 5 * 60 * 1000, // 5 minutes stale time to reduce refetches
    refetchOnWindowFocus: false, // Disable refetch on window focus
  });
  
  // Log any errors with the overview
  useEffect(() => {
    if (overviewError) {
    }
  }, [overviewError]);
  
  const {
    data: transactionsData,
    isLoading: isLoadingTransactions,
    refetch: refetchTransactions,
    error: transactionsError
  } = useGetFinancials({
    ...filters,
    dieticianId: dieticianId, // Always use the deterministic dieticianId
    pageNumber: 1,
    pageSize: 10
  }, {
    enabled: activeTab === 'transactions' && !!dieticianId,
    staleTime: 60000, // 1 minute stale time
    refetchOnWindowFocus: false, // Disable refetch on window focus
  });
  
  // Log any errors with transactions
  useEffect(() => {
    if (transactionsError) {
    }
  }, [transactionsError]);
  
  // Single useEffect for handling tab changes and initial data loading
  useEffect(() => {
    if (!dieticianId) {
      return;
    }
    
    // Check if this is an initial load for this tab
    const isInitialForTab = !initialFetchRef.current[activeTab as keyof typeof initialFetchRef.current];
    
    if (isInitialForTab) {
      initialFetchRef.current[activeTab as keyof typeof initialFetchRef.current] = true;
      
      if (activeTab === 'overview') {
        // Don't need to manually call refetch - React Query will handle it based on the enabled option
      } else if (activeTab === 'transactions') {
        // Don't need to manually call refetch - React Query will handle it based on the enabled option
      }
    } else {
    }
  }, [activeTab, dieticianId]);
  
  useEffect(() => {
    // Monitor data loading state
  }, [overviewData, isLoadingOverview, transactionsData, isLoadingTransactions, dieticianId, selectedInterval, activeTab]);

  const handleAddClick = () => {
    setIsCreateDialogOpen(true);
  };

  const handleDialogOpenChange = (open: boolean) => {
    setIsCreateDialogOpen(open);
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value as 'overview' | 'transactions');
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">{t('financial.title')}</h1>
        <Button onClick={handleAddClick}>
          <PlusIcon className="h-4 w-4 mr-2" />
          {t('financial.addTransaction')}
        </Button>
      </div>
      
      <Tabs 
        defaultValue={activeTab} 
        value={activeTab}
        onValueChange={handleTabChange}
        className="space-y-4"
      >
        <TabsList>
          <TabsTrigger value="overview">{t('financial.overview.title')}</TabsTrigger>
          <TabsTrigger value="transactions">{t('financial.transactions')}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="mt-6">
          {isLoadingOverview ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : overviewData ? (
            <FinancialOverview 
              overviewData={overviewData} 
              selectedInterval={selectedInterval}
              onIntervalChange={handleIntervalChange}
            />
          ) : (
            <div className="text-center py-10">
              <p>{t('financial.overview.noData')}</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="transactions" className="mt-6">
          <FinancialList onAddClick={handleAddClick} />
        </TabsContent>
      </Tabs>
      
      <FinancialDialog
        open={isCreateDialogOpen}
        onOpenChange={handleDialogOpenChange}
        onSuccess={() => {
          // Only invalidate data for the active tab
          if (activeTab === 'overview') {
            initialFetchRef.current.overview = false; // Force a refetch next time
            refetchOverview();
          } else {
            initialFetchRef.current.transactions = false; // Force a refetch next time
            refetchTransactions();
          }
        }}
      />
    </div>
  );
}; 