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

export default function MealDeleteDialog() {
    const { t } = useTranslation();
    const isDeleteModalOpen = useMealStore((state) => state.isDeleteModalOpen);
    const setDeleteModalOpen = useMealStore((state) => state.setDeleteModalOpen);
    const selectedMealId = useMealStore((state) => state.selectedMealId);

    const deleteMealMutation = useDeleteMeal();

    const handleDelete = async () => {
        if (selectedMealId) {
            await deleteMealMutation.mutateAsync(selectedMealId);
            setDeleteModalOpen(false);
        }
    };

    return (
        <AlertDialog open={isDeleteModalOpen} onOpenChange={setDeleteModalOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{t('meal.delete.title')}</AlertDialogTitle>
                    <AlertDialogDescription>
                        {t('meal.delete.description')}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={deleteMealMutation.isPending}>
                        {t('common.cancel')}
                    </AlertDialogCancel>
                    <AlertDialogAction 
                        onClick={handleDelete}
                        disabled={deleteMealMutation.isPending}
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
