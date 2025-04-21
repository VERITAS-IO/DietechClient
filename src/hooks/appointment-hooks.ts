import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { appointmentService } from '@/services/appointment-service';
import { UpdateAppointmentRequest } from '@/types/appointment';

//bir hook, hem method doner, hem de property doner.
export function useAppointments() {
  const queryClient = useQueryClient();

  1.useQueryClient App'de tanimlanan QueryClientProvider' a ait
  2.useQueryClient import ediyorum.
  3.useQueryClient'i useAppointments'ta kullanmak istiyorum, queryClient araciligiyla.
  4.appointment keyine sahip queryi invalidate ettim 
  5.getAppointments' querysinin icerdeki invalidate propertysi = true => query tekrar calisti. 
  6.invalidate propertysi = false.

  const { data: appointments = [], isLoading } = useQuery({
    queryKey: ['appointments'],
    queryFn: appointmentService.getAppointments,
  });

  const createMutation = useMutation({
    mutationFn: appointmentService.createAppointment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<UpdateAppointmentRequest> }) =>
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