import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { QueryDietsRequest } from '../types/diet';
import { CreateMealRequest } from '../types/meal';

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
    temporaryMeals: CreateMealRequest[];
    addTemporaryMeal: (meal: CreateMealRequest) => void;
    removeTemporaryMeal: (index: number) => void;
    clearTemporaryMeals: () => void;
    isMealCreateModalOpen: boolean;
    setMealCreateModalOpen: (isOpen: boolean) => void;
    mealsToRemove: number[];
    addMealToRemove: (mealId: number) => void;
    removeMealFromRemove: (mealId: number) => void;
    clearMealsToRemove: () => void;
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
            temporaryMeals: [],
            addTemporaryMeal: (meal) => set((state) => ({
                temporaryMeals: [...state.temporaryMeals, meal]
            })),
            removeTemporaryMeal: (index) => set((state) => ({
                temporaryMeals: state.temporaryMeals.filter((_, i) => i !== index)
            })),
            clearTemporaryMeals: () => set({ temporaryMeals: [] }),
            isMealCreateModalOpen: false,
            setMealCreateModalOpen: (isOpen) => set({ isMealCreateModalOpen: isOpen }),
            mealsToRemove: [],
            addMealToRemove: (mealId) => set((state) => ({
                mealsToRemove: [...state.mealsToRemove, mealId]
            })),
            removeMealFromRemove: (mealId) => set((state) => ({
                mealsToRemove: state.mealsToRemove.filter(id => id !== mealId)
            })),
            clearMealsToRemove: () => set({ mealsToRemove: [] }),
        }),
        {
            name: 'diet-store',
        }
    )
);
