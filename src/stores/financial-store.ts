import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Financial, QueryFinancialsRequest } from '../types/financial';
import { useAuthStore } from '@/stores/auth-store';

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
    
    selectedInterval: 'Daily' | 'Weekly' | 'Monthly' | 'Yearly';
    setSelectedInterval: (interval: 'Daily' | 'Weekly' | 'Monthly' | 'Yearly') => void;
}

// Helper function to get current dieticianId from auth store
const getCurrentDieticianId = (): number | undefined => {
    const user = useAuthStore.getState().user;
    
    // If user is not authenticated, cannot get dieticianId
    if (!user) {
        return getFallbackDieticianId();
    }
    
    // If dieticianId exists, use it
    if (user.dieticianId) {
        return user.dieticianId;
    }
    
    // If no dieticianId, but user has Dietician role, try to use their ID as a fallback
    if (user.id && user.roles && user.roles.includes('Dietician')) {
        const fallbackId = Number(user.id);
        return fallbackId;
    }
    
    return getFallbackDieticianId();
};

// Fallback function for development environments
const getFallbackDieticianId = (): number | undefined => {
    // In development, provide a fallback ID for testing
    if (process.env.NODE_ENV === 'development') {
        return 1;
    }
    
    // Fallback to undefined if no dieticianId can be determined
    return undefined;
};

// Get initial filters with current dieticianId
const getDefaultFilters = (): QueryFinancialsRequest => ({
    pageNumber: 1,
    pageSize: 10,
    dieticianId: getCurrentDieticianId(),
    type: undefined,
    status: undefined,
    startDate: undefined,
    endDate: undefined,
    description: undefined,
});

export const useFinancialStore = create<FinancialState>()(
    persist(
        (set) => ({
            // Filters
            filters: getDefaultFilters(),
            setFilters: (newFilters) =>
                set((state) => {
                    // Always ensure dieticianId is included in filters
                    const dieticianId = newFilters.dieticianId !== undefined 
                        ? newFilters.dieticianId 
                        : state.filters.dieticianId || getCurrentDieticianId();
                    
                    return {
                        filters: { 
                            ...state.filters, 
                            ...newFilters,
                            dieticianId 
                        },
                    };
                }),
            resetFilters: () => set({ filters: getDefaultFilters() }),
            
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
            
            // Selected interval for overview charts
            selectedInterval: 'Daily',
            setSelectedInterval: (interval) => set({ selectedInterval: interval }),
        }),
        {
            name: 'financial-store',
        }
    )
); 