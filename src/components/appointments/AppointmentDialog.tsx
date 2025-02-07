import { useEffect, useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { useTranslation } from 'react-i18next';
import { Appointment, CreateAppointmentNoteRequest, NoteType } from '@/types/appointment';
import { QueryClientResponse } from '@/types/client';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { AppointmentType, AppointmentStatus, CreateAppointmentRequest, UpdateAppointmentRequest } from '@/types/appointment';
import { useAppointmentStore } from '@/stores/appointment-store';
import { useClientStore } from '@/stores/client-store';
import { Check } from "lucide-react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from '@/lib/utils/utils';

const appointmentSchema = z.object({
  clientName: z.string().min(1, 'Client name is required'),
  isNewClient: z.boolean().default(false),
  type: z.nativeEnum(AppointmentType),
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

// Helper function to format date to local ISO string without timezone offset
const formatLocalISOString = (date: Date): string => {
  const offset = date.getTimezoneOffset();
  const adjustedDate = new Date(date.getTime() - (offset * 60 * 1000));
  return adjustedDate.toISOString().slice(0, 16);
};

// Helper function to parse local datetime string to UTC Date
const parseLocalDateTime = (dateTimeString: string): Date => {
  const date = new Date(dateTimeString);
  const offset = date.getTimezoneOffset();
  return new Date(date.getTime() + (offset * 60 * 1000));
};

export function AppointmentDialog({
  isOpen,
  onClose,
  selectedDate,
  appointment,
}: AppointmentDialogProps) {
  const { t } = useTranslation();
  const { createAppointment, updateAppointment, deleteAppointment, appointments } = useAppointmentStore();
  const { searchClients } = useClientStore();
  const [open, setOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<QueryClientResponse | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      document.documentElement.style.setProperty('--trigger-width', `${inputRef.current.offsetWidth}px`);
    }
  }, [isOpen]);

  const form = useForm<z.infer<typeof appointmentSchema>>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      clientName: appointment?.clientName ?? '',
      isNewClient: false,
      type: appointment?.type ?? AppointmentType.Initial,
      start: appointment?.start 
        ? formatLocalISOString(new Date(appointment.start))
        : selectedDate 
          ? formatLocalISOString(selectedDate)
          : formatLocalISOString(new Date()),
      end: appointment?.end 
        ? formatLocalISOString(new Date(appointment.end))
        : selectedDate 
          ? formatLocalISOString(new Date(selectedDate.getTime() + 3600000))
          : formatLocalISOString(new Date(new Date().getTime() + 3600000)),
      notes: appointment?.appointmentNotes?.map(note => note.note).join('\n') ?? '',
      preparationInstructions: appointment?.preparationInstructions ?? '',
    },
  });

  useEffect(() => {
    setSelectedClient(null);
  }, []);

  const filteredClients = searchClients(searchQuery);

  const handleClientSelect = (client: QueryClientResponse) => {
    setSelectedClient(client);
    form.setValue('clientName', client.fullName);
    setOpen(false);
  };

  useEffect(() => {
    if (appointment) {
      form.reset({
        clientName: appointment.clientName,
        isNewClient: false,
        type: appointment.type,
        start: formatLocalISOString(new Date(appointment.start)),
        end: formatLocalISOString(new Date(appointment.end)),
        notes: appointment.appointmentNotes?.map(note => note.note).join('\n') || '',
        preparationInstructions: appointment.preparationInstructions || '',
      });
    } else if (selectedDate) {
      const endDate = new Date(selectedDate);
      endDate.setHours(endDate.getHours() + 1);
      form.reset({
        clientName: '',
        isNewClient: false,
        type: AppointmentType.Initial,
        start: formatLocalISOString(selectedDate),
        end: formatLocalISOString(endDate),
        notes: '',
        preparationInstructions: '',
      });
    }
  }, [appointment, selectedDate, form]);

  const onSubmit = (values: z.infer<typeof appointmentSchema>) => {
    const note: CreateAppointmentNoteRequest = {
      note: values.notes ?? '',
      noteType: NoteType.PreAppointment
    };

    const baseAppointmentData = {
      title: `${values.clientName} - ${values.type}`,
      start: parseLocalDateTime(values.start),
      end: parseLocalDateTime(values.end),
      clientId: selectedClient ? selectedClient.id : undefined,
      clientName: values.clientName,
      type: values.type,
      preparationInstructions: values.preparationInstructions,
      note: note
    };

    if (appointment) {
      const updateData: UpdateAppointmentRequest = {
        ...baseAppointmentData,
        status: appointment.status,
        appointmentId: appointment.id
      };
      updateAppointment(appointment.id, updateData);
    } else {
      const createData: CreateAppointmentRequest = {
        ...baseAppointmentData,
        status: AppointmentStatus.Scheduled
      };
      createAppointment(createData);
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
            {appointment ? t('appointment.edit') : t('appointment.create')}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <style dangerouslySetInnerHTML={{
              __html: `
                .w-\\[--trigger-width\\] {
                  width: var(--trigger-width) !important;
                }
              `
            }} />
            <FormField
              control={form.control}
              name="isNewClient"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={(checked) => {
                        field.onChange(checked);
                        if (checked) {
                          setSelectedClient(null);
                          form.setValue('clientName', '');
                        }
                      }}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>{t('appointment.newClient')}</FormLabel>
                  </div>
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
                    {form.watch('isNewClient') ? (
                      <Input 
                        {...field} 
                        placeholder={t('appointment.enterClientName')}
                      />
                    ) : (
                      <Popover open={open} onOpenChange={setOpen}>
                        <PopoverTrigger asChild>
                          <Input 
                            {...field}
                            ref={inputRef}
                            placeholder={t('appointment.searchExistingClient')}
                          />
                        </PopoverTrigger>
                        <PopoverContent align="start" className="p-0" style={{ width: 'var(--radix-popover-trigger-width)' }}>
                          <Command className="w-full">
                            <CommandInput
                              placeholder={t('appointment.searchClient')}
                              value={searchQuery}
                              onValueChange={setSearchQuery}
                            />
                            <CommandEmpty>
                              <p className="p-2">{t('appointment.noClientsFound')}</p>
                            </CommandEmpty>
                            <CommandGroup>
                              {filteredClients.map((client) => (
                                <CommandItem
                                  key={client.id}
                                  onSelect={() => handleClientSelect(client)}
                                >
                                  <div className="flex items-center">
                                    <Check className={cn(
                                      "mr-2 h-4 w-4",
                                      selectedClient?.id === client.id ? "opacity-100" : "opacity-0"
                                    )} />
                                    <span>{client.fullName}</span>
                                  </div>
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    )}
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
                  <FormLabel>{t('appointment.type')}</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value.toString()}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t('appointment.selectType')} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={AppointmentType.Initial.toString()}>{t('appointment.types.initial')}</SelectItem>
                      <SelectItem value={AppointmentType.FollowUp.toString()}>{t('appointment.types.followUp')}</SelectItem>
                      <SelectItem value={AppointmentType.Assessment.toString()}>{t('appointment.types.assessment')}</SelectItem>
                      <SelectItem value={AppointmentType.Emergency.toString()}>{t('appointment.types.emergency')}</SelectItem>
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
                    <FormLabel>{t('appointment.startTime')}</FormLabel>
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
                    <FormLabel>{t('appointment.endTime')}</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {!appointment && (
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('appointment.notes.add')}</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="preparationInstructions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('appointment.preparationInstructions')}</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-between">
              <Button type="submit">
                {appointment ? t('common.save') : t('common.create')}
              </Button>
              {appointment && (
                <Button type="button" variant="destructive" onClick={handleDelete}>
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