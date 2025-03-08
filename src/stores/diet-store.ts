import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DietType, QueryDietsRequest } from '../types/diet';

interface DietState {
    filters: QueryDietsRequest;
    setFilters: (filters: Partial<QueryDietsRequest>) => void;
    resetFilters: () => void;
    selectedDietId: number | null;
    setSelectedDietId: (id: number | null) => void;
    isDetailModalOpen: boolean;
    setDetailModalOpen: (isOpen: boolean) => void;
    isEditMode: boolean;
    setEditMode: (isEdit: boolean) => void;
    isDeleteModalOpen: boolean;
    setDeleteModalOpen: (isOpen: boolean) => void;
    isCreateModalOpen: boolean;
    setCreateModalOpen: (isOpen: boolean) => void;
}

const defaultFilters: QueryDietsRequest = {
    pageNumber: 1,
    pageSize: 10,
    minCalories: undefined,
    maxCalories: undefined,
    dietType: undefined,
};

export const useDietStore = create<DietState>()(
    persist(
        (set) => ({
            filters: defaultFilters,
            setFilters: (newFilters) =>
                set((state) => ({
                    filters: { ...state.filters, ...newFilters },
                })),
            resetFilters: () => set({ filters: defaultFilters }),
            selectedDietId: null,
            setSelectedDietId: (id) => set({ selectedDietId: id }),
            isDetailModalOpen: false,
            setDetailModalOpen: (isOpen) => set({ isDetailModalOpen: isOpen }),
            isEditMode: false,
            setEditMode: (isEdit) => set({ isEditMode: isEdit }),
            isDeleteModalOpen: false,
            setDeleteModalOpen: (isOpen) => set({ isDeleteModalOpen: isOpen }),
            isCreateModalOpen: false,
            setCreateModalOpen: (isOpen) => set({ isCreateModalOpen: isOpen }),
        }),
        {
            name: 'diet-store',
        }
    )
);
