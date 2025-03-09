import { useTranslation } from 'react-i18next';
import { useMealStore } from '@/stores/meal-store';
import { useGetMeal } from '@/hooks/meal-hooks';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2, AlertCircle, Trash, Pencil } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { format } from 'date-fns';
import { MealType } from '@/types/meal';

export default function MealDetailDialog() {
    const { t } = useTranslation();
    const isDetailModalOpen = useMealStore((state) => state.isDetailModalOpen);
    const setDetailModalOpen = useMealStore((state) => state.setDetailModalOpen);
    const selectedMealId = useMealStore((state) => state.selectedMealId);
    const setEditMode = useMealStore((state) => state.setEditMode);
    const setDeleteModalOpen = useMealStore((state) => state.setDeleteModalOpen);

    const { data: meal, isLoading, error, isError } = useGetMeal(selectedMealId || 0);

    const getMealTypeName = (mealType: number): string => {
        const mealTypeKeys = Object.keys(MealType)
            .filter(key => !isNaN(Number(key)))
            .map(key => Number(key));
        
        const mealTypeKey = mealTypeKeys.find(key => key === mealType);
        return mealTypeKey !== undefined 
            ? t(`meal.types.${MealType[mealTypeKey].toLowerCase()}`) 
            : t('meal.types.unknown');
    };

    const handleEditClick = () => {
        setEditMode(true);
        setDetailModalOpen(false);
    };

    const handleDeleteClick = () => {
        setDetailModalOpen(false);
        setDeleteModalOpen(true);
    };

    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="flex flex-col items-center justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin" />
                    <span className="mt-2">{t('common.loading')}</span>
                </div>
            );
        }

        if (isError) {
            return (
                <Alert variant="destructive" className="mt-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                        {error?.message || t('common.error')}
                    </AlertDescription>
                </Alert>
            );
        }

        if (!meal) {
            return (
                <Alert variant="destructive" className="mt-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                        {t('meal.notFound')}
                    </AlertDescription>
                </Alert>
            );
        }

        return (
            <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                    <div className="font-medium">{t('meal.name')}:</div>
                    <div className="col-span-3">{meal.name}</div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <div className="font-medium">{t('meal.type')}:</div>
                    <div className="col-span-3">{getMealTypeName(meal.mealType)}</div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <div className="font-medium">{t('meal.time')}:</div>
                    <div className="col-span-3">
                        {format(new Date(meal.startTime), 'HH:mm')} - {format(new Date(meal.endTime), 'HH:mm')}
                    </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <div className="font-medium">{t('meal.dietId')}:</div>
                    <div className="col-span-3">{meal.dietId}</div>
                </div>
                <div className="grid grid-cols-4 items-start gap-4">
                    <div className="font-medium">{t('meal.description')}:</div>
                    <div className="col-span-3">{meal.description}</div>
                </div>
                {meal.nutritionInfoList && meal.nutritionInfoList.length > 0 && (
                    <div className="grid grid-cols-4 items-start gap-4">
                        <div className="font-medium">{t('meal.nutritionInfo')}:</div>
                        <div className="col-span-3">
                            <ul className="list-disc pl-5">
                                {meal.nutritionInfoList.map((item) => (
                                    <li key={item.id}>{item.name} - {item.caloriesPerServing} kcal</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    return (
        <Dialog open={isDetailModalOpen} onOpenChange={setDetailModalOpen}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{t('meal.detail.title')}</DialogTitle>
                    <DialogDescription>
                        {t('meal.detail.description')}
                    </DialogDescription>
                </DialogHeader>
                {renderContent()}
                <DialogFooter>
                    <Button variant="outline" onClick={handleDeleteClick} className="gap-2">
                        <Trash className="h-4 w-4" />
                        {t('common.delete')}
                    </Button>
                    <Button onClick={handleEditClick} className="gap-2">
                        <Pencil className="h-4 w-4" />
                        {t('common.edit')}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
