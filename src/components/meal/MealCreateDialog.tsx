
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMealStore } from '@/stores/meal-store';
import { useDietStore } from '@/stores/diet-store';
import { useCreateMeal } from '@/hooks/meal-hooks';
import { MealType } from '@/types/meal';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

const formSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  description: z.string().optional(),
  mealType: z.string().min(1, { message: 'Meal type is required' }),
  mealOrder: z.string().min(1, { message: 'Meal order is required' }).default('1'),
  time: z.string().optional(),
  dietId: z.number().optional(),
  nutritionInfoIds: z.array(z.number()).optional()
});

type FormValues = z.infer<typeof formSchema>;

interface MealCreateDialogProps {
  forDietCreation?: boolean;
  forDietUpdate?: boolean;
}

export default function MealCreateDialog({ forDietCreation = false, forDietUpdate = false }: MealCreateDialogProps) {
  const { t } = useTranslation();
  const { toast } = useToast();
  
  const createMealModalOpen = forDietCreation || forDietUpdate
    ? useDietStore((state) => state.isMealCreateModalOpen)
    : useMealStore((state) => state.createMealModalOpen);
    
  const setCreateMealModalOpen = forDietCreation || forDietUpdate
    ? useDietStore((state) => state.setMealCreateModalOpen)
    : useMealStore((state) => state.setCreateMealModalOpen);
    
  const addTemporaryMeal = useDietStore((state) => state.addTemporaryMeal);
  const { mutate: createMeal, isPending } = useCreateMeal();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      mealType: '',
      mealOrder: '1',
      time: '',
      nutritionInfoIds: []
    }
  });

  const onSubmit = (data: FormValues) => {
    const mealRequest = {
      name: data.name,
      description: data.description || '',
      mealType: parseInt(data.mealType),
      mealOrder: parseInt(data.mealOrder),
      startTime: data.time ? `2025-01-01T${data.time}:00` : new Date().toISOString(),
      endTime: data.time ? `2025-01-01T${data.time}:00` : new Date().toISOString(),
      dietId: data.dietId || 1, 
      tenantId: 1, 
      nutritionInfoIds: data.nutritionInfoIds || []
    };
    
    if (forDietCreation || forDietUpdate) {
      // Add meal to temporary meals for both diet creation and updates
      addTemporaryMeal(mealRequest); 
      toast({
        title: t('meal.addedToDiet'),
        description: t('meal.addedToDietDescription'),
        variant: 'default'
      });
      setCreateMealModalOpen(false);
      form.reset();
    } else {
      createMeal(mealRequest, {
        onSuccess: () => {
          toast({
            title: t('meal.createSuccess'),
            variant: 'default'
          });
          setCreateMealModalOpen(false);
          form.reset();
        },
        onError: (error) => {
          toast({
            title: t('meal.createError'),
            description: error.message,
            variant: 'destructive'
          });
        }
      });
    }
  };

  return (
    <Dialog open={createMealModalOpen} onOpenChange={setCreateMealModalOpen}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{t('meal.create')}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('meal.name')}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('meal.description')}</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="mealType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('meal.type')}</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t('meal.selectType')} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.keys(MealType)
                        .filter(key => !isNaN(Number(key)))
                        .map(key => (
                          <SelectItem key={key} value={key}>
                            {t(`meal.types.${MealType[Number(key)].toLowerCase()}`)}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('meal.time')}</FormLabel>
                  <FormControl>
                    <Input type="time" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setCreateMealModalOpen(false)}>
                {t('common.cancel')}
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {t('common.save')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
