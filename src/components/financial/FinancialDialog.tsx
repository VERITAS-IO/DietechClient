import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import { Search, X, AlertTriangle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Financial, FinancialType, FinancialStatus, CreateFinancialRequest, UpdateFinancialRequest } from '@/types/financial';
import { DatePicker } from '../ui/date-picker';
import { useCreateFinancial, useUpdateFinancial } from '@/hooks/useFinancials';
import { useAuthStore } from '@/stores/auth-store';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useClientStore } from '@/stores/client-store';
import { Checkbox } from '@/components/ui/checkbox';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface FinancialDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  financial?: Financial | null;
  onSuccess?: () => void;
}

// Form schema
const formSchema = z.object({
  type: z.string().min(1, { message: 'Type is required' }),
  status: z.string().min(1, { message: 'Status is required' }),
  amount: z.coerce.number().positive({ message: 'Amount must be positive' }),
  date: z.date({ required_error: 'Date is required' }),
  description: z.string().min(1, { message: 'Description is required' }).max(500, { message: 'Description is too long' }),
  clientId: z.number().optional(),
  subject: z.string().optional(),
  isClient: z.boolean().default(false),
});

// Form values type
type FormValues = z.infer<typeof formSchema>;

export const FinancialDialog: React.FC<FinancialDialogProps> = ({
  open,
  onOpenChange,
  financial,
  onSuccess,
}) => {
  const { t } = useTranslation();
  const isEditing = !!financial;
  const [prevStatus, setPrevStatus] = useState<FinancialStatus | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [commandOpen, setCommandOpen] = useState(false);
  const { searchClients } = useClientStore();
  const [searchResults, setSearchResults] = useState<Array<{id: number, fullName: string}>>([]);
  const { user } = useAuthStore();
  const [error, setError] = useState<string | null>(null);

  // Use mutations
  const createFinancialMutation = useCreateFinancial();
  const updateFinancialMutation = useUpdateFinancial();
  const isLoading = createFinancialMutation.isPending || updateFinancialMutation.isPending;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: FinancialType.Income,
      status: FinancialStatus.Pending,
      amount: 0,
      date: new Date(),
      description: '',
      clientId: undefined,
      subject: undefined,
      isClient: false,
    },
  });

  useEffect(() => {
    if (!user?.dieticianId) {
      setError('DieticianId is not available in your profile. Please contact support.');
    } else {
      setError(null);
    }
  }, [user]);

  // Track status changes
  useEffect(() => {
    if (financial) {
      setPrevStatus(financial.status as FinancialStatus);
    }
  }, [financial]);

  // Reset form when dialog opens/closes or financial changes
  useEffect(() => {
    if (open) {
      if (financial) {
        form.reset({
          type: financial.type,
          status: financial.status,
          amount: financial.amount,
          date: new Date(financial.date),
          description: financial.description,
          clientId: financial.clientId,
          subject: financial.subject,
          isClient: !!financial.clientId,
        });
      } else {
        form.reset({
          type: FinancialType.Income,
          status: FinancialStatus.Pending,
          amount: 0,
          date: new Date(),
          description: '',
          clientId: undefined,
          subject: undefined,
          isClient: false,
        });
      }
    } else {
      // Reset form when dialog closes
      form.reset({
        type: FinancialType.Income,
        status: FinancialStatus.Pending,
        amount: 0,
        date: new Date(),
        description: '',
        clientId: undefined,
        subject: undefined,
        isClient: false,
      });
      setSearchQuery('');
      setSearchResults([]);
    }
  }, [open, financial, form]);

  // Handle client search
  useEffect(() => {
    if (searchQuery.trim().length >= 2) {
      const results = searchClients(searchQuery);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, searchClients]);

  // Handle isClient checkbox change
  const handleIsClientChange = (checked: boolean) => {
    form.setValue('isClient', checked);
    if (!checked) {
      // If not a client, clear clientId
      form.setValue('clientId', undefined);
    } else {
      // If a client, clear subject
      form.setValue('subject', undefined);
    }
  };

  // Handle client selection
  const handleClientSelect = (clientId: string) => {
    form.setValue('clientId', parseInt(clientId));
    setCommandOpen(false);
    
    // Find the selected client to display name
    const selectedClient = searchResults.find(client => client.id.toString() === clientId);
    if (selectedClient) {
      setSearchQuery(selectedClient.fullName);
    }
  };

  // Handle status change
  const handleStatusChange = (newStatus: string) => {
    // If changing from PENDING to COMPLETED, update the date to today
    if (
      prevStatus === FinancialStatus.Pending && 
      newStatus === FinancialStatus.Completed &&
      // Only for income-related transactions
      (form.getValues('type') === FinancialType.Income ||
       form.getValues('type') === FinancialType.Consultation ||
       form.getValues('type') === FinancialType.Appointment ||
       form.getValues('type') === FinancialType.Other)
    ) {
      form.setValue('date', new Date());
    }
    form.setValue('status', newStatus);
  };

  // Handle form submission
  const onSubmit = async (values: FormValues) => {
    try {
      if (!user?.dieticianId) {
        setError('DieticianId is required but not available in your profile');
        return;
      }

      const { isClient, ...formData } = values;
      
      if (isEditing && financial) {
        // Update existing financial
        const updateData: UpdateFinancialRequest = {
          id: financial.id,
          type: formData.type as FinancialType,
          status: formData.status as FinancialStatus,
          amount: formData.amount,
          description: formData.description
        };
        await updateFinancialMutation.mutateAsync(updateData);
      } else {
        // Create new financial
        const createData: CreateFinancialRequest = {
          type: formData.type as FinancialType,
          status: formData.status as FinancialStatus,
          amount: formData.amount,
          date: formData.date,
          description: formData.description,
          clientId: isClient ? formData.clientId : undefined,
          subject: !isClient ? formData.subject : undefined,
          dieticianId: user.dieticianId,
          tenantId: user.tenantId
        };
        await createFinancialMutation.mutateAsync(createData);
      }
      
      onSuccess?.();
      onOpenChange(false);
    } catch (error) {
      console.error('Error submitting form:', error);
      setError(error instanceof Error ? error.message : 'An error occurred while saving');
    }
  };

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      if (!newOpen) {
        // Reset form when dialog is closed
        form.reset({
          type: FinancialType.Income,
          status: FinancialStatus.Pending,
          amount: 0,
          date: new Date(),
          description: '',
          clientId: undefined,
          subject: undefined,
          isClient: false,
        });
        setSearchQuery('');
        setSearchResults([]);
      }
      onOpenChange(newOpen);
    }}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? t('financial.editTransaction') : t('financial.addTransaction')}
          </DialogTitle>
        </DialogHeader>
        
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>{t('common.error')}</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Type */}
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('financial.form.type')}</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t('financial.form.type')} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.values(FinancialType).filter(type => type !== FinancialType.Unknown).map((type) => (
                        <SelectItem key={type} value={type}>
                          {t(`financial.type.${type.toLowerCase()}`)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Status */}
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('financial.form.status')}</FormLabel>
                  <Select
                    onValueChange={handleStatusChange}
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t('financial.form.status')} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.values(FinancialStatus).filter(status => status !== FinancialStatus.Unknown).map((status) => (
                        <SelectItem key={status} value={status}>
                          {t(`financial.status.${status.toLowerCase()}`)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Subject is a client checkbox */}
            <FormField
              control={form.control}
              name="isClient"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={(checked) => {
                        field.onChange(checked);
                        handleIsClientChange(!!checked);
                      }}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      {t('financial.form.isClientSubject')}
                    </FormLabel>
                  </div>
                </FormItem>
              )}
            />

            {/* Client Search or Subject Input */}
            {form.watch('isClient') ? (
              <FormField
                control={form.control}
                name="clientId"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>{t('financial.form.client')}</FormLabel>
                    <Popover open={commandOpen} onOpenChange={setCommandOpen}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <div className="relative">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                              placeholder={t('client.search')}
                              className="pl-8"
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              onClick={() => setCommandOpen(true)}
                            />
                            {searchQuery && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-full px-3"
                                onClick={() => {
                                  setSearchQuery('');
                                  form.setValue('clientId', undefined);
                                }}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="p-0" align="start">
                        <Command>
                          <CommandInput 
                            placeholder={t('client.search')} 
                            value={searchQuery}
                            onValueChange={setSearchQuery}
                          />
                          <CommandEmpty>{t('client.noClients')}</CommandEmpty>
                          <CommandGroup>
                            {searchResults.map((client) => (
                              <CommandItem
                                key={client.id}
                                onSelect={() => handleClientSelect(client.id.toString())}
                                className="cursor-pointer"
                              >
                                {client.fullName}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ) : (
              <FormField
                control={form.control}
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('financial.form.subject')}</FormLabel>
                    <FormControl>
                      <Input 
                        {...field}
                        placeholder={t('financial.form.subjectPlaceholder')}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Amount */}
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('financial.form.amount')}</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      {...field}
                      value={field.value === 0 ? '' : field.value}
                      onChange={(e) => {
                        // Remove any leading zeros and convert to number
                        const value = e.target.value.replace(/^0+/, '') || '0';
                        field.onChange(parseFloat(value) || 0);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Date */}
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>{t('financial.form.date')}</FormLabel>
                  <DatePicker
                    value={field.value}
                    onChange={field.onChange}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('financial.form.description')}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={t('financial.form.description')}
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                {t('common.cancel')}
              </Button>
              <Button
                type="submit"
                disabled={isLoading || !user?.dieticianId}
              >
                {isLoading
                  ? t('common.saving')
                  : isEditing
                  ? t('financial.editTransaction')
                  : t('common.save')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}; 