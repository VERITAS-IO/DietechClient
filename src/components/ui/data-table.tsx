import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Search, 
  Filter, 
  X, 
  ChevronUp, 
  ChevronDown,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { DataTablePagination } from '@/components/common/DataTablePagination';
import { TableColumn, FilterOption } from '@/types/components';

// ✅ Basit Interface (Rehberinizden: Karmaşık yapma)
export interface DataTableColumn<T = unknown> extends TableColumn<T> {
  sortable?: boolean;
  sortKey?: string;
  width?: string;
  align?: 'left' | 'center' | 'right';
  className?: string;
  headerClassName?: string;
  cellClassName?: string;
}

export interface DataTableFilterOption extends FilterOption {
  defaultValue?: unknown;
}

// ✅ Main component props (Rehberinizden: Basit tut)
export interface DataTableProps<T = unknown> {
  data: T[];
  columns: DataTableColumn<T>[];
  loading?: boolean;
  error?: Error | null;
  onRowClick?: (item: T, index: number) => void;
  keyExtractor?: (item: T, index: number) => string | number;
  
  // Search
  searchable?: boolean;
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  
  // Filtering
  filterable?: boolean;
  filterOptions?: DataTableFilterOption[];
  activeFilters?: Record<string, unknown>;
  onFilterChange?: (filters: Record<string, unknown>) => void;
  onResetFilters?: () => void;
  
  // Sorting
  sortable?: boolean;
  sortColumn?: string;
  sortDirection?: 'asc' | 'desc';
  onSortChange?: (column: string, direction: 'asc' | 'desc') => void;
  
  // Pagination
  pagination?: {
    currentPage: number;
    pageSize: number;
    totalItems: number;
    onPageChange: (page: number) => void;
    onPageSizeChange: (size: number) => void;
    pageSizeOptions?: number[];
    showPageSizeSelector?: boolean;
  };
  
  // Layout
  className?: string;
  tableClassName?: string;
  headerClassName?: string;
  rowClassName?: string;
  emptyMessage?: string;
  loadingMessage?: string;
  errorMessage?: string;
  
  // Actions
  actions?: {
    label: string;
    render: (item: T, index: number) => React.ReactNode;
  };
  
  // Selection
  selectable?: boolean;
  selectedItems?: (string | number)[];
  onSelectionChange?: (selectedItems: (string | number)[]) => void;
}

export function DataTable<T extends Record<string, unknown>>({
  data,
  columns,
  loading = false,
  error = null,
  onRowClick,
  keyExtractor = (item: T, index: number) => (item as { id?: string | number }).id || index,
  
  // Search
  searchable = true,
  searchPlaceholder,
  searchValue = '',
  onSearchChange,
  
  // Filtering
  filterable = true,
  filterOptions = [],
  activeFilters = {},
  onFilterChange,
  onResetFilters,
  
  // Sorting
  sortable = true,
  sortColumn,
  sortDirection = 'asc',
  onSortChange,
  
  // Pagination
  pagination,
  
  // Layout
  className,
  tableClassName,
  headerClassName,
  rowClassName,
  emptyMessage,
  loadingMessage,
  errorMessage,
  
  // Actions
  actions,
  
  // Selection
  selectable = false,
  selectedItems = [],
  onSelectionChange,
}: DataTableProps<T>) {
  const { t } = useTranslation();
  
  // Local state for search and filters
  const [localSearchValue, setLocalSearchValue] = useState(searchValue);
  const [showFilters, setShowFilters] = useState(false);
  const [pendingFilters, setPendingFilters] = useState<Record<string, unknown>>(activeFilters);
  
  // Handle search
  const handleSearchChange = (value: string) => {
    setLocalSearchValue(value);
    if (onSearchChange) {
      onSearchChange(value);
    }
  };
  
  // Handle filter changes
  const handleFilterInputChange = (filterId: string, value: unknown) => {
    setPendingFilters(prev => ({
      ...prev,
      [filterId]: value
    }));
  };
  
  const applyFilters = () => {
    if (onFilterChange) {
      onFilterChange(pendingFilters);
    }
    setShowFilters(false);
  };
  
  const resetFilters = () => {
    setPendingFilters({});
    if (onResetFilters) {
      onResetFilters();
    }
  };
  
  // Handle sorting
  const handleSort = (column: DataTableColumn<T>) => {
    if (!sortable || !column.sortable || !onSortChange) return;
    
    const sortKey = column.sortKey || column.key;
    const newDirection = sortColumn === sortKey && sortDirection === 'asc' ? 'desc' : 'asc';
    onSortChange(sortKey, newDirection);
  };
  
  // Handle selection
  const handleSelectAll = () => {
    if (!selectable || !onSelectionChange) return;
    
    const allKeys = data.map((item, index) => keyExtractor(item, index));
    const isAllSelected = allKeys.every(key => selectedItems.includes(key));
    
    if (isAllSelected) {
      onSelectionChange([]);
    } else {
      onSelectionChange(allKeys);
    }
  };
  
  const handleSelectItem = (item: T, index: number) => {
    if (!selectable || !onSelectionChange) return;
    
    const key = keyExtractor(item, index);
    const isSelected = selectedItems.includes(key);
    
    if (isSelected) {
      onSelectionChange(selectedItems.filter(k => k !== key));
    } else {
      onSelectionChange([...selectedItems, key]);
    }
  };
  
  // Render loading state
  const renderLoadingState = () => (
    <TableRow>
      <TableCell colSpan={columns.length + (selectable ? 1 : 0) + (actions ? 1 : 0)} className="h-24 text-center">
        <div className="flex justify-center items-center h-full">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <span className="ml-2">{loadingMessage || t('common.loading')}</span>
        </div>
      </TableCell>
    </TableRow>
  );
  
  // Render error state
  const renderErrorState = () => (
    <TableRow>
      <TableCell colSpan={columns.length + (selectable ? 1 : 0) + (actions ? 1 : 0)} className="h-24 text-center">
        <div className="flex justify-center items-center h-full text-destructive">
          <AlertCircle className="h-6 w-6 mr-2" />
          <span>{errorMessage || error?.message || t('common.errorOccurred')}</span>
        </div>
      </TableCell>
    </TableRow>
  );
  
  // Render empty state
  const renderEmptyState = () => (
    <TableRow>
      <TableCell colSpan={columns.length + (selectable ? 1 : 0) + (actions ? 1 : 0)} className="h-24 text-center">
        <div className="flex flex-col justify-center items-center h-full text-muted-foreground">
          <div className="text-lg font-medium">{emptyMessage || t('common.noDataAvailable')}</div>
          <div className="text-sm">{t('common.noItemsFound')}</div>
        </div>
      </TableCell>
    </TableRow>
  );
  
  // Render table header
  const renderTableHeader = () => (
    <TableHeader className={headerClassName}>
      <TableRow>
        {selectable && (
          <TableHead className="w-12">
            <input
              type="checkbox"
              checked={data.length > 0 && data.every((item, index) => 
                selectedItems.includes(keyExtractor(item, index))
              )}
              onChange={handleSelectAll}
              className="rounded border-gray-300"
            />
          </TableHead>
        )}
        {columns.map((column) => (
          <TableHead
            key={column.key}
            className={cn(
              column.headerClassName,
              column.width && `w-[${column.width}]`,
              column.align === 'center' && 'text-center',
              column.align === 'right' && 'text-right',
              sortable && column.sortable && 'cursor-pointer hover:bg-muted/50',
              'select-none'
            )}
            onClick={() => handleSort(column)}
          >
            <div className="flex items-center gap-2">
              <span>{column.title}</span>
              {sortable && column.sortable && (
                <div className="flex flex-col">
                  <ChevronUp 
                    className={cn(
                      "h-3 w-3",
                      sortColumn === (column.sortKey || column.key) && sortDirection === 'asc' 
                        ? 'text-primary' 
                        : 'text-muted-foreground'
                    )}
                  />
                  <ChevronDown 
                    className={cn(
                      "h-3 w-3 -mt-1",
                      sortColumn === (column.sortKey || column.key) && sortDirection === 'desc' 
                        ? 'text-primary' 
                        : 'text-muted-foreground'
                    )}
                  />
                </div>
              )}
            </div>
          </TableHead>
        ))}
        {actions && (
          <TableHead className="w-12 text-right">{actions.label}</TableHead>
        )}
      </TableRow>
    </TableHeader>
  );
  
  // Render table body
  const renderTableBody = () => {
    if (loading) return renderLoadingState();
    if (error) return renderErrorState();
    if (!data || data.length === 0) return renderEmptyState();
    
    return (
      <TableBody>
        {data.map((item, index) => {
          const key = keyExtractor(item, index);
          const isSelected = selectedItems.includes(key);
          
          return (
            <TableRow
              key={key}
              className={cn(
                rowClassName,
                onRowClick && 'cursor-pointer hover:bg-muted/50',
                isSelected && 'bg-muted/50'
              )}
              onClick={() => onRowClick?.(item, index)}
            >
              {selectable && (
                <TableCell>
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => handleSelectItem(item, index)}
                    onClick={(e) => e.stopPropagation()}
                    className="rounded border-gray-300"
                  />
                </TableCell>
              )}
              {columns.map((column) => (
                <TableCell
                  key={column.key}
                  className={cn(
                    column.cellClassName,
                    column.align === 'center' && 'text-center',
                    column.align === 'right' && 'text-right'
                  )}
                >
                  {column.render ? column.render(item, index) : String((item as Record<string, unknown>)[column.key] || '')}
                </TableCell>
              ))}
              {actions && (
                <TableCell className="text-right">
                  <div onClick={(e) => e.stopPropagation()}>
                    {actions.render(item, index)}
                  </div>
                </TableCell>
              )}
            </TableRow>
          );
        })}
      </TableBody>
    );
  };
  
  return (
    <div className={cn('space-y-4', className)}>
      {/* Search and Filter Bar */}
      {(searchable || filterable) && (
        <div className="flex flex-col sm:flex-row gap-2">
          {searchable && (
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder={searchPlaceholder || t('common.search')}
                className="pl-8"
                value={localSearchValue}
                onChange={(e) => handleSearchChange(e.target.value)}
              />
            </div>
          )}
          
          {filterable && filterOptions.length > 0 && (
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="gap-2"
            >
              <Filter className="h-4 w-4" />
              {t('common.filters')}
            </Button>
          )}
          
          {Object.keys(activeFilters).length > 0 && (
            <Button
              variant="ghost"
              onClick={resetFilters}
              className="gap-2 text-muted-foreground"
            >
              <X className="h-4 w-4" />
              {t('common.resetFilters')}
            </Button>
          )}
        </div>
      )}
      
      {/* Filter Panel */}
      {showFilters && filterOptions.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">{t('common.filters')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filterOptions.map((option) => (
                <div key={option.id} className="space-y-2">
                  <label className="text-sm font-medium">{option.label}</label>
                  
                  {option.type === 'text' && (
                    <Input
                      placeholder={option.placeholder}
                      value={String(pendingFilters[option.id] || '')}
                      onChange={(e) => handleFilterInputChange(option.id, e.target.value)}
                    />
                  )}
                  
                  {option.type === 'number' && (
                    <Input
                      type="number"
                      placeholder={option.placeholder}
                      value={String(pendingFilters[option.id] || '')}
                      onChange={(e) => handleFilterInputChange(option.id, e.target.value)}
                    />
                  )}
                  
                  {option.type === 'select' && option.options && (
                    <Select
                      value={String(pendingFilters[option.id] || 'all')}
                      onValueChange={(value) => handleFilterInputChange(option.id, value === 'all' ? '' : value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={option.placeholder} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">{t('common.all')}</SelectItem>
                        {option.options.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>
              ))}
            </div>
            
            <div className="flex justify-end mt-4 space-x-2">
              <Button variant="outline" onClick={resetFilters}>
                {t('common.reset')}
              </Button>
              <Button onClick={applyFilters}>
                {t('common.apply')}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Table */}
      <div className="rounded-md border">
        <Table className={tableClassName}>
          {renderTableHeader()}
          {renderTableBody()}
        </Table>
      </div>
      
      {/* Pagination */}
      {pagination && !loading && data && data.length > 0 && (
        <DataTablePagination
          currentPage={pagination.currentPage}
          pageSize={pagination.pageSize}
          totalItems={pagination.totalItems}
          onPageChange={pagination.onPageChange}
          onPageSizeChange={pagination.onPageSizeChange}
          pageSizeOptions={pagination.pageSizeOptions || [5, 10, 25, 50]}
          showPageSizeSelector={pagination.showPageSizeSelector}
        />
      )}
    </div>
  );
}
