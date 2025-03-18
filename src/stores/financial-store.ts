import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Financial, QueryFinancialsRequest, FinancialType, FinancialStatus } from '../types/financial';

interface FinancialState {
    filters: QueryFinancialsRequest;
    setFilters: (filters: Partial<QueryFinancialsRequest>) => void;
    resetFilters: () => void;
    
    selectedFinancial: Financial | null;
    setSelectedFinancial: (financial: Financial | null) => void;
    
    isDetailModalOpen: boolean;
    setDetailModalOpen: (isOpen: boolean) => void;
    isEditModalOpen: boolean;
    setEditModalOpen: (isOpen: boolean) => void;
    isCreateModalOpen: boolean;
    setCreateModalOpen: (isOpen: boolean) => void;
    isDeleteModalOpen: boolean;
    setDeleteModalOpen: (isOpen: boolean) => void;
    
    activeTab: 'overview' | 'transactions';
    setActiveTab: (tab: 'overview' | 'transactions') => void;
    
    chartView: 'daily' | 'weekly' | 'monthly' | 'yearly';
    setChartView: (view: 'daily' | 'weekly' | 'monthly' | 'yearly') => void;
}

const defaultFilters: QueryFinancialsRequest = {
    pageNumber: 1,
    pageSize: 10,
    type: undefined,
    status: undefined,
    startDate: undefined,
    endDate: undefined,
    description: undefined,
};

export const useFinancialStore = create<FinancialState>()(
    persist(
        (set) => ({
            // Filters
            filters: defaultFilters,
            setFilters: (newFilters) =>
                set((state) => ({
                    filters: { ...state.filters, ...newFilters },
                })),
            resetFilters: () => set({ filters: defaultFilters }),
            
            // Selected financial
            selectedFinancial: null,
            setSelectedFinancial: (financial) => set({ selectedFinancial: financial }),
            
            // Modal states
            isDetailModalOpen: false,
            setDetailModalOpen: (isOpen) => set({ isDetailModalOpen: isOpen }),
            isEditModalOpen: false,
            setEditModalOpen: (isOpen) => set({ isEditModalOpen: isOpen }),
            isCreateModalOpen: false,
            setCreateModalOpen: (isOpen) => set({ isCreateModalOpen: isOpen }),
            isDeleteModalOpen: false,
            setDeleteModalOpen: (isOpen) => set({ isDeleteModalOpen: isOpen }),
            
            // Active tab
            activeTab: 'overview' as const,
            setActiveTab: (tab) => set({ activeTab: tab }),
            
            // Chart view
            chartView: 'daily' as const,
            setChartView: (view) => set({ chartView: view }),
        }),
        {
            name: 'financial-store',
        }
    )
); 