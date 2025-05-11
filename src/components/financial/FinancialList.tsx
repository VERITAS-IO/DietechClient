import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePicker } from '@/components/ui/date-picker';
import { 
  FilterIcon, 
  EditIcon, 
  TrashIcon, 
  XIcon,
  AlertTriangle
} from 'lucide-react';
import { 
  Financial, 
  FinancialType, 
  FinancialStatus, 
  QueryFinancialsRequest 
} from '@/types/financial';
import { useGetFinancials, useDeleteFinancial } from '@/hooks/useFinancials';
import { FinancialDialog } from './FinancialDialog';
import { formatCurrency } from '@/lib/utils/format';
import { useFinancialStore } from '@/stores/financial-store';
import FinancialDeleteDialog from './FinancialDeleteDialog';
import { useAuthStore } from '@/stores/auth-store';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface FinancialListProps {
  onAddClick?: () => void;
}

export const FinancialList: React.FC<FinancialListProps> = ({ onAddClick }) => {
  const { t } = useTranslation();
  const [showFilters, setShowFilters] = useState(false);
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
    isDeleteModalOpen,
    setDeleteModalOpen
  } = useFinancialStore();

  // Get user info from auth store
  const user = useAuthStore.getState().user;

  // Helper function to get dieticianId with fallback
  const getDieticianId = () => {
    if (user?.dieticianId) {
      console.log('FinancialList - Using dieticianId from user profile:', user.dieticianId);
      return user.dieticianId;
    }
    
    if (user?.id && user.roles?.includes('Dietician')) {
      const fallbackId = Number(user.id);
      console.log('FinancialList - Using user ID as fallback dieticianId:', fallbackId);
      return fallbackId;
    }
    
    // Development fallback
    if (process.env.NODE_ENV === 'development') {
      console.warn('FinancialList - Using development fallback dieticianId (1)');
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
      console.log('FinancialList - Using dieticianId:', availableDieticianId);
      setErrorMessage(null);
    }
    
    // Set dieticianId in filters if not already set
    if (availableDieticianId && !filters.dieticianId) {
      setFilters({ dieticianId: availableDieticianId });
    }
  }, [user, filters, setFilters]);

  console.log('FinancialList - current filters:', filters);

  // Create a stable query object to prevent unnecessary rerenders
  const queryParams = useMemo(() => {
    // Get current user from auth store if needed
    const dieticianId = filters.dieticianId || (user?.dieticianId ? user.dieticianId : undefined);
    
    if (!dieticianId) {
      console.error('FinancialList - No dieticianId available for request');
      setErrorMessage('DieticianId is required but not available');
    } else {
      console.log('FinancialList - Using dieticianId:', dieticianId);
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
      console.error('Error fetching financials:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Failed to load financial data');
    }
  }, [error]);

  console.log('FinancialList - useGetFinancials result:', { data, isLoading, error });

  // Initial data load when component mounts
  useEffect(() => {
    console.log('FinancialList - Component mounted, loading data');
    // Ensure we have a dieticianId before making the request
    if (queryParams.dieticianId) {
      refetch();
    }
  }, []);

  useEffect(() => {
    // When data changes, update our local state
    if (data) {
      console.log('FinancialList - received data, updating state:', data);
      setFinancials(data);
      setTotalItems(data.length);
    }
  }, [data]);

  // Only refetch when filters, page or page size actually change
  // This uses a memorized query params object to prevent unnecessary refetches
  useEffect(() => {
    console.log('FinancialList - query params changed, refetching data');
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

  // Handle filter changes
  const handleFilterChange = (field: keyof QueryFinancialsRequest, value: any) => {
    const newFilters = { ...filters };
    
    // Remove the field from filters if 'all' is selected or value is empty
    if (value === 'all' || !value) {
      delete newFilters[field];
    } else {
      newFilters[field] = value;
    }
    
    // Make sure we keep dieticianId
    if (!newFilters.dieticianId) {
      newFilters.dieticianId = user?.dieticianId;
    }
    
    // Update filters and reset to first page
    setFilters(newFilters);
    setCurrentPage(1);
  };

  // Apply filters with debounce to prevent rapid-fire API calls
  const applyFilters = () => {
    console.log('Applying filters manually');
    refetch();
  };

  const deleteFinancialMutation = useDeleteFinancial();

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
      case FinancialStatus.Completed:
        return 'bg-green-500';
      case FinancialStatus.Pending:
        return 'bg-yellow-500';
      case FinancialStatus.Cancelled:
        return 'bg-red-500';
      case FinancialStatus.Refunded:
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  // Get badge color for type
  const getTypeBadgeColor = (type: FinancialType) => {
    switch (type) {
      case FinancialType.Income:
        return 'bg-green-500';
      case FinancialType.Expense:
        return 'bg-red-500';
      case FinancialType.Consultation:
        return 'bg-purple-500';
      case FinancialType.Appointment:
        return 'bg-blue-500';
      case FinancialType.Other:
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  };

  // Get text for status
  const getStatusText = (status: FinancialStatus) => {
    switch (status) {
      case FinancialStatus.Pending:
        return t('financial.status.pending');
      case FinancialStatus.Completed:
        return t('financial.status.completed');
      case FinancialStatus.Cancelled:
        return t('financial.status.cancelled');
      case FinancialStatus.Refunded:
        return t('financial.status.refunded');
      default:
        return t('financial.unknown');
    }
  };

  // Get text for type
  const getTypeText = (type: FinancialType) => {
    switch (type) {
      case FinancialType.Income:
        return t('financial.type.income');
      case FinancialType.Expense:
        return t('financial.type.expense');
      case FinancialType.Consultation:
        return t('financial.type.consultation');
      case FinancialType.Appointment:
        return t('financial.type.appointment');
      case FinancialType.Other:
        return t('financial.type.other');
      default:
        return t('financial.unknown');
    }
  };

  // Calculate pagination
  const totalPages = Math.ceil(totalItems / pageSize);
  const hasNextPage = currentPage < totalPages;
  const hasPreviousPage = currentPage > 1;

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
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setShowFilters(!showFilters)}
          >
            <FilterIcon className="h-4 w-4 mr-2" />
            {t('financial.filters.title')}
          </Button>
          {showFilters && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={resetFilters}
            >
              <XIcon className="h-4 w-4 mr-2" />
              {t('financial.filters.reset')}
            </Button>
          )}
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{t('financial.filters.title')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Description filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {t('financial.filters.description')}
                </label>
                <div className="flex">
                  <Input
                    placeholder={t('financial.filters.description')}
                    value={filters.description || ''}
                    onChange={(e) => handleFilterChange('description', e.target.value)}
                    className="w-full"
                  />
                </div>
              </div>

              {/* Type filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {t('financial.filters.type')}
                </label>
                <Select
                  defaultValue="all"
                  value={filters.type || 'all'}
                  onValueChange={(value) => {
                    handleFilterChange('type', value);
                  }}
                >
                  <SelectTrigger className="w-full bg-background">
                    <SelectValue>
                      {filters.type ? getTypeText(filters.type as FinancialType) : t('common.all')}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">
                      {t('common.all')}
                    </SelectItem>
                    {Object.values(FinancialType).filter(t => t !== FinancialType.Unknown).map((type) => (
                      <SelectItem key={type} value={type}>
                        {getTypeText(type)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Status filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {t('financial.filters.status')}
                </label>
                <Select
                  defaultValue="all"
                  value={filters.status || 'all'}
                  onValueChange={(value) => {
                    handleFilterChange('status', value);
                  }}
                >
                  <SelectTrigger className="w-full bg-background">
                    <SelectValue>
                      {filters.status ? getStatusText(filters.status as FinancialStatus) : t('common.all')}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">
                      {t('common.all')}
                    </SelectItem>
                    {Object.values(FinancialStatus).filter(s => s !== FinancialStatus.Unknown).map((status) => (
                      <SelectItem key={status} value={status}>
                        {getStatusText(status)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Date range filter */}
              <div className="space-y-2 col-span-1 md:col-span-2 lg:col-span-4">
                <label className="text-sm font-medium">
                  {t('financial.filters.dateRange')}
                </label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="flex-1">
                    <DatePicker
                      placeholder={t('financial.filters.startDate')}
                      value={filters.startDate ? new Date(filters.startDate) : undefined}
                      onChange={(date) => handleFilterChange('startDate', date ? format(date, 'yyyy-MM-dd') : undefined)}
                    />
                  </div>
                  <div className="flex-1">
                    <DatePicker
                      placeholder={t('financial.filters.endDate')}
                      value={filters.endDate ? new Date(filters.endDate) : undefined}
                      onChange={(date) => handleFilterChange('endDate', date ? format(date, 'yyyy-MM-dd') : undefined)}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <Button onClick={applyFilters}>
                {t('financial.filters.apply')}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Transactions table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('financial.date')}</TableHead>
              <TableHead>{t('financial.description')}</TableHead>
              <TableHead>{t('financial.form.type')}</TableHead>
              <TableHead>{t('financial.form.status')}</TableHead>
              <TableHead className="text-right">{t('financial.amount')}</TableHead>
              <TableHead className="text-right">{t('common.actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  <div className="flex justify-center items-center h-full">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                  </div>
                </TableCell>
              </TableRow>
            ) : financials && financials.length > 0 ? (
              financials.map((financial) => (
                <TableRow key={financial.id}>
                  <TableCell>
                    {format(new Date(financial.date), 'dd/MM/yyyy')}
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate">
                    {financial.description}
                  </TableCell>
                  <TableCell>
                    <Badge className={getTypeBadgeColor(financial.type)}>
                      {getTypeText(financial.type)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusBadgeColor(financial.status)}>
                      {getStatusText(financial.status)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    <span className={financial.type === FinancialType.Income ? 'text-green-600' : 'text-red-600'}>
                      {formatCurrency(financial.amount)}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditClick(financial)}
                      >
                        <EditIcon className="h-4 w-4" />
                        <span className="sr-only">{t('financial.editTransaction')}</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteClick(financial)}
                      >
                        <TrashIcon className="h-4 w-4" />
                        <span className="sr-only">{t('financial.deleteTransaction')}</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  {t('financial.noTransactions')}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {financials && financials.length > 0 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            {t('common.showing')} {(currentPage - 1) * pageSize + 1} - {Math.min(currentPage * pageSize, totalItems)} {t('common.of')} {totalItems}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={!hasPreviousPage}
            >
              {t('common.previous')}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={!hasNextPage}
            >
              {t('common.next')}
            </Button>
            <Select
              value={pageSize.toString()}
              onValueChange={(value) => handlePageSizeChange(parseInt(value))}
            >
              <SelectTrigger className="w-[100px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[5, 10, 25, 50].map((size) => (
                  <SelectItem key={size} value={size.toString()}>
                    {size} {t('common.perPage')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

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