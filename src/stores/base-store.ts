import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

// Generic store interface for CRUD operations
export interface BaseStoreState<T, QueryRequest> {
  // Data
  items: T[];
  selectedItem: T | null;
  totalItems: number;
  isLoading: boolean;
  error: string | null;
  
  // Pagination
  currentPage: number;
  pageSize: number;
  
  // Filters/Query
  filters: QueryRequest;
  
  // Actions
  setItems: (items: T[]) => void;
  setSelectedItem: (item: T | null) => void;
  setTotalItems: (total: number) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setCurrentPage: (page: number) => void;
  setPageSize: (size: number) => void;
  setFilters: (filters: Partial<QueryRequest>) => void;
  resetFilters: () => void;
  reset: () => void;
}

// Generic store factory
export function createBaseStore<T, QueryRequest>(
  name: string,
  defaultFilters: QueryRequest
) {
  return create<BaseStoreState<T, QueryRequest>>()(
    devtools(
      (set) => ({
        // Initial state
        items: [],
        selectedItem: null,
        totalItems: 0,
        isLoading: false,
        error: null,
        currentPage: 1,
        pageSize: 10,
        filters: defaultFilters,
        
        // Actions
        setItems: (items) => set({ items }),
        setSelectedItem: (selectedItem) => set({ selectedItem }),
        setTotalItems: (totalItems) => set({ totalItems }),
        setLoading: (isLoading) => set({ isLoading }),
        setError: (error) => set({ error }),
        setCurrentPage: (currentPage) => set({ currentPage }),
        setPageSize: (pageSize) => set({ pageSize }),
        setFilters: (newFilters) => set((state) => ({ 
          filters: { ...state.filters, ...newFilters },
          currentPage: 1 // Reset to first page when filters change
        })),
        resetFilters: () => set({ filters: defaultFilters, currentPage: 1 }),
        reset: () => set({
          items: [],
          selectedItem: null,
          totalItems: 0,
          isLoading: false,
          error: null,
          currentPage: 1,
          pageSize: 10,
          filters: defaultFilters
        })
      }),
      { name }
    )
  );
}

// Utility hook for common store operations
export function useStoreActions<T, QueryRequest>(
  store: BaseStoreState<T, QueryRequest>
) {
  return {
    // Data operations
    loadItems: () => {
      store.setLoading(true);
      store.setError(null);
    },
    
    handleSuccess: (items: T[], total?: number) => {
      store.setItems(items);
      store.setTotalItems(total || items.length);
      store.setLoading(false);
      store.setError(null);
    },
    
    handleError: (error: string) => {
      store.setError(error);
      store.setLoading(false);
    },
    
    // Pagination
    goToPage: (page: number) => {
      store.setCurrentPage(page);
    },
    
    changePageSize: (size: number) => {
      store.setPageSize(size);
      store.setCurrentPage(1);
    },
    
    // Filters
    updateFilters: (filters: Partial<QueryRequest>) => {
      store.setFilters(filters);
    },
    
    clearFilters: () => {
      store.resetFilters();
    }
  };
}
