import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { CalendarIcon, Clock } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Appointment } from '@/types/appointment';
import { useAppointments } from '@/hooks/appointment-hooks';

const appointmentSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  clientName: z.string().min(1, 'Client name is required'),
  type: z.enum(['initial', 'followUp', 'assessment', 'emergency']),
  status: z.enum(['scheduled', 'confirmed', 'cancelled', 'completed']),
  notes: z.string().optional(),
  preparationInstructions: z.string().optional(),
});

interface AppointmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  appointment: Appointment | null;
}

export function AppointmentDialog({
  open,
  onOpenChange,
  appointment,
}: AppointmentDialogProps) {
  const { t } = useTranslation();
  const { createAppointment, updateAppointment, deleteAppointment } = useAppointments();

  const form = useForm<z.infer<typeof appointmentSchema>>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      title: '',
      clientName: '',
      type: 'initial',
      status: 'scheduled',
      notes: '',
      preparationInstructions: '',
    },
  });

  useEffect(() => {
    if (appointment) {
      form.reset({
        title: appointment.title || '',
        clientName: appointment.clientName || '',
        type: appointment.type || 'initial',
        status: appointment.status || 'scheduled',
        notes: appointment.notes || '',
        preparationInstructions: appointment.preparationInstructions || '',
      });
    }
  }, [appointment, form]);

  const onSubmit = async (values: z.infer<typeof appointmentSchema>) => {
    try {
      if (appointment?.id) {
        await updateAppointment({
          id: appointment.id,
          data: {
            ...values,
            start: appointment.start,
            end: appointment.end,
          },
        });
      } else if (appointment) {
        await createAppointment({
          ...values,
          start: appointment.start,
          end: appointment.end,
          clientId: '',
        });
      }
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to save appointment:', error);
    }
  };

  const handleDelete = async () => {
    if (appointment?.id) {
      try {
        await deleteAppointment(appointment.id);
        onOpenChange(false);
      } catch (error) {
        console.error('Failed to delete appointment:', error);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {appointment?.id ? t('appointment.edit') : t('appointment.create')}
          </DialogTitle>
        </DialogHeader>

        {appointment && (
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">
                {format(new Date(appointment.start), 'PPP')}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">
                {format(new Date(appointment.start), 'p')} -{' '}
                {format(new Date(appointment.end), 'p')}
              </span>
            </div>
          </div>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('appointment.title')}</FormLabel>
                  <FormControl>
                    <Input {...field} className="h-10" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="clientName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('appointment.clientName')}</FormLabel>
                  <FormControl>
                    <Input {...field} className="h-10" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('appointment.type')}</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t('appointment.selectType')} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="initial">
                          <Badge variant="outline" className="font-normal">
                            {t('appointment.types.initial')}
                          </Badge>
                        </SelectItem>
                        <SelectItem value="followUp">
                          <Badge variant="outline" className="font-normal">
                            {t('appointment.types.followUp')}
                          </Badge>
                        </SelectItem>
                        <SelectItem value="assessment">
                          <Badge variant="outline" className="font-normal">
                            {t('appointment.types.assessment')}
                          </Badge>
                        </SelectItem>
                        <SelectItem value="emergency">
                          <Badge variant="destructive" className="font-normal">
                            {t('appointment.types.emergency')}
                          </Badge>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('appointment.status')}</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t('appointment.selectStatus')} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {['scheduled', 'confirmed', 'cancelled', 'completed'].map(
                          (status) => (
                            <SelectItem key={status} value={status}>
                              <Badge
                                variant={
                                  status === 'cancelled'
                                    ? 'destructive'
                                    : status === 'completed'
                                    ? 'default'
                                    : 'outline'
                                }
                                className="font-normal"
                              >
                                {t(`appointment.statuses.${status}`)}
                              </Badge>
                            </SelectItem>
                          )
                        )}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            </div>

            <Separator />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('appointment.notes')}</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      className="min-h-[100px] resize-none"
                      placeholder={t('appointment.notesPlaceholder')}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="preparationInstructions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('appointment.preparationInstructions')}</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      className="min-h-[100px] resize-none"
                      placeholder={t('appointment.preparationInstructionsPlaceholder')}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="flex justify-between pt-4">
              <Button type="submit" className="px-8">
                {t('common.save')}
              </Button>
              {appointment?.id && (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleDelete}
                  className="px-8"
                >
                  {t('common.delete')}
                </Button>
              )}
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}