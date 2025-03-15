import React, { useState, useEffect } from 'react';
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
import { DataTablePagination } from '@/components/ui/data-table-pagination';
import { DatePicker } from '@/components/ui/date-picker';
import { 
  PlusIcon, 
  FilterIcon, 
  SearchIcon, 
  EditIcon, 
  TrashIcon, 
  XIcon 
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

interface FinancialListProps {
  onAddClick?: () => void;
}

export const FinancialList: React.FC<FinancialListProps> = ({ onAddClick }) => {
  const { t } = useTranslation();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedFinancial, setSelectedFinancial] = useState<Financial | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Filter state
  const [filters, setFilters] = useState<QueryFinancialsRequest>({
    page: currentPage,
    pageSize: pageSize,
    description: '',
    type: undefined,
    status: undefined,
    startDate: undefined,
    endDate: undefined,
  });

  // Fetch financials with current filters
  const { data, isLoading, refetch } = useGetFinancials(filters);
  const deleteFinancial = useDeleteFinancial();

  // Update filters when pagination changes
  useEffect(() => {
    setFilters(prev => ({
      ...prev,
      page: currentPage,
      pageSize: pageSize,
    }));
  }, [currentPage, pageSize]);

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
  const handleFilterChange = (key: keyof QueryFinancialsRequest, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  // Apply filters
  const applyFilters = () => {
    setCurrentPage(1); // Reset to first page when applying filters
    refetch();
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      page: 1,
      pageSize: pageSize,
      description: '',
      type: undefined,
      status: undefined,
      startDate: undefined,
      endDate: undefined,
    });
    setCurrentPage(1);
  };

  // Handle edit click
  const handleEditClick = (financial: Financial) => {
    setSelectedFinancial(financial);
    setIsDialogOpen(true);
  };

  // Handle delete click
  const handleDeleteClick = async (id: string) => {
    if (window.confirm(t('common.confirmDelete'))) {
      await deleteFinancial.mutateAsync(id);
    }
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
    return t(`financial.${status.toLowerCase()}`);
  };

  // Get text for type
  const getTypeText = (type: FinancialType) => {
    return t(`financial.${type.toLowerCase()}`);
  };

  return (
    <div className="space-y-4">
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
        <Button onClick={onAddClick || (() => setIsDialogOpen(true))}>
          <PlusIcon className="h-4 w-4 mr-2" />
          {t('financial.addTransaction')}
        </Button>
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
                    placeholder={t('financial.description')}
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
                  value={filters.type}
                  onValueChange={(value) => handleFilterChange('type', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('financial.type')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">
                      {t('common.all')}
                    </SelectItem>
                    {Object.values(FinancialType).map((type) => (
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
                  value={filters.status}
                  onValueChange={(value) => handleFilterChange('status', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('financial.status')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">
                      {t('common.all')}
                    </SelectItem>
                    {Object.values(FinancialStatus).map((status) => (
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
              <TableHead>{t('financial.type')}</TableHead>
              <TableHead>{t('financial.status')}</TableHead>
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
            ) : data?.items && data.items.length > 0 ? (
              data.items.map((financial) => (
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
                        onClick={() => handleDeleteClick(financial.id)}
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
      {data && data.totalItems > 0 && (
        <DataTablePagination
          currentPage={currentPage}
          pageSize={pageSize}
          totalItems={data.totalItems}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          pageSizeOptions={[5, 10, 25, 50]}
          showPageSizeSelect={true}
        />
      )}

      {/* Edit/Create Dialog */}
      <FinancialDialog
        open={isDialogOpen}
        onOpenChange={handleDialogOpenChange}
        financial={selectedFinancial}
        onSuccess={handleTransactionSuccess}
      />
    </div>
  );
}; 