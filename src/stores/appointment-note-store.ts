import { create } from 'zustand';
import { NoteType, GetAppointmentNoteResponse } from '@/types/appointment';

interface AppointmentNoteFilters {
  searchTerm?: string;
  appointmentId?: number;
  noteType?: NoteType;
  sortBy?: 'newest' | 'oldest';
  pageNumber: number;
  pageSize: number;
}

interface AppointmentNoteState {
  filters: AppointmentNoteFilters;
  selectedNote: GetAppointmentNoteResponse | null;
  isDetailModalOpen: boolean;
  isCreateModalOpen: boolean;
  isDeleteModalOpen: boolean;
  
  // Actions
  setFilters: (filters: Partial<AppointmentNoteFilters>) => void;
  resetFilters: () => void;
  setSelectedNote: (note: GetAppointmentNoteResponse | null) => void;
  setDetailModalOpen: (open: boolean) => void;
  setCreateModalOpen: (open: boolean) => void;
  setDeleteModalOpen: (open: boolean) => void;
}

const DEFAULT_FILTERS: AppointmentNoteFilters = {
  searchTerm: undefined,
  appointmentId: undefined,
  noteType: undefined,
  sortBy: 'newest',
  pageNumber: 1,
  pageSize: 10
};

export const useAppointmentNoteStore = create<AppointmentNoteState>()((set) => ({
  filters: { ...DEFAULT_FILTERS },
  selectedNote: null,
  isDetailModalOpen: false,
  isCreateModalOpen: false,
  isDeleteModalOpen: false,
  
  // Filters actions
  setFilters: (filters) => set((state) => ({
    filters: { ...state.filters, ...filters }
  })),
  
  resetFilters: () => set(() => ({
    filters: { ...DEFAULT_FILTERS }
  })),
  
  // Note selection and modal actions
  setSelectedNote: (note) => set(() => ({ selectedNote: note })),
  setDetailModalOpen: (open) => set(() => ({ isDetailModalOpen: open })),
  setCreateModalOpen: (open) => set(() => ({ isCreateModalOpen: open })),
  setDeleteModalOpen: (open) => set(() => ({ isDeleteModalOpen: open }))
})); 