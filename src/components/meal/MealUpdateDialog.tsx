import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMealStore } from '@/stores/meal-store';
import { useGetMeal, useUpdateMeal } from '@/hooks/meal-hooks';
import { MealType, MealOrder, UpdateMealRequest } from '@/types/meal';
import { CreateNutritionInfoRequest, FoodCategory, ServingUnit } from '@/types/nutrition';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { useEffect } from 'react';
import { format, parse, formatISO } from 'date-fns';
import { t } from 'i18next';

const formSchema = z.object({
  name: z.string().min(1, { message: t('validation.required') }),
  description: z.string().optional(),
  mealType: z.string().min(1, { message: t('validation.required') }),
  mealOrder: z.string().min(1, { message: t('validation.required') }).default('1'),
  startTime: z.string().min(1, { message: t('validation.required') }),
  endTime: z.string().min(1, { message: t('validation.required') }),
  dietId: z.number().optional(),
  nutritionInfoIds: z.array(z.number()).optional(),
  newNutritionInfos: z.array(
    z.object({
      name: z.string().min(1, { message: t('validation.required') }),
      description: z.string().optional(),
      totalCalories: z.number().min(0).optional(),
      proteinPerServing: z.number().min(0).optional(),
      carbsPerServing: z.number().min(0).optional(),
      fatPerServing: z.number().min(0).optional(),
      servingSize: z.number().min(0).optional()
      // Note: foodCategory and servingUnit will be set with defaults
    })
  ).optional()
});

type FormValues = z.infer<typeof formSchema>;

// Helper function to create a Date object preserving local time but as UTC
const preserveLocalDateTime = (timeString: string): Date => {
  // Create today's date
  const today = new Date();
  const dateString = format(today, "yyyy-MM-dd");
  
  // Parse the time string to create a full datetime
  const localDate = parse(`${dateString}T${timeString}`, "yyyy-MM-dd'T'HH:mm", new Date());
  
  // Convert to UTC for PostgreSQL timestamp with time zone column
  return new Date(
    Date.UTC(
      localDate.getFullYear(),
      localDate.getMonth(),
      localDate.getDate(),
      localDate.getHours(),
      localDate.getMinutes(),
      0, 0
    )
  );
};

export default function MealUpdateDialog() {
  const { t } = useTranslation();
  const { toast } = useToast();
  
  // State is managed by the store
  const isEditMode = useMealStore((state) => state.isEditMode);
  const setEditMode = useMealStore((state) => state.setEditMode);
  const selectedMealId = useMealStore((state) => state.selectedMealId);
  
  const { data: meal, isLoading: isMealLoading } = useGetMeal(selectedMealId || 0, {
    enabled: !!selectedMealId && isEditMode
  });
  const { mutate: updateMeal, isPending } = useUpdateMeal();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      mealType: '',
      mealOrder: '1',
      startTime: '',
      endTime: '',
      nutritionInfoIds: [],
      newNutritionInfos: []
    }
  });

  // Populate form when meal data is loaded
  useEffect(() => {
    if (meal) {
      const startTimeString = format(new Date(meal.startTime), 'HH:mm');
      const endTimeString = format(new Date(meal.endTime), 'HH:mm');
      
      form.reset({
        name: meal.name,
        description: meal.description,
        mealType: meal.mealType,
        mealOrder: meal.mealOrder,
        startTime: startTimeString,
        endTime: endTimeString,
        dietId: meal.dietId,
        nutritionInfoIds: meal.nutritionInfoList?.map(info => info.id) || []
      });
    }
  }, [meal, form]);

  const onSubmit = (data: FormValues) => {
    if (!selectedMealId) return;
    
    // Create dates properly preserving local time as UTC
    const startTime = data.startTime ? preserveLocalDateTime(data.startTime) : undefined;
    const endTime = data.endTime ? preserveLocalDateTime(data.endTime) : undefined;

    const updateRequest: UpdateMealRequest = {
      name: data.name,
      description: data.description || '',
      mealType: data.mealType as MealType,
      mealOrder: data.mealOrder as MealOrder,
      startTime: startTime?.toISOString(),
      endTime: endTime?.toISOString(),
      dietId: data.dietId,
      nutritionInfoIdsToAdd: data.nutritionInfoIds || [],
      nutritionInfoIdsToRemove: [],
      newNutritionInfosToAdd: data.newNutritionInfos?.map(info => {
        const nutritionInfo: CreateNutritionInfoRequest = {
          name: info.name,
          servingSize: info.servingSize || 100,
          servingUnit: ServingUnit.Grams, // Default to grams
          foodCategory: FoodCategory.Unknown, // Default to unknown
          totalCalories: info.totalCalories,
          protein: info.proteinPerServing,
          carbohydrates: info.carbsPerServing,
          totalFat: info.fatPerServing
        };
        return nutritionInfo;
      }) || []
    };
    
    updateMeal({
      id: selectedMealId,
      request: updateRequest
    }, {
      onSuccess: () => {
        toast({
          title: t('meal.updateSuccess'),
          variant: 'default'
        });
        setEditMode(false);
        form.reset();
      },
      onError: (error) => {
        toast({
          title: t('meal.updateError'),
          description: error.message,
          variant: 'destructive'
        });
      }
    });
  };

  return (
    <Dialog open={isEditMode} onOpenChange={setEditMode}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{t('meal.update')}</DialogTitle>
        </DialogHeader>
        {isMealLoading ? (
          <div className="flex flex-col items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="mt-2">{t('common.loading')}</span>
          </div>
        ) : (
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
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t('meal.selectType')} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.entries(MealType)
                          .filter(([key]) => key !== 'Unknown')
                          .map(([key, value]) => (
                            <SelectItem key={key} value={value}>
                              {t(`meal.types.${value.toLowerCase()}`)}
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
                name="mealOrder"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('meal.order')}</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t('meal.selectOrder')} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.entries(MealOrder)
                          .filter(([key]) => key !== 'Unknown' && key !== 'Custom')
                          .map(([key, value]) => (
                            <SelectItem key={key} value={value}>
                              {t(`meal.orders.${value.toLowerCase()}`)}
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
                name="startTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('meal.startTime')}</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="endTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('meal.endTime')}</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Note: In a real implementation, you would add UI for managing nutrition info items */}
              {/* This would include adding existing nutrition info items and creating new ones */}
              {/* For example, a multi-select dropdown for existing items and a button to add new ones */}
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setEditMode(false)}>
                  {t('common.cancel')}
                </Button>
                <Button type="submit" disabled={isPending}>
                  {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {t('common.save')}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}
