import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { CardDataGrid, CardColumn } from '@/components/ui/card-data-grid';
import { CardDataGridFilter, FilterOption } from '@/components/ui/card-data-grid-filter';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DollarSign, Calendar, Plus, AlignLeft, AlertTriangle } from 'lucide-react';
import { Financial, FinancialType, FinancialStatus } from '@/types/financial';
import { useFinancialStore } from '@/stores/financial-store';
import { useFinancials } from '@/hooks/financial-hooks';
import { FinancialDialog } from './FinancialDialog';
import FinancialDeleteDialog from './FinancialDeleteDialog';
import { formatCurrency } from '@/lib/utils/format';
import { useAuthStore } from '@/stores/auth-store';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function FinancialCardList() {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const [error, setError] = useState<string | null>(null);
  
  // Check if dieticianId is available
  useEffect(() => {
    if (!user?.dieticianId) {
      setError('DieticianId is not available in your profile. Please contact support.');
    } else {
      setError(null);
    }
  }, [user]);
  
  // Use financial store for state management
  const {
    filters,
    setFilters,
    resetFilters,
    selectedFinancial,
    setSelectedFinancial,
    isDetailModalOpen,
    setDetailModalOpen,
    isCreateModalOpen,
    setCreateModalOpen,
    isDeleteModalOpen,
    setDeleteModalOpen
  } = useFinancialStore();

  // Local state for active filters
  const [activeFilters, setActiveFilters] = useState<Record<string, any>>({
    search: filters.description || '',
    type: filters.type || 'all',
    status: filters.status || 'all',
    startDate: filters.startDate || '',
    endDate: filters.endDate || ''
  });

  // Ensure dieticianId is included in filters
  useEffect(() => {
    if (user?.dieticianId && !filters.dieticianId) {
      setFilters({
        ...filters,
        dieticianId: user.dieticianId
      });
    }
  }, [user, filters]);

  // Update local filter state when store filters change
  useEffect(() => {
    setActiveFilters({
      search: filters.description || '',
      type: filters.type || 'all',
      status: filters.status || 'all',
      startDate: filters.startDate || '',
      endDate: filters.endDate || ''
    });
  }, [filters]);

  // Get financials data
  const { financials, totalCount, isLoading, fetchFinancials } = useFinancials();

  // Fetch data when filters change
  useEffect(() => {
    if (user?.dieticianId) {
      try {
        fetchFinancials({
          ...filters,
          dieticianId: user.dieticianId
        });
      } catch (err) {
        console.error('Error fetching financials:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch financial data');
      }
    }
  }, [filters, user]);

  // Handle card click to show financial details
  const handleCardClick = (financial: Financial) => {
    setSelectedFinancial(financial);
    setDetailModalOpen(true);
  };

  // Handle filter changes
  const handleFilterChange = (newFilters: Record<string, any>) => {
    const updatedFilters = { ...filters };
    
    // Handle search
    if ('search' in newFilters) {
      updatedFilters.description = newFilters.search || undefined;
    }
    
    // Handle type filter
    if ('type' in newFilters) {
      updatedFilters.type = newFilters.type && newFilters.type !== 'all' 
        ? newFilters.type as FinancialType 
        : undefined;
    }
    
    // Handle status filter
    if ('status' in newFilters) {
      updatedFilters.status = newFilters.status && newFilters.status !== 'all' 
        ? newFilters.status as FinancialStatus 
        : undefined;
    }
    
    // Handle date range
    if ('startDate' in newFilters) {
      updatedFilters.startDate = newFilters.startDate || undefined;
    }
    
    if ('endDate' in newFilters) {
      updatedFilters.endDate = newFilters.endDate || undefined;
    }
    
    // Ensure dieticianId is always included
    updatedFilters.dieticianId = user?.dieticianId;
    
    // Update filters and reset to first page
    setFilters({ 
      ...updatedFilters,
      pageNumber: 1 
    });
  };

  // Reset all filters
  const handleResetFilters = () => {
    resetFilters();
    setActiveFilters({
      search: '',
      type: 'all',
      status: 'all',
      startDate: '',
      endDate: ''
    });
  };

  // Get Status badge 
  const getStatusBadge = (status: FinancialStatus) => {
    switch (status) {
      case FinancialStatus.Completed:
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">{t(`financial.status.${status.toLowerCase()}`)}</Badge>;
      case FinancialStatus.Pending:
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">{t(`financial.status.${status.toLowerCase()}`)}</Badge>;
      case FinancialStatus.Cancelled:
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-200">{t(`financial.status.${status.toLowerCase()}`)}</Badge>;
      case FinancialStatus.Refunded:
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">{t(`financial.status.${status.toLowerCase()}`)}</Badge>;
      default:
        return <Badge variant="secondary">{t('financial.unknown')}</Badge>;
    }
  };

  // Get Type badge
  const getTypeBadge = (type: FinancialType) => {
    switch (type) {
      case FinancialType.Income:
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">{t(`financial.type.${type.toLowerCase()}`)}</Badge>;
      case FinancialType.Expense:
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-200">{t(`financial.type.${type.toLowerCase()}`)}</Badge>;
      case FinancialType.Consultation:
        return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200">{t(`financial.type.${type.toLowerCase()}`)}</Badge>;
      case FinancialType.Appointment:
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">{t(`financial.type.${type.toLowerCase()}`)}</Badge>;
      case FinancialType.Other:
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200">{t(`financial.type.${type.toLowerCase()}`)}</Badge>;
      default:
        return <Badge variant="secondary">{t('financial.unknown')}</Badge>;
    }
  };

  // Define filter options
  const filterOptions: FilterOption[] = [
    {
      id: 'type',
      label: t('financial.filters.type'),
      type: 'select',
      options: Object.values(FinancialType).map(type => ({
        value: type,
        label: t(`financial.type.${type.toLowerCase()}`)
      })),
      placeholder: t('financial.filters.selectType')
    },
    {
      id: 'status',
      label: t('financial.filters.status'),
      type: 'select',
      options: Object.values(FinancialStatus).map(status => ({
        value: status,
        label: t(`financial.status.${status.toLowerCase()}`)
      })),
      placeholder: t('financial.filters.selectStatus')
    },
    {
      id: 'startDate',
      label: t('financial.filters.startDate'),
      type: 'text',
      placeholder: 'YYYY-MM-DD'
    },
    {
      id: 'endDate',
      label: t('financial.filters.endDate'),
      type: 'text',
      placeholder: 'YYYY-MM-DD'
    }
  ];

  // Define columns for the card data grid
  const columns: CardColumn<Financial>[] = [
    {
      key: 'description',
      title: t('financial.description'),
      primary: true,
      render: (item) => item.description || '-'
    },
    {
      key: 'amount',
      title: t('financial.amount'),
      secondary: true,
      render: (item) => (
        <div className={`font-medium ${item.type === FinancialType.Income ? 'text-green-600' : 'text-red-600'}`}>
          {item.type === FinancialType.Income ? '+' : '-'} {formatCurrency(item.amount)}
        </div>
      )
    },
    {
      key: 'type',
      title: t('financial.type'),
      header: true,
      render: (item) => getTypeBadge(item.type)
    },
    {
      key: 'status',
      title: t('financial.status'),
      header: true,
      render: (item) => getStatusBadge(item.status)
    },
    {
      key: 'date',
      title: t('financial.date'),
      render: (item) => (
        <div className="flex items-center">
          <Calendar className="mr-1 h-3.5 w-3.5 text-muted-foreground" />
          {format(new Date(item.date), 'dd/MM/yyyy')}
        </div>
      )
    },
    {
      key: 'clientName',
      title: t('financial.clientName'),
      render: (item) => item.clientName || (item.subject ? item.subject : '-')
    }
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">{t('financial.transactions')}</h2>
        <Button 
          onClick={() => setCreateModalOpen(true)}
          disabled={!user?.dieticianId}
        >
          <Plus className="h-4 w-4 mr-2" />
          {t('financial.addTransaction')}
        </Button>
      </div>
      
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>{t('common.error')}</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <CardDataGridFilter
        filterOptions={filterOptions}
        onFilterChange={handleFilterChange}
        onResetFilters={handleResetFilters}
        activeFilters={activeFilters}
        showFilterToggle={true}
        searchColumn="search"
      />
      
      <CardDataGrid
        data={financials}
        columns={columns}
        loading={isLoading}
        error={error ? new Error(error) : null}
        onCardClick={handleCardClick}
        pagination={{
          currentPage: filters.pageNumber || 1,
          pageSize: filters.pageSize || 10,
          totalItems: totalCount,
          onPageChange: (page) => setFilters({ ...filters, pageNumber: page }),
          onPageSizeChange: (size) => setFilters({ 
            ...filters,
            pageSize: size,
            pageNumber: 1
          }),
          pageSizeOptions: [5, 10, 25, 50],
          showPageSizeSelector: true
        }}
        layoutOptions={{
          grid: { xs: 1, sm: 1, md: 1, lg: 1 },
          cardSize: 'default',
          vertical: true
        }}
      />
      
      {isDetailModalOpen && <FinancialDialog open={isDetailModalOpen} onOpenChange={setDetailModalOpen} />}
      {isDeleteModalOpen && <FinancialDeleteDialog />}
      {isCreateModalOpen && <FinancialDialog open={isCreateModalOpen} onOpenChange={setCreateModalOpen} />}
    </div>
  );
} 