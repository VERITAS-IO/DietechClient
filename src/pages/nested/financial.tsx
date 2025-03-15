import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';
import { FinancialOverview } from '../../components/financial/FinancialOverview';
import { FinancialList } from '../../components/financial/FinancialList';
import { FinancialDialog } from '../../components/financial/FinancialDialog';
import { Financial } from '@/types/financial';
import { useGetFinancials } from '@/hooks/useFinancials';

export const FinancialPage: React.FC = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('overview');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [financials, setFinancials] = useState<Financial[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch all financials for the overview
  const { data, isLoading: isLoadingFinancials, refetch } = useGetFinancials({
    page: 1,
    pageSize: 1000, // Get all for the overview charts
  });

  useEffect(() => {
    if (data && !isLoadingFinancials) {
      setFinancials(data.items);
      setIsLoading(false);
    }
  }, [data, isLoadingFinancials]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const handleDialogOpenChange = (open: boolean) => {
    setIsDialogOpen(open);
  };

  const handleTransactionSuccess = () => {
    refetch();
    setIsDialogOpen(false);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">{t('financial.title')}</h1>
        <Button onClick={() => setIsDialogOpen(true)}>
          <PlusIcon className="mr-2 h-4 w-4" />
          {t('financial.addTransaction')}
        </Button>
      </div>

      <Tabs defaultValue="overview" value={activeTab} onValueChange={handleTabChange}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="overview">{t('financial.overview')}</TabsTrigger>
          <TabsTrigger value="transactions">{t('financial.transactions')}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="mt-6">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : (
            <FinancialOverview financials={financials} />
          )}
        </TabsContent>
        
        <TabsContent value="transactions" className="mt-6">
          <FinancialList onAddClick={() => setIsDialogOpen(true)} />
        </TabsContent>
      </Tabs>

      <FinancialDialog 
        open={isDialogOpen} 
        onOpenChange={handleDialogOpenChange} 
        onSuccess={handleTransactionSuccess}
      />
    </div>
  );
}; 