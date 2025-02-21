import { create } from 'zustand';
import { NutritionInfoDetail, QueryNutritionInfoRequest } from '@/types/nutrition';

interface NutritionStore {
    selectedNutritionInfo: NutritionInfoDetail | null;
    filters: QueryNutritionInfoRequest;
    isDetailModalOpen: boolean;
    isDeleteModalOpen: boolean;
    isEditMode: boolean;
    setSelectedNutritionInfo: (nutritionInfo: NutritionInfoDetail | null) => void;
    setFilters: (filters: Partial<QueryNutritionInfoRequest>) => void;
    setDetailModalOpen: (isOpen: boolean) => void;
    setDeleteModalOpen: (isOpen: boolean) => void;
    setEditMode: (isEdit: boolean) => void;
    resetFilters: () => void;
}

const defaultFilters: QueryNutritionInfoRequest = {
    pageSize: 10,
    pageNumber: 1
};

export const useNutritionStore = create<NutritionStore>((set) => ({
    selectedNutritionInfo: null,
    filters: defaultFilters,
    isDetailModalOpen: false,
    isDeleteModalOpen: false,
    isEditMode: false,
    setSelectedNutritionInfo: (nutritionInfo) => set({ selectedNutritionInfo: nutritionInfo }),
    setFilters: (newFilters) => set((state) => ({ 
        filters: { ...state.filters, ...newFilters } 
    })),
    setDetailModalOpen: (isOpen) => set({ isDetailModalOpen: isOpen }),
    setDeleteModalOpen: (isOpen) => set({ isDeleteModalOpen: isOpen }),
    setEditMode: (isEdit) => set({ isEditMode: isEdit }),
    resetFilters: () => set({ filters: defaultFilters })
}));
