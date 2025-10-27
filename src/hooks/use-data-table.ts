import { useState, useMemo, useCallback } from 'react';
import { DataTableColumn, DataTableFilterOption } from '@/components/ui/data-table';

export interface UseDataTableOptions<T = unknown> {
  data: T[];
  columns: DataTableColumn<T>[];
  initialPageSize?: number;
  initialPage?: number;
  initialSortColumn?: string;
  initialSortDirection?: 'asc' | 'desc';
  initialFilters?: Record<string, unknown>;
  filterOptions?: DataTableFilterOption[];
  searchable?: boolean;
  sortable?: boolean;
  filterable?: boolean;
  selectable?: boolean;
}

export interface UseDataTableReturn<T = unknown> {
  // Data
  processedData: T[];
  
  // Search
  searchValue: string;
  setSearchValue: (value: string) => void;
  
  // Filters
  activeFilters: Record<string, unknown>;
  setActiveFilters: (filters: Record<string, unknown>) => void;
  resetFilters: () => void;
  
  // Sorting
  sortColumn: string | undefined;
  sortDirection: 'asc' | 'desc';
  setSorting: (column: string, direction: 'asc' | 'desc') => void;
  
  // Pagination
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
  setPageSize: (size: number) => void;
  
  // Selection
  selectedItems: (string | number)[];
  setSelectedItems: (items: (string | number)[]) => void;
  toggleItemSelection: (item: T, key: string | number) => void;
  selectAll: () => void;
  clearSelection: () => void;
  
  // Computed
  paginatedData: T[];
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  isAllSelected: boolean;
  isIndeterminate: boolean;
}

export function useDataTable<T extends Record<string, unknown>>({
  data,
  columns,
  initialPageSize = 10,
  initialPage = 1,
  initialSortColumn,
  initialSortDirection = 'asc',
  initialFilters = {},
  searchable = true,
  sortable = true,
  filterable = true,
}: UseDataTableOptions<T>): UseDataTableReturn<T> {
  
  // Search state
  const [searchValue, setSearchValue] = useState('');
  
  // Filter state
  const [activeFilters, setActiveFilters] = useState<Record<string, unknown>>(initialFilters);
  
  // Sort state
  const [sortColumn, setSortColumn] = useState<string | undefined>(initialSortColumn);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>(initialSortDirection);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);
  
  // Selection state
  const [selectedItems, setSelectedItems] = useState<(string | number)[]>([]);
  
  // Process data based on search and filters
  const processedData = useMemo(() => {
    let filtered = [...data];
    
    // Apply search
    if (searchable && searchValue.trim()) {
      const searchLower = searchValue.toLowerCase();
      filtered = filtered.filter((item) => {
        return columns.some((column) => {
          const value = (item as Record<string, unknown>)[column.key];
          return value && value.toString().toLowerCase().includes(searchLower);
        });
      });
    }
    
    // Apply filters
    if (filterable) {
      filtered = filtered.filter((item) => {
        return Object.entries(activeFilters).every(([key, value]) => {
          if (!value || value === 'all') return true;
          
          const itemValue = (item as Record<string, unknown>)[key];
          if (typeof value === 'string') {
            return itemValue && itemValue.toString().toLowerCase().includes(value.toLowerCase());
          }
          if (typeof value === 'number') {
            return itemValue === value;
          }
          return itemValue === value;
        });
      });
    }
    
    // Apply sorting
    if (sortable && sortColumn) {
      filtered.sort((a, b) => {
        const aValue = (a as Record<string, unknown>)[sortColumn];
        const bValue = (b as Record<string, unknown>)[sortColumn];
        
        if (aValue === bValue) return 0;
        
        // Handle different types for comparison
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          const comparison = aValue.localeCompare(bValue);
          return sortDirection === 'asc' ? comparison : -comparison;
        }
        
        if (typeof aValue === 'number' && typeof bValue === 'number') {
          const comparison = aValue - bValue;
          return sortDirection === 'asc' ? comparison : -comparison;
        }
        
        // Fallback to string comparison
        const aStr = String(aValue || '');
        const bStr = String(bValue || '');
        const comparison = aStr.localeCompare(bStr);
        return sortDirection === 'asc' ? comparison : -comparison;
      });
    }
    
    return filtered;
  }, [data, searchValue, activeFilters, sortColumn, sortDirection, columns, searchable, filterable, sortable]);
  
  // Pagination calculations
  const totalItems = processedData.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return processedData.slice(startIndex, startIndex + pageSize);
  }, [processedData, currentPage, pageSize]);
  
  // Pagination helpers
  const hasNextPage = currentPage < totalPages;
  const hasPreviousPage = currentPage > 1;
  
  // Selection helpers
  const isAllSelected = paginatedData.length > 0 && 
    paginatedData.every((item, index) => {
      const key = (item as { id?: string | number }).id || index;
      return selectedItems.includes(key);
    });
  
  const isIndeterminate = selectedItems.length > 0 && !isAllSelected;
  
  // Handlers
  const resetFilters = useCallback(() => {
    setActiveFilters({});
  }, []);
  
  const setSorting = useCallback((column: string, direction: 'asc' | 'desc') => {
    setSortColumn(column);
    setSortDirection(direction);
  }, []);
  
  const toggleItemSelection = useCallback((_item: T, key: string | number) => {
    setSelectedItems(prev => {
      if (prev.includes(key)) {
        return prev.filter(k => k !== key);
      } else {
        return [...prev, key];
      }
    });
  }, []);
  
  const selectAll = useCallback(() => {
    const allKeys = paginatedData.map((item, index) => (item as { id?: string | number }).id || index);
    setSelectedItems(allKeys);
  }, [paginatedData]);
  
  const clearSelection = useCallback(() => {
    setSelectedItems([]);
  }, []);
  
  // Reset page when filters change
  const handleSetActiveFilters = useCallback((filters: Record<string, unknown>) => {
    setActiveFilters(filters);
    setCurrentPage(1);
  }, []);
  
  const handleSetSearchValue = useCallback((value: string) => {
    setSearchValue(value);
    setCurrentPage(1);
  }, []);
  
  const handleSetPageSize = useCallback((size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  }, []);
  
  return {
    // Data
    processedData,
    
    // Search
    searchValue,
    setSearchValue: handleSetSearchValue,
    
    // Filters
    activeFilters,
    setActiveFilters: handleSetActiveFilters,
    resetFilters,
    
    // Sorting
    sortColumn,
    sortDirection,
    setSorting,
    
    // Pagination
    currentPage,
    pageSize,
    totalItems,
    totalPages,
    setCurrentPage,
    setPageSize: handleSetPageSize,
    
    // Selection
    selectedItems,
    setSelectedItems,
    toggleItemSelection,
    selectAll,
    clearSelection,
    
    // Computed
    paginatedData,
    hasNextPage,
    hasPreviousPage,
    isAllSelected,
    isIndeterminate,
  };
}
