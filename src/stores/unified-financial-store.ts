import { createBaseStore } from './base-store';
import { Financial, QueryFinancialsRequest } from '@/types/financial';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

// Default filters for financial queries
const defaultFinancialFilters: QueryFinancialsRequest = {
  pageNumber: 1,
  pageSize: 10,
  dieticianId: undefined,
  startDate: undefined,
  endDate: undefined,
  type: undefined,
  status: undefined
};

// Create the base financial store using the unified pattern
export const useFinancialStore = createBaseStore<Financial, QueryFinancialsRequest>(
  'financial-store',
  defaultFinancialFilters
);

// Additional financial-specific state and actions
interface FinancialUIState {
  // Modal states
  isDetailModalOpen: boolean;
  isEditModalOpen: boolean;
  isCreateModalOpen: boolean;
  isDeleteModalOpen: boolean;
  
  // Tab and view states
  activeTab: 'overview' | 'transactions';
  chartView: 'daily' | 'weekly' | 'monthly' | 'yearly';
  selectedInterval: 'Daily' | 'Weekly' | 'Monthly' | 'Yearly';
}

interface FinancialUIActions {
  // Modal actions
  setDetailModalOpen: (isOpen: boolean) => void;
  setEditModalOpen: (isOpen: boolean) => void;
  setCreateModalOpen: (isOpen: boolean) => void;
  setDeleteModalOpen: (isOpen: boolean) => void;
  
  // Tab and view actions
  setActiveTab: (tab: 'overview' | 'transactions') => void;
  setChartView: (view: 'daily' | 'weekly' | 'monthly' | 'yearly') => void;
  setSelectedInterval: (interval: 'Daily' | 'Weekly' | 'Monthly' | 'Yearly') => void;
  
  // Combined actions
  openCreateModal: () => void;
  openEditModal: (financial: Financial) => void;
  openDeleteModal: (financial: Financial) => void;
  closeAllModals: () => void;
}

// Create the UI store
export const useFinancialUIStore = create<FinancialUIState & FinancialUIActions>()(
  devtools(
    (set, get) => ({
      // Initial UI state
      isDetailModalOpen: false,
      isEditModalOpen: false,
      isCreateModalOpen: false,
      isDeleteModalOpen: false,
      activeTab: 'overview',
      chartView: 'monthly',
      selectedInterval: 'Monthly',
      
      // Modal actions
      setDetailModalOpen: (isDetailModalOpen) => set({ isDetailModalOpen }),
      setEditModalOpen: (isEditModalOpen) => set({ isEditModalOpen }),
      setCreateModalOpen: (isCreateModalOpen) => set({ isCreateModalOpen }),
      setDeleteModalOpen: (isDeleteModalOpen) => set({ isDeleteModalOpen }),
      
      // Tab and view actions
      setActiveTab: (activeTab) => set({ activeTab }),
      setChartView: (chartView) => set({ chartView }),
      setSelectedInterval: (selectedInterval) => set({ selectedInterval }),
      
      // Combined actions
      openCreateModal: () => set({ 
        isCreateModalOpen: true,
        isEditModalOpen: false,
        isDeleteModalOpen: false,
        isDetailModalOpen: false
      }),
      
      openEditModal: (financial) => set({ 
        isEditModalOpen: true,
        isCreateModalOpen: false,
        isDeleteModalOpen: false,
        isDetailModalOpen: false
      }),
      
      openDeleteModal: (financial) => set({ 
        isDeleteModalOpen: true,
        isCreateModalOpen: false,
        isEditModalOpen: false,
        isDetailModalOpen: false
      }),
      
      closeAllModals: () => set({
        isDetailModalOpen: false,
        isEditModalOpen: false,
        isCreateModalOpen: false,
        isDeleteModalOpen: false
      })
    }),
    { name: 'financial-ui-store' }
  )
);

// Additional financial-specific actions
export const useFinancialActions = () => {
  const store = useFinancialStore();
  const uiStore = useFinancialUIStore();
  
  return {
    // Financial-specific actions
    selectFinancial: (financial: Financial | null) => {
      store.setSelectedItem(financial);
    },
    
    // Date range filtering
    setDateRange: (startDate: string, endDate: string) => {
      store.setFilters({ startDate, endDate, pageNumber: 1 });
    },
    
    // Type filtering
    filterByType: (type: string) => {
      store.setFilters({ type, pageNumber: 1 });
    },
    
    // Status filtering
    filterByStatus: (status: string) => {
      store.setFilters({ status, pageNumber: 1 });
    },
    
    // Dietician filtering
    filterByDietician: (dieticianId: number) => {
      store.setFilters({ dieticianId, pageNumber: 1 });
    },
    
    // Clear all filters
    clearAllFilters: () => {
      store.resetFilters();
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
    },
    
    // UI actions
    ...uiStore
  };
};
