import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from "@/components/ui/button";
import { useGetDiet, useUpdateDiet } from '@/hooks/diet-hooks';
import { useDietStore } from '@/stores/diet-store';
import { DietType, UpdateDietRequest } from '@/types/diet';
import { useForm } from 'react-hook-form';
import { Loader2 } from 'lucide-react';
import BaseDietDialog from './BaseDietDialog';
import DietMealList from './DietMealList';
import MealCreateDialog from '../meal/MealCreateDialog';
import { toast } from 'sonner';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import MealDeleteDialog from '../meal/MealDeleteDialog';
import { useMealStore } from '@/stores/meal-store';

interface DietFormValues {
    name: string;
    description: string;
    type: DietType;
    duration: number;
    calories: number;
    startDate?: string;
    endDate?: string;
    isActive?: boolean;
}

export default function DietDetailDialog() {
    const { t } = useTranslation();
    const {
        selectedDietId,
        isDetailModalOpen,
        setDetailModalOpen,
        isEditMode,
        setEditMode,
        mealsToRemove,
        addMealToRemove,
        clearMealsToRemove,
        setDeleteModalOpen,
        temporaryMeals,
        clearTemporaryMeals,
        setMealCreateModalOpen
    } = useDietStore();

    const {setDeleteModalOpen: setDeleteModalOpenMeal, isDeleteModalOpen: isDeleteModalOpenMeal} = useMealStore();


    React.useEffect(() => {
    console.log("isDeleteModalOpenMeal", isDeleteModalOpenMeal)
    }, [isDeleteModalOpenMeal])
    
    const [mealToDeleteId, setMealToDeleteId] = React.useState<number | null>(null);
    
    const handleRemoveMeal = (mealId: number) => {
        alert("handleRemoveMeal is triggered, mealId:"+mealId)
        if (mealId) {
            setMealToDeleteId(mealId);
            setDeleteModalOpenMeal(true);
        }
    };
    
    const confirmMealRemoval = () => {
        if (mealToDeleteId) {
            // Add meal to remove list
            addMealToRemove(mealToDeleteId);
            // Show toast notification for meal removal
            toast(t('meal.removedFromDiet'), {
                description: t('meal.removedFromDietDescription'),
            });
            // Reset state
            setMealToDeleteId(null);
            setDeleteModalOpenMeal(false);
        }
    };
    
    const cancelMealRemoval = () => {
        setMealToDeleteId(null);
        setDeleteModalOpenMeal(false);
    };

    const handleAddMeal = () => {
        // Open meal creation modal for adding to the diet
        setMealCreateModalOpen(true);
    };

    const { data: diet, isLoading } = selectedDietId !== null
        ? useGetDiet(selectedDietId)
        : { data: undefined, isLoading: false };

    const updateMutation = useUpdateDiet();

    const { register, handleSubmit, setValue, reset, formState: { dirtyFields } } = useForm<DietFormValues>({
        defaultValues: diet ? {
            name: diet.name || '',
            description: diet.dietDescription || '',
            type: diet.dietType as DietType,
            duration: diet.dietDuration || 0,
            calories: diet.totalCalories || 0,
            startDate: diet.startDate ? new Date(diet.startDate).toISOString().split('T')[0] : '',
            endDate: diet.endDate ? new Date(diet.endDate).toISOString().split('T')[0] : '',
            isActive: diet.isActive || false
        } : {}
    });

    const handleClose = () => {
        setDetailModalOpen(false);
        setEditMode(false);
        reset();
    };

    React.useEffect(() => {
        if (diet) {
            const nameValue = diet.name || '';

            const startDate = diet.startDate ? new Date(diet.startDate).toISOString().split('T')[0] : '';
            const endDate = diet.endDate ? new Date(diet.endDate).toISOString().split('T')[0] : '';

            reset({
                name: nameValue,
                description: diet.dietDescription || '',
                type: diet.dietType as DietType,
                duration: diet.dietDuration || 0,
                calories: diet.totalCalories || 0,
                startDate: startDate,
                endDate: endDate,
                isActive: diet.isActive || false
            }, { keepDirtyValues: false }); // Force reset all values

            setValue('name', nameValue);
            setValue('description', diet.dietDescription || '');
            setValue('type', diet.dietType as DietType);
            setValue('duration', diet.dietDuration || 0);
            setValue('calories', diet.totalCalories || 0);
            setValue('startDate', startDate);
            setValue('endDate', endDate);
            setValue('isActive', diet.isActive || false);
        }
    }, [diet, reset, setValue, isEditMode]);

    const onSubmit = (data: any) => {
        if (!selectedDietId || !diet) return;

        // Prevent form submission if there are no changes
        const hasChanges = Object.keys(dirtyFields).length > 0 || mealsToRemove.length > 0 || temporaryMeals.length > 0;
        if (!hasChanges) {
            setEditMode(false);
            return;
        }

        // Prepare update data with proper structure for meal additions and removals
        const updateData: UpdateDietRequest = {
            name: data.name !== diet.name ? data.name : undefined,
            dietDescription: data.description !== diet.dietDescription ? data.description : undefined,
            dietType: data.type !== diet.dietType ? data.type : undefined,
            dietDuration: data.duration !== diet.dietDuration ? data.duration : undefined,
            totalCalories: data.calories !== diet.totalCalories ? data.calories : undefined,
            startDate: data.startDate ? new Date(data.startDate).toISOString() : diet.startDate,
            endDate: data.endDate ? new Date(data.endDate).toISOString() : diet.endDate,
            isActive: data.isActive !== undefined ? !!data.isActive : diet.isActive,
        };
        
        // Only add meal IDs to remove if there are any - don't send empty arrays
        if (mealsToRemove.length > 0) {
            updateData.mealIdsToRemove = mealsToRemove;
        }
        
        // Only add new meals if there are any - don't send empty arrays
        if (temporaryMeals.length > 0) {
            updateData.newMealsToAdd = temporaryMeals;
        }

        updateMutation.mutate({
            id: selectedDietId,
            request: updateData
        }, {
            onSuccess: () => {
                setEditMode(false);
                clearMealsToRemove(); // Clear the removed meals after successful update
                clearTemporaryMeals(); // Clear the temporary meals after successful update
                toast(t('diet.updated'), {
                    description: t('diet.updatedDescription'),
                });
            }
        });
    };
    const defaultValues = diet ? {
        name: diet.name || '',
        description: diet.dietDescription || '',
        type: diet.dietType as DietType,
        duration: diet.dietDuration || 0,
        calories: diet.totalCalories || 0,
        startDate: diet.startDate ? new Date(diet.startDate).toISOString().split('T')[0] : '',
        endDate: diet.endDate ? new Date(diet.endDate).toISOString().split('T')[0] : '',
        isActive: diet.isActive || false
    } : {
        name: '',
        description: '',
        type: DietType.VEGETARIAN,
        duration: 0,
        calories: 0,
        startDate: '',
        endDate: '',
        isActive: false
    };

    const footerContent = isEditMode ? (
        <>
            <Button
                type="button"
                variant="outline"
                onClick={() => setEditMode(false)}
            >
                {t('common.cancel')}
            </Button>
            <Button
                onClick={handleSubmit(onSubmit)}
                disabled={updateMutation.isPending}
            >
                {updateMutation.isPending ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {t('common.saving')}
                    </>
                ) : (
                    t('common.save')
                )}
            </Button>
        </>
    ) : (
        <>
            <Button
                type="button"
                variant="outline"
                onClick={() => setEditMode(true)}
            >
                {t('common.edit')}
            </Button>
            <Button
                type="button"
                variant="destructive"
                onClick={() => setDeleteModalOpen(true)}
            >
                {t('common.delete')}
            </Button>
        </>
    );

    return (
        <>
            <BaseDietDialog
                isOpen={isDetailModalOpen}
                onClose={handleClose}
                title={isEditMode ? t('diet.edit') : t('diet.details')}
                isLoading={isLoading}
                register={register}
                setValue={setValue}
                defaultValues={defaultValues}
                isDisabled={!isEditMode}
                footerContent={footerContent}
            >
                {diet?.meals && (
                    <div className="mt-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-medium">{t('meal.list')}</h3>
                            {isEditMode && (
                                <Button 
                                    onClick={handleAddMeal}
                                    size="sm"
                                    variant="outline"
                                >
                                    {t('meal.add')}
                                </Button>
                            )}
                        </div>
                        <DietMealList
                            meals={diet.meals.filter(meal => !mealsToRemove.includes(meal.id))}
                            isEditMode={isEditMode}
                            onRemoveMeal={handleRemoveMeal}
                        />
                    </div>
                )}
            </BaseDietDialog>
            
            <MealDeleteDialog/>
            
            <MealCreateDialog forDietUpdate={true} />
        </>
    );
}
