import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  EditIcon, 
  TrashIcon,
  AlertTriangle
} from 'lucide-react';
import { 
  Financial, 
  FinancialType, 
  FinancialStatus, 
  QueryFinancialsRequest 
} from '@/types/financial';
import { FinancialDialog } from './FinancialDialog';
import { formatCurrency } from '@/lib/utils/format';
import { useFinancialStore } from '@/stores/financial-store';
import FinancialDeleteDialog from './FinancialDeleteDialog';
import { useAuthStore } from '@/stores/auth-store';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { DataTable, DataTableColumn, DataTableFilterOption } from '@/components/ui/data-table';
import { User } from '@/types/common';
import { useGetFinancials } from '@/hooks/useFinancials';

interface FinancialListProps {
  onAddClick?: () => void;
}

export const FinancialListRefactored: React.FC<FinancialListProps> = () => {
  const { t } = useTranslation();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [financials, setFinancials] = useState<Financial[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  // Use financial store for state management
  const {
    filters,
    setFilters,
    resetFilters,
    selectedFinancial,
    setSelectedFinancial,
    setDeleteModalOpen
  } = useFinancialStore();

  // Get user info from auth store
  const user = useAuthStore.getState().user as User | null;

  // Helper function to get dieticianId with fallback
  const getDieticianId = () => {
    if (user?.dieticianId) {
      return user.dieticianId;
    }
    
    if (user?.id && user.roles?.includes('Dietician')) {
      const fallbackId = Number(user.id);
      return fallbackId;
    }
    
    // Development fallback
    if (process.env.NODE_ENV === 'development') {
      return 1;
    }
    
    return undefined;
  };

  // Check if we have a dieticianId
  useEffect(() => {
    const availableDieticianId = getDieticianId();
    
    if (!availableDieticianId) {
      setErrorMessage('DieticianId is not available. Please check your profile settings.');
    } else {
      setErrorMessage(null);
    }
    
    // Set dieticianId in filters if not already set
    if (availableDieticianId && !filters.dieticianId) {
      setFilters({ dieticianId: availableDieticianId });
    }
  }, [user, filters, setFilters]);

  // Create a stable query object to prevent unnecessary rerenders
  const queryParams = useMemo(() => {
    // Get current user from auth store if needed
    const dieticianId = filters.dieticianId || (user?.dieticianId ? user.dieticianId : undefined);
    
    if (!dieticianId) {
      setErrorMessage('DieticianId is required but not available');
    } else {
      setErrorMessage(null);
    }
    
    return {
      ...filters,
      dieticianId, // Explicitly include dieticianId
      pageNumber: currentPage,
      pageSize: pageSize
    };
  }, [filters, currentPage, pageSize, user]);

  // Fetch financials with current filters
  const { data, isLoading, error, refetch } = useGetFinancials(queryParams, {
    staleTime: 30000, // 30 seconds
    refetchOnWindowFocus: false,
    retry: 3
  });

  // Handle errors from API calls
  useEffect(() => {
    if (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Failed to load financial data');
    }
  }, [error]);

  // Initial data load when component mounts
  useEffect(() => {
    // Ensure we have a dieticianId before making the request
    if (queryParams.dieticianId) {
      refetch();
    }
  }, []);

  useEffect(() => {
    // When data changes, update our local state
    if (data) {
      setFinancials(data);
      setTotalItems(data.length);
    }
  }, [data]);

  // Only refetch when filters, page or page size actually change
  // This uses a memorized query params object to prevent unnecessary refetches
  useEffect(() => {
    if (queryParams.dieticianId) {
      refetch();
    }
  }, [queryParams, refetch]);

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Handle page size change
  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1); // Reset to first page when changing page size
  };

  const handleFilterChange = (field: keyof QueryFinancialsRequest, value: unknown) => {
    const newFilters = { ...filters };
    
    if (value === 'all' || !value) {
      delete newFilters[field];
    } else {
      (newFilters as Record<string, unknown>)[field] = value;
    }
    
    if (!newFilters.dieticianId) {
      newFilters.dieticianId = user?.dieticianId;
    }
    
    setFilters(newFilters);
    setCurrentPage(1);
  };

  // Apply filters with debounce to prevent rapid-fire API calls
  const applyFilters = () => {
    refetch();
  };

  // Handle edit click
  const handleEditClick = (financial: Financial) => {
    setSelectedFinancial(financial);
    setIsDialogOpen(true);
  };

  // Handle delete click
  const handleDeleteClick = (financial: Financial) => {
    setSelectedFinancial(financial);
    setDeleteModalOpen(true);
  };

  // Handle dialog close
  const handleDialogOpenChange = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      setSelectedFinancial(null);
    }
  };

  // Handle transaction success
  const handleTransactionSuccess = () => {
    refetch();
    setIsDialogOpen(false);
    setSelectedFinancial(null);
  };

  // Get badge color for status
  const getStatusBadgeColor = (status: FinancialStatus) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-500';
      case 'Pending':
        return 'bg-yellow-500';
      case 'Cancelled':
        return 'bg-red-500';
      case 'Refunded':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  // Get badge color for type
  const getTypeBadgeColor = (type: FinancialType) => {
    switch (type) {
      case 'Income':
        return 'bg-green-500';
      case 'Expense':
        return 'bg-red-500';
      case 'Consultation':
        return 'bg-purple-500';
      case 'Appointment':
        return 'bg-blue-500';
      case 'Other':
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  };

  // Get text for status
  const getStatusText = (status: FinancialStatus) => {
    switch (status) {
      case 'Pending':
        return t('financial.status.pending');
      case 'Completed':
        return t('financial.status.completed');
      case 'Cancelled':
        return t('financial.status.cancelled');
      case 'Refunded':
        return t('financial.status.refunded');
      default:
        return t('financial.unknown');
    }
  };

  // Get text for type
  const getTypeText = (type: FinancialType) => {
    switch (type) {
      case 'Income':
        return t('financial.type.income');
      case 'Expense':
        return t('financial.type.expense');
      case 'Consultation':
        return t('financial.type.consultation');
      case 'Appointment':
        return t('financial.type.appointment');
      case 'Other':
        return t('financial.type.other');
      default:
        return t('financial.unknown');
    }
  };

  // Define columns for the DataTable
  const columns: DataTableColumn<Financial>[] = [
    {
      key: 'date',
      title: t('financial.date'),
      sortable: true,
      render: (financial) => format(new Date(financial.date), 'dd/MM/yyyy')
    },
    {
      key: 'description',
      title: t('financial.description'),
      sortable: true,
      render: (financial) => (
        <div className="max-w-[200px] truncate">
          {financial.description}
        </div>
      )
    },
    {
      key: 'type',
      title: t('financial.form.type'),
      sortable: true,
      render: (financial) => (
        <Badge className={getTypeBadgeColor(financial.type)}>
          {getTypeText(financial.type)}
        </Badge>
      )
    },
    {
      key: 'status',
      title: t('financial.form.status'),
      sortable: true,
      render: (financial) => (
        <Badge className={getStatusBadgeColor(financial.status)}>
          {getStatusText(financial.status)}
        </Badge>
      )
    },
    {
      key: 'amount',
      title: t('financial.amount'),
      sortable: true,
      align: 'right',
      render: (financial) => (
        <span className={financial.type === 'Income' ? 'text-green-600' : 'text-red-600'}>
          {formatCurrency(financial.amount)}
        </span>
      )
    }
  ];

  // ✅ Filter Options (Rehberinizden: String literals kullan)
  const filterOptions: DataTableFilterOption[] = [
    {
      key: 'type',
      label: t('financial.filters.type'),
      type: 'select',
      options: [
        { value: 'Income', label: 'Income' },
        { value: 'Expense', label: 'Expense' },
        { value: 'Consultation', label: 'Consultation' },
        { value: 'Appointment', label: 'Appointment' },
        { value: 'Other', label: 'Other' },
      ]
    },
    {
      key: 'status',
      label: t('financial.filters.status'),
      type: 'select',
      options: [
        { value: 'Pending', label: 'Pending' },
        { value: 'Completed', label: 'Completed' },
        { value: 'Failed', label: 'Failed' },
        { value: 'Refunded', label: 'Refunded' },
        { value: 'Cancelled', label: 'Cancelled' },
      ]
    }
  ];

  // Handle row click
  const handleRowClick = (item: Record<string, unknown>) => {
    const financial = item as unknown as Financial;
    handleEditClick(financial);
  };

  // Handle search
  const handleSearchChange = (value: string) => {
    handleFilterChange('description', value);
  };

  // Handle filter changes
  const handleDataTableFilterChange = (newFilters: Record<string, unknown>) => {
    Object.entries(newFilters).forEach(([key, value]) => {
      handleFilterChange(key as keyof QueryFinancialsRequest, value);
    });
  };

  return (
    <div className="space-y-4">
      {errorMessage && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>{t('common.error')}</AlertTitle>
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}
      
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Button onClick={applyFilters}>
            {t('financial.filters.apply')}
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={resetFilters}
          >
            {t('financial.filters.reset')}
          </Button>
        </div>
      </div>

      {/* Refactored DataTable */}
      <DataTable
        data={financials as unknown as Record<string, unknown>[]}
        columns={columns as unknown as DataTableColumn<Record<string, unknown>>[]}
        loading={isLoading}
        error={error}
        onRowClick={handleRowClick}
        keyExtractor={(financial) => (financial as unknown as Financial).id}
        
        // Search
        searchable={true}
        searchPlaceholder={t('financial.filters.description')}
        searchValue={filters.description || ''}
        onSearchChange={handleSearchChange}
        
        // Filtering
        filterable={true}
        filterOptions={filterOptions}
        activeFilters={{
          type: filters.type || '',
          status: filters.status || ''
        }}
        onFilterChange={handleDataTableFilterChange}
        onResetFilters={resetFilters}
        
        // Sorting
        sortable={true}
        
        // Pagination
        pagination={{
          currentPage,
          pageSize,
          totalItems,
          onPageChange: handlePageChange,
          onPageSizeChange: handlePageSizeChange,
          pageSizeOptions: [5, 10, 25, 50],
          showPageSizeSelector: true
        }}
        
        // Actions
        actions={{
          label: t('common.actions'),
          render: (item) => {
            const financial = item as unknown as Financial;
            return (
              <div className="flex justify-end space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditClick(financial);
                  }}
                >
                  <EditIcon className="h-4 w-4" />
                  <span className="sr-only">{t('financial.editTransaction')}</span>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteClick(financial);
                  }}
                >
                  <TrashIcon className="h-4 w-4" />
                  <span className="sr-only">{t('financial.deleteTransaction')}</span>
                </Button>
              </div>
            );
          }
        }}
        
        // Layout
        className="w-full"
        emptyMessage={t('financial.noTransactions')}
      />

      {/* Edit/Create Dialog */}
      <FinancialDialog
        open={isDialogOpen}
        onOpenChange={handleDialogOpenChange}
        financial={selectedFinancial}
        onSuccess={handleTransactionSuccess}
      />
      
      {/* Delete Dialog */}
      <FinancialDeleteDialog />
    </div>
  );
};
