import { useTranslation } from 'react-i18next';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useDeleteDiet } from '@/hooks/diet-hooks';
import { useDietStore } from '@/stores/diet-store';

interface DietDeleteProps {
    isOpen: boolean;
    onClose: () => void;
    onDeleted: () => void;
}

export default function DietDelete({ isOpen, onClose, onDeleted }: DietDeleteProps) {
    const { t } = useTranslation();
    const selectedDietId = useDietStore((state) => state.selectedDietId);
    const deleteDiet = useDeleteDiet();

    const handleDelete = async () => {
        if (!selectedDietId) return;
        await deleteDiet.mutateAsync(selectedDietId);
        onDeleted();
    };

    return (
        <AlertDialog open={isOpen} onOpenChange={onClose}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{t('diet.deleteConfirmTitle')}</AlertDialogTitle>
                    <AlertDialogDescription>
                        {t('diet.deleteConfirmMessage')}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
                        {t('common.delete')}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
