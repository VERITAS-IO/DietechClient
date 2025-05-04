import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { appointmentService } from '@/services/appointment-service';
import { 
  UpdateAppointmentRequest, 
  QueryAppointmentsRequest, 
  CreateAppointmentNoteRequest,
  UpdateAppointmentNoteRequest,
  QueryAppointmentNotesRequest
} from '@/types/appointment';

//bir hook, hem method doner, hem de property doner.
export function useAppointments(query?: QueryAppointmentsRequest) {
  const queryClient = useQueryClient();

  const { data: appointments = [], isLoading } = useQuery({
    queryKey: ['appointments', query],
    queryFn: () => appointmentService.getAppointments(query),
  });

  const createMutation = useMutation({
    mutationFn: appointmentService.createAppointment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<UpdateAppointmentRequest> }) =>
      appointmentService.updateAppointment(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: appointmentService.deleteAppointment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
  });

  return {
    appointments,
    isLoading,
    createAppointment: createMutation.mutate,
    updateAppointment: updateMutation.mutate,
    deleteAppointment: deleteMutation.mutate,
  };
}

export function useAppointmentNotes(query?: QueryAppointmentNotesRequest) {
  const queryClient = useQueryClient();

  const { data: notes = [], isLoading } = useQuery({
    queryKey: ['appointment-notes', query],
    queryFn: () => appointmentService.getAppointmentNotes(query),
  });

  const createMutation = useMutation({
    mutationFn: (note: CreateAppointmentNoteRequest & { appointmentId: number }) => 
      appointmentService.createAppointmentNote(note),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointment-notes'] });
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateAppointmentNoteRequest }) =>
      appointmentService.updateAppointmentNote(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointment-notes'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: appointmentService.deleteAppointmentNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointment-notes'] });
    },
  });

  return {
    notes,
    isLoading,
    createAppointmentNote: createMutation.mutate,
    updateAppointmentNote: updateMutation.mutate,
    deleteAppointmentNote: deleteMutation.mutate,
    isDeletePending: deleteMutation.isPending,
    deletingNoteId: deleteMutation.variables as number | undefined
  };
}