import { useTranslation } from 'react-i18next';
import { Button } from "@/components/ui/button";
import { useCreateDiet } from '@/hooks/diet-hooks';
import { useDietStore } from '@/stores/diet-store';
import { DietType } from '@/types/diet';
import { useForm } from 'react-hook-form';
import { Loader2, Plus, Trash } from 'lucide-react';
import BaseDietDialog from './BaseDietDialog';
import MealCreateDialog from '../meal/MealCreateDialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function DietCreateDialog() {
    const { t } = useTranslation();
    const {
        isCreateModalOpen,
        setCreateModalOpen,
        temporaryMeals,
        removeTemporaryMeal,
        clearTemporaryMeals,
        setMealCreateModalOpen
    } = useDietStore();

    const createMutation = useCreateDiet();
    const { register, handleSubmit, setValue, reset } = useForm({
        defaultValues: {
            name: '',
            description: '',
            type: DietType.VEGETARIAN,
            duration: 7,
            calories: 2000,
            startDate: new Date().toISOString().split('T')[0],
            endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            isActive: true
        }
    });

    const handleClose = () => {
        setCreateModalOpen(false);
        clearTemporaryMeals();
        reset();
    };

    const onSubmit = (data: any) => {
        const createData = {
            name: data.name,
            dietDescription: data.description,
            dietType: data.type,
            dietDuration: Number(data.duration),
            totalCalories: Number(data.calories),
            tenantId: 1, // Default tenant ID, adjust as needed
            nutritionInfoIds: [], // Empty array for now, adjust as needed
            startDate: data.startDate ? new Date(data.startDate).toISOString() : new Date().toISOString(),
            endDate: data.endDate ? new Date(data.endDate).toISOString() : null,
            isActive: !!data.isActive,
            meals: temporaryMeals // Include the temporary meals in the diet creation request
        };
        
        createMutation.mutate(createData, {
            onSuccess: () => {
                handleClose();
            }
        });
    };

    // Render the list of meals that have been added to the diet
    const renderMealsList = () => {
        if (temporaryMeals.length === 0) {
            return (
                <div className="text-center py-4 text-muted-foreground">
                    {t('diet.noMealsAdded')}
                </div>
            );
        }

        return (
            <div className="space-y-2 max-h-60 overflow-y-auto">
                {temporaryMeals.map((meal, index) => (
                    <Card key={index} className="bg-muted/40">
                        <CardHeader className="py-2 px-3">
                            <div className="flex justify-between items-center">
                                <CardTitle className="text-sm font-medium">{meal.name}</CardTitle>
                                <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-6 w-6" 
                                    onClick={() => removeTemporaryMeal(index)}
                                >
                                    <Trash className="h-4 w-4" />
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="py-2 px-3">
                            <div className="text-xs text-muted-foreground">
                                <p>{meal.description}</p>
                                <p className="mt-1">
                                    {t('meal.type')}: {t(`meal.types.${meal.mealType}`)}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    };

    const footerContent = (
        <>
            <div className="flex w-full justify-between">
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => setMealCreateModalOpen(true)}
                    className="gap-1"
                >
                    <Plus className="h-4 w-4" />
                    {t('diet.addMeal')}
                </Button>
                
                <div className="flex gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleClose}
                    >
                        {t('common.cancel')}
                    </Button>
                    <Button
                        onClick={handleSubmit(onSubmit)}
                        disabled={createMutation.isPending}
                    >
                        {createMutation.isPending ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                {t('common.saving')}
                            </>
                        ) : (
                            t('common.create')
                        )}
                    </Button>
                </div>
            </div>
        </>
    );

    return (
        <>
            <BaseDietDialog
                isOpen={isCreateModalOpen}
                onClose={handleClose}
                title={t('diet.create')}
                register={register}
                setValue={setValue}
                footerContent={footerContent}
            >
                {/* Meals section */}
                <div className="col-span-2 space-y-2">
                    <h3 className="font-medium text-base">{t('diet.meals')}</h3>
                    {renderMealsList()}
                </div>
            </BaseDietDialog>
            
            {/* Meal create dialog for adding meals to the diet */}
            <MealCreateDialog forDietCreation={true} />
        </>
    );
}
