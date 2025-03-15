import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
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
import { useCreateFinancial, useUpdateFinancial } from '@/hooks/useFinancials';
import { DatePicker } from '../ui/date-picker';

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
  clientId: z.string().optional(),
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
  const createFinancial = useCreateFinancial();
  const updateFinancial = useUpdateFinancial();
  const isEditing = !!financial;

  // Initialize form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: '',
      status: '',
      amount: 0,
      date: new Date(),
      description: '',
      clientId: undefined,
    },
  });

  // Reset form when financial changes
  useEffect(() => {
    if (financial) {
      form.reset({
        type: financial.type,
        status: financial.status,
        amount: financial.amount,
        date: new Date(financial.date),
        description: financial.description,
        clientId: financial.clientId,
      });
    } else {
      form.reset({
        type: FinancialType.Income,
        status: FinancialStatus.Pending,
        amount: 0,
        date: new Date(),
        description: '',
        clientId: undefined,
      });
    }
  }, [financial, form]);

  // Handle form submission
  const onSubmit = async (values: FormValues) => {
    try {
      if (isEditing && financial) {
        // Update existing financial
        const updateData: UpdateFinancialRequest = {
          id: financial.id,
          type: values.type as FinancialType,
          status: values.status as FinancialStatus,
          amount: values.amount,
          date: format(values.date, 'yyyy-MM-dd'),
          description: values.description,
          clientId: values.clientId,
        };
        await updateFinancial.mutateAsync(updateData);
      } else {
        // Create new financial
        const createData: CreateFinancialRequest = {
          type: values.type as FinancialType,
          status: values.status as FinancialStatus,
          amount: values.amount,
          date: format(values.date, 'yyyy-MM-dd'),
          description: values.description,
          clientId: values.clientId,
        };
        await createFinancial.mutateAsync(createData);
      }
      
      onSuccess?.();
      onOpenChange(false);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? t('financial.editTransaction') : t('financial.addTransaction')}
          </DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Type */}
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('financial.type')}</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t('financial.type')} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.values(FinancialType).map((type) => (
                        <SelectItem key={type} value={type}>
                          {t(`financial.${type.toLowerCase()}`)}
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
                  <FormLabel>{t('financial.status')}</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t('financial.status')} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.values(FinancialStatus).map((status) => (
                        <SelectItem key={status} value={status}>
                          {t(`financial.${status.toLowerCase()}`)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Amount */}
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('financial.amount')}</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
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
                  <FormLabel>{t('financial.date')}</FormLabel>
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
                  <FormLabel>{t('financial.description')}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={t('financial.description')}
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
                disabled={createFinancial.isPending || updateFinancial.isPending}
              >
                {createFinancial.isPending || updateFinancial.isPending
                  ? t('common.saving')
                  : isEditing
                  ? t('common.update')
                  : t('common.save')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}; 