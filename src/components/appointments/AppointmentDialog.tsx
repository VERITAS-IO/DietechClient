import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Appointment, AppointmentType } from '@/types/appointment';
import { useAppointmentStore } from '@/stores/appointment-store';

const appointmentSchema = z.object({
  clientName: z.string().min(1, 'Client name is required'),
  clientId: z.string().min(1, 'Client ID is required'),
  type: z.enum(['initial', 'followUp', 'assessment', 'emergency']),
  start: z.string().min(1, 'Start time is required'),
  end: z.string().min(1, 'End time is required'),
  notes: z.string().optional(),
  preparationInstructions: z.string().optional(),
});

interface AppointmentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: Date | null;
  appointment: Appointment | null;
}

export function AppointmentDialog({
  isOpen,
  onClose,
  selectedDate,
  appointment,
}: AppointmentDialogProps) {
  const { addAppointment, updateAppointment, deleteAppointment } = useAppointmentStore();

  const form = useForm<z.infer<typeof appointmentSchema>>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      clientName: '',
      clientId: '',
      type: 'initial',
      start: '',
      end: '',
      notes: '',
      preparationInstructions: '',
    },
  });

  useEffect(() => {
    if (appointment) {
      form.reset({
        clientName: appointment.clientName,
        clientId: appointment.clientId,
        type: appointment.type,
        start: appointment.start.toISOString().slice(0, 16),
        end: appointment.end.toISOString().slice(0, 16),
        notes: appointment.notes || '',
        preparationInstructions: appointment.preparationInstructions || '',
      });
    } else if (selectedDate) {
      const endDate = new Date(selectedDate);
      endDate.setHours(endDate.getHours() + 1);
      form.reset({
        start: selectedDate.toISOString().slice(0, 16),
        end: endDate.toISOString().slice(0, 16),
      });
    }
  }, [appointment, selectedDate]);

  const onSubmit = (values: z.infer<typeof appointmentSchema>) => {
    const appointmentData = {
      id: appointment?.id || crypto.randomUUID(),
      title: `${values.clientName} - ${values.type}`,
      start: new Date(values.start),
      end: new Date(values.end),
      clientId: values.clientId,
      clientName: values.clientName,
      type: values.type as AppointmentType,
      status: appointment?.status || 'scheduled',
      notes: values.notes,
      preparationInstructions: values.preparationInstructions,
    };

    if (appointment) {
      updateAppointment(appointment.id, appointmentData);
    } else {
      addAppointment(appointmentData);
    }

    onClose();
  };

  const handleDelete = () => {
    if (appointment) {
      deleteAppointment(appointment.id);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {appointment ? 'Edit Appointment' : 'New Appointment'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="clientName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Client Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="clientId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Client ID</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Appointment Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select appointment type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="initial">Initial Consultation</SelectItem>
                      <SelectItem value="followUp">Follow-up</SelectItem>
                      <SelectItem value="assessment">Assessment</SelectItem>
                      <SelectItem value="emergency">Emergency</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="start"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Time</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="end"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Time</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="preparationInstructions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Preparation Instructions</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2">
              {appointment && (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleDelete}
                >
                  Delete
                </Button>
              )}
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-[#FF5A5F] hover:bg-[#FF5A5F]/90"
              >
                {appointment ? 'Update' : 'Create'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}