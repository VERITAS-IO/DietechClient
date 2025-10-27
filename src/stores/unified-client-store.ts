import { createBaseStore } from './base-store';
import { QueryClientResponse, QueryClientRequest } from '@/types/client';

// Default filters for client queries
const defaultClientFilters: QueryClientRequest = {
  pageNumber: 1,
  pageSize: 10,
  search: '',
  tenantId: undefined,
  status: undefined
};

// Create the client store using the base store pattern
export const useClientStore = createBaseStore<QueryClientResponse, QueryClientRequest>(
  'client-store',
  defaultClientFilters
);

// Additional client-specific actions
export const useClientActions = () => {
  const store = useClientStore();
  
  return {
    // Client-specific actions
    selectClient: (client: QueryClientResponse | null) => {
      store.setSelectedItem(client);
    },
    
    // Search functionality
    searchClients: (searchTerm: string) => {
      store.setFilters({ search: searchTerm, pageNumber: 1 });
    },
    
    // Filter by status
    filterByStatus: (status: string) => {
      store.setFilters({ status, pageNumber: 1 });
    },
    
    // Filter by tenant
    filterByTenant: (tenantId: number) => {
      store.setFilters({ tenantId, pageNumber: 1 });
    },
    
    // Pagination
    nextPage: () => {
      const totalPages = Math.ceil(store.totalItems / store.pageSize);
      if (store.currentPage < totalPages) {
        store.setCurrentPage(store.currentPage + 1);
      }
    },
    
    prevPage: () => {
      if (store.currentPage > 1) {
        store.setCurrentPage(store.currentPage - 1);
      }
    }
  };
};
