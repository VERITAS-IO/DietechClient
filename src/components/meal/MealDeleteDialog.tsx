import { useTranslation } from 'react-i18next';
import { useMealStore } from '@/stores/meal-store';
import { useDeleteMeal } from '@/hooks/meal-hooks';
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
import { Loader2 } from 'lucide-react';
import { useEffect } from 'react';

export default function MealDeleteDialog() {
    const { t } = useTranslation();
    const isDeleteModalOpen = useMealStore((state) => state.isDeleteModalOpen);
    const setDeleteModalOpen = useMealStore((state) => state.setDeleteModalOpen);
    const selectedMealId = useMealStore((state) => state.selectedMealId);

    const deleteMealMutation = useDeleteMeal();

    // Add debugging to track when the dialog opens and what meal ID is selected
    useEffect(() => {
        if (isDeleteModalOpen) {
        }
    }, [isDeleteModalOpen, selectedMealId]);

    const handleDelete = async () => {
        
        if (!selectedMealId) {
            setDeleteModalOpen(false);
            return;
        }
        
        try {
            await deleteMealMutation.mutateAsync(selectedMealId);
            setDeleteModalOpen(false);
        } catch (error) {
        }
    };

    return (
        <AlertDialog open={isDeleteModalOpen} onOpenChange={setDeleteModalOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{t('meal.delete.title')}</AlertDialogTitle>
                    <AlertDialogDescription>
                        {t('meal.delete.description')}
                        {selectedMealId ? ` (ID: ${selectedMealId})` : ''}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={deleteMealMutation.isPending}>
                        {t('common.cancel')}
                    </AlertDialogCancel>
                    <AlertDialogAction 
                        onClick={handleDelete}
                        disabled={deleteMealMutation.isPending || !selectedMealId}
                        className="bg-destructive hover:bg-destructive/90"
                    >
                        {deleteMealMutation.isPending ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                {t('common.deleting')}
                            </>
                        ) : (
                            t('common.delete')
                        )}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
