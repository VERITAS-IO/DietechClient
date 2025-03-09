import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMealStore } from '@/stores/meal-store';
import { useGetMeal, useUpdateMeal } from '@/hooks/meal-hooks';
import { MealType, UpdateMealRequest } from '@/types/meal';
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
import { format } from 'date-fns';

const formSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  description: z.string().optional(),
  mealType: z.string().min(1, { message: 'Meal type is required' }),
  mealOrder: z.string().min(1, { message: 'Meal order is required' }).default('1'),
  time: z.string().optional(),
  dietId: z.number().optional(),
  nutritionInfoIds: z.array(z.number()).optional(),
  newNutritionInfos: z.array(
    z.object({
      name: z.string().min(1, { message: 'Nutrition info name is required' }),
      description: z.string().optional(),
      caloriesPerServing: z.number().min(0).optional(),
      proteinPerServing: z.number().min(0).optional(),
      carbsPerServing: z.number().min(0).optional(),
      fatPerServing: z.number().min(0).optional(),
      servingSize: z.number().min(0).optional()
      // Note: foodCategory and servingUnit will be set with defaults
    })
  ).optional()
});

type FormValues = z.infer<typeof formSchema>;

export default function MealUpdateDialog() {
  const { t } = useTranslation();
  const { toast } = useToast();
  
  // State is managed by the store
  const isEditMode = useMealStore((state) => state.isEditMode);
  const setEditMode = useMealStore((state) => state.setEditMode);
  const selectedMealId = useMealStore((state) => state.selectedMealId);
  
  const { data: meal, isLoading: isMealLoading } = useGetMeal(selectedMealId || 0);
  const { mutate: updateMeal, isPending } = useUpdateMeal();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      mealType: '',
      mealOrder: '1',
      time: '',
      nutritionInfoIds: [],
      newNutritionInfos: []
    }
  });

  // Populate form when meal data is loaded
  useEffect(() => {
    if (meal) {
      const timeString = format(new Date(meal.startTime), 'HH:mm');
      
      form.reset({
        name: meal.name,
        description: meal.description,
        mealType: meal.mealType.toString(),
        mealOrder: meal.mealOrder.toString(),
        time: timeString,
        dietId: meal.dietId,
        nutritionInfoIds: meal.nutritionInfoList?.map(info => info.id) || []
      });
    }
  }, [meal, form]);

  const onSubmit = (data: FormValues) => {
    if (!selectedMealId) return;

    // Convert form data to match the UpdateMealRequest interface
    const updateRequest: UpdateMealRequest = {
      name: data.name,
      description: data.description || '',
      mealType: parseInt(data.mealType),
      mealOrder: parseInt(data.mealOrder),
      startTime: data.time ? `2025-01-01T${data.time}:00` : undefined,
      endTime: data.time ? `2025-01-01T${data.time}:00` : undefined,
      dietId: data.dietId,
      nutritionInfoIdsToAdd: data.nutritionInfoIds || [],
      nutritionInfoIdsToRemove: [],
      newNutritionInfosToAdd: data.newNutritionInfos?.map(info => {
        const nutritionInfo: CreateNutritionInfoRequest = {
          name: info.name,
          servingSize: info.servingSize || 100,
          servingUnit: ServingUnit.Grams, // Default to grams
          foodCategory: FoodCategory.Unknown, // Default to unknown
          caloriesPerServing: info.caloriesPerServing,
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
                name="mealOrder"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('meal.order')}</FormLabel>
                    <FormControl>
                      <Input type="number" min="1" max="10" {...field} />
                    </FormControl>
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
