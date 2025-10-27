import { useQuery } from '@tanstack/react-query';
import { appointmentService } from '@/services/appointment-service';
import { QueryAppointmentNotesRequest, NoteType } from '@/types/appointment';

interface AppointmentNoteFilters {
  searchTerm?: string;
  appointmentId?: number;
  noteType?: NoteType;
  sortBy?: 'newest' | 'oldest';
  pageNumber: number;
  pageSize: number;
}

const safeGetTimestamp = (dateStr: string | Date | undefined): number => {
  if (!dateStr) return 0;
  
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
      return 0;
    }
    return date.getTime();
  } catch (err) {
    return 0;
  }
};

export function useQueryAppointmentNotes(filters: AppointmentNoteFilters) {
  const queryParams: QueryAppointmentNotesRequest = {
    appointmentId: filters.appointmentId,
    noteType: filters.noteType,
    note: filters.searchTerm,
    page: filters.pageNumber,
    pageSize: filters.pageSize
  };

  return useQuery({
    queryKey: ['appointment-notes', queryParams],
    queryFn: async () => {
      try {
        // Fetch the notes
        const notesResponse = await appointmentService.getAppointmentNotes(queryParams);
        const notes = notesResponse.items;
        
        // Sort the notes by created date with safe handling
        const sortedNotes = [...notes].sort((a, b) => {
          const dateA = safeGetTimestamp(a.createdAt);
          const dateB = safeGetTimestamp(b.createdAt);
          return filters.sortBy === 'newest' ? dateB - dateA : dateA - dateB;
        });
        
        // Return in a paginated format similar to other list responses
        return {
          items: sortedNotes,
          pageNumber: filters.pageNumber,
          pageSize: filters.pageSize,
          totalCount: notes.length, // This would normally come from the API
          totalPages: Math.ceil(notes.length / filters.pageSize)
        };
      } catch (error) {
        throw error;
      }
    }
  });
} 