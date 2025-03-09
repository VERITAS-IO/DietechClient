import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { QueryMealRequest } from '../types/meal';

import { CreateMealRequest, MealListResponse } from '../types/meal';

type MealCreatedCallback = (meal: MealListResponse | CreateMealRequest) => void;

interface MealState {
    filters: QueryMealRequest;
    setFilters: (filters: Partial<QueryMealRequest>) => void;
    resetFilters: () => void;
    selectedMealId: number | null;
    setSelectedMealId: (id: number | null) => void;
    isDetailModalOpen: boolean;
    setDetailModalOpen: (isOpen: boolean) => void;
    isEditMode: boolean;
    setEditMode: (isEdit: boolean) => void;
    isDeleteModalOpen: boolean;
    setDeleteModalOpen: (isOpen: boolean) => void;
    isCreateModalOpen: boolean;
    setCreateModalOpen: (isOpen: boolean) => void;
    createMealModalOpen: boolean;
    setCreateMealModalOpen: (isOpen: boolean) => void;
    onMealCreated: MealCreatedCallback | null;
    setOnMealCreated: (callback: MealCreatedCallback | null) => void;
}

const defaultFilters: QueryMealRequest = {
    pageNumber: 1,
    pageSize: 10,
    name: undefined,
    dietId: undefined,
    mealType: undefined,
    mealOrder: undefined,
    startTime: undefined,
    endTime: undefined,
    searchTerm: undefined,
    orderBy: undefined,
    includeDeleted: false
};

export const useMealStore = create<MealState>()(
    persist(
        (set) => ({
            filters: defaultFilters,
            setFilters: (newFilters) =>
                set((state) => ({
                    filters: { ...state.filters, ...newFilters },
                })),
            resetFilters: () => set({ filters: defaultFilters }),
            selectedMealId: null,
            setSelectedMealId: (id) => set({ selectedMealId: id }),
            isDetailModalOpen: false,
            setDetailModalOpen: (isOpen) => set({ isDetailModalOpen: isOpen }),
            isEditMode: false,
            setEditMode: (isEdit) => set({ isEditMode: isEdit }),
            isDeleteModalOpen: false,
            setDeleteModalOpen: (isOpen) => set({ isDeleteModalOpen: isOpen }),
            isCreateModalOpen: false,
            setCreateModalOpen: (isOpen) => set({ isCreateModalOpen: isOpen }),
            createMealModalOpen: false,
            setCreateMealModalOpen: (isOpen) => set({ createMealModalOpen: isOpen }),
            onMealCreated: null,
            setOnMealCreated: (callback) => set({ onMealCreated: callback }),
        }),
        {
            name: 'meal-store',
        }
    )
);
