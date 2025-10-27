import { useEffect, useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ApiResponse } from '@/types/common';
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
import { GetAppointmentResponse, CreateAppointmentNoteRequest } from '@/types/appointment';
import { QueryClientResponse } from '@/types/client';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { CreateAppointmentRequest, UpdateAppointmentRequest } from '@/types/appointment';
import { useAppointmentStore } from '@/stores/appointment-store';
import { useClientStore } from '@/stores/client-store';
import { Check } from "lucide-react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from '@/lib/utils/utils';
import { UseMutateFunction } from '@tanstack/react-query';
import { QueryAppointmentResponse } from '@/types/appointment';
import { format, parse } from 'date-fns';

const appointmentSchema = z.object({
  clientName: z.string().min(1, 'Client name is required'),
  isNewClient: z.boolean().default(false),
  type: z.enum(['Initial', 'FollowUp', 'Assessment', 'Emergency']),
  start: z.string().min(1, 'Start time is required'),
  end: z.string().min(1, 'End time is required'),
  notes: z.string().optional(),
  preparationInstructions: z.string().optional(),
});

interface AppointmentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: Date | null;
  appointment: GetAppointmentResponse | null;
  createAppointment?: UseMutateFunction<ApiResponse<QueryAppointmentResponse>, Error, CreateAppointmentRequest, unknown>;
  updateAppointment?: UseMutateFunction<ApiResponse<void>, Error, { id: number; data: Partial<UpdateAppointmentRequest> }, unknown>;
  deleteAppointment?: UseMutateFunction<ApiResponse<void>, Error, number, unknown>;
}

// Helper function to format date to local ISO string for the form input
const formatLocalISOString = (date: Date): string => {
  return format(date, "yyyy-MM-dd'T'HH:mm");
};

// Helper function to create a Date object preserving local time but as UTC
const preserveLocalDateTime = (dateTimeString: string): Date => {
  // Parse the string in the format 'yyyy-MM-ddTHH:mm' to a Date object
  const localDate = parse(dateTimeString, "yyyy-MM-dd'T'HH:mm", new Date());
  
  // Convert to UTC for PostgreSQL timestamp with time zone column
  // This is critical - PostgreSQL only accepts UTC for timestamp with time zone
  return new Date(
    Date.UTC(
      localDate.getFullYear(),
      localDate.getMonth(),
      localDate.getDate(),
      localDate.getHours(),
      localDate.getMinutes(),
      0,
      0
    )
  );
};

export function AppointmentDialog({
  isOpen,
  onClose,
  selectedDate,
  appointment,
  createAppointment: createAppointmentMutation,
  updateAppointment: updateAppointmentMutation,
  deleteAppointment: deleteAppointmentMutation,
}: AppointmentDialogProps) {
  const { t } = useTranslation();
  // Use store as fallback for backward compatibility
  const { createAppointment: storeCreateAppointment, updateAppointment: storeUpdateAppointment, deleteAppointment: storeDeleteAppointment } = useAppointmentStore();
  const { searchClients } = useClientStore();
  const [open, setOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<QueryClientResponse | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Use mutation functions from props if provided, otherwise use store methods
  const createAppointment = createAppointmentMutation || storeCreateAppointment;
  const updateAppointment = updateAppointmentMutation ? 
    (id: number, data: Partial<UpdateAppointmentRequest>) => updateAppointmentMutation({id, data}) : 
    storeUpdateAppointment;
  const deleteAppointment = deleteAppointmentMutation || storeDeleteAppointment;

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
      type: appointment?.type ?? 'Initial',
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

  const [filteredClients, setFilteredClients] = useState<QueryClientResponse[]>([]);

  useEffect(() => {
    setSelectedClient(null);
  }, []);

  useEffect(() => {
    if (searchQuery.trim().length >= 2) {
      searchClients(searchQuery).then(results => {
        setFilteredClients(results);
      });
    } else {
      setFilteredClients([]);
    }
  }, [searchQuery, searchClients]);

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
        type: 'Initial',
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
      noteType: 'PreAppointment'
    };

    // Create dates properly preserving local time
    const startDate = preserveLocalDateTime(values.start);
    const endDate = preserveLocalDateTime(values.end);
    

    const baseAppointmentData = {
      title: `${values.clientName} - ${values.type}`,
      start: startDate,
      end: endDate,
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
      };
      updateAppointment(appointment.id, updateData);
    } else {
      const createData: CreateAppointmentRequest = {
        ...baseAppointmentData,
        status: 'Scheduled'
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
                  <Select 
                    onValueChange={(value) => field.onChange(Number(value))} 
                    value={field.value.toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t('appointment.selectType')} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Initial">{t('appointment.types.initial')}</SelectItem>
                      <SelectItem value="FollowUp">{t('appointment.types.followUp')}</SelectItem>
                      <SelectItem value="Assessment">{t('appointment.types.assessment')}</SelectItem>
                      <SelectItem value="Emergency">{t('appointment.types.emergency')}</SelectItem>
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