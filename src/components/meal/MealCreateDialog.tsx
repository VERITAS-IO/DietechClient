import { useState, useEffect } from 'react';
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
import NutritionSearch from '../nutrition/NutritionSearch';
import { NutritionInfoCreate } from '../nutrition/NutritionInfoCreate';
import { CreateNutritionInfoRequest, NutritionInfoDetail } from '@/types/nutrition';
import { Separator } from '@/components/ui/separator';
import { t } from 'i18next';

const formSchema = z.object({
  name: z.string().min(1, { message: t('validation.required') }),
  description: z.string().optional(),
  mealType: z.string().min(1, { message: t('validation.required') }),
  mealOrder: z.string().min(1, { message: t('validation.required') }).default('1'),
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

  // State for nutrition management
  const [selectedNutritionIds, setSelectedNutritionIds] = useState<number[]>([]);
  const [newNutritionInfoRequests, setNewNutritionInfoRequests] = useState<CreateNutritionInfoRequest[]>([]);
  const [isNutritionCreateOpen, setIsNutritionCreateOpen] = useState(false);

  // Reset nutrition create modal state when meal create dialog is closed
  useEffect(() => {
    if (!createMealModalOpen) {
      setIsNutritionCreateOpen(false);
    }
  }, [createMealModalOpen]);

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

  const handleSelectNutrition = (nutritionId: number) => {
    setSelectedNutritionIds(prev => [...prev, nutritionId]);
  };

  const handleRemoveNutrition = (nutritionId: number) => {
    setSelectedNutritionIds(prev => prev.filter(id => id !== nutritionId));
  };

  const handleAddNewNutrition = () => {
    setIsNutritionCreateOpen(true);
  };

  const handleNutritionCreated = (
    nutritionInfo: NutritionInfoDetail | CreateNutritionInfoRequest,
    id?: number
  ) => {
    if (id) {
      // If we have an ID, it was successfully created in the backend
      setSelectedNutritionIds(prev => [...prev, id]);
    } else {
      // Otherwise, add it to our local new nutrition requests
      setNewNutritionInfoRequests(prev => [...prev, nutritionInfo as CreateNutritionInfoRequest]);
    }
  };

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
      nutritionInfoIds: selectedNutritionIds,
      newNutritionInfoRequests: newNutritionInfoRequests.length > 0 ? newNutritionInfoRequests : undefined
    };
    
    if (forDietCreation || forDietUpdate) {
      // Add meal to temporary meals for both diet creation and updates
      addTemporaryMeal(mealRequest); 
      toast({
        title: t('meal.addedToDiet'),
        description: t('meal.addedToDietDescription'),
        variant: 'default'
      });
      
      // Reset the form but keep the dialog open to allow adding multiple meals
      form.reset({
        name: '',
        description: '',
        mealType: '',
        mealOrder: '1',
        time: '',
        nutritionInfoIds: []
      });
      
      // Reset nutrition state
      setSelectedNutritionIds([]);
      setNewNutritionInfoRequests([]);
      
      // Optionally, add a button to close the dialog after adding meals
    } else {
      createMeal(mealRequest, {
        onSuccess: () => {
          toast({
            title: t('meal.createSuccess'),
            variant: 'default'
          });
          setCreateMealModalOpen(false);
          form.reset();
          setSelectedNutritionIds([]);
          setNewNutritionInfoRequests([]);
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
    <>
      <Dialog 
        open={createMealModalOpen} 
        onOpenChange={(open) => {
          // Only close if we're not opening the nutrition create modal
          if (!isNutritionCreateOpen) {
            setCreateMealModalOpen(open);
          }
        }}
      >
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t('meal.create')}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={(e) => {
              e.preventDefault();
              // Only submit if we're not opening the nutrition create modal
              if (!isNutritionCreateOpen) {
                form.handleSubmit(onSubmit)(e);
              }
            }} className="space-y-4">
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
              
              <Separator className="my-4" />
              
              <div>
                <h3 className="text-lg font-medium mb-2">{t('nutrition.title')}</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {t('nutrition.mealDescription')}
                </p>
                
                <NutritionSearch 
                  selectedNutritionIds={selectedNutritionIds}
                  onSelectNutrition={handleSelectNutrition}
                  onRemoveNutrition={handleRemoveNutrition}
                  onAddNewNutrition={handleAddNewNutrition}
                />
                
                {newNutritionInfoRequests.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium mb-2">{t('nutrition.newItems')}</h4>
                    <div className="flex flex-wrap gap-2">
                      {newNutritionInfoRequests.map((item, index) => (
                        <div 
                          key={`new-nutrition-${index}`}
                          className="bg-primary/10 text-primary rounded-md px-3 py-1 text-sm flex items-center"
                        >
                          <span>{item.name}</span>
                          <button
                            className="ml-2 rounded-full hover:bg-primary/20 p-0.5"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setNewNutritionInfoRequests(prev => 
                                prev.filter((_, i) => i !== index)
                              );
                            }}
                            type="button"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <line x1="18" y1="6" x2="6" y2="18"></line>
                              <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <DialogFooter className="pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setCreateMealModalOpen(false);
                  }}
                >
                  {forDietCreation || forDietUpdate ? t('common.done') : t('common.cancel')}
                </Button>
                <Button 
                  type="submit" 
                  disabled={isPending}
                  onClick={(e) => {
                    if (isNutritionCreateOpen) {
                      e.preventDefault();
                      e.stopPropagation();
                    }
                  }}
                >
                  {isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t('common.saving')}
                    </>
                  ) : (
                    forDietCreation || forDietUpdate ? t('meal.addToDiet') : t('common.create')
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      <div className="relative z-50">
        <NutritionInfoCreate 
          isOpen={isNutritionCreateOpen}
          onOpenChange={setIsNutritionCreateOpen}
          onNutritionCreated={handleNutritionCreated}
        />
      </div>
    </>
  );
}
