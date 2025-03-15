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
} from "@/components/ui/alert-dialog";
import { Loader2 } from 'lucide-react';
import { useState } from 'react';

interface DietMealRemoveDialogProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    mealId: number | null;
    mealName?: string;
    onConfirm: (mealId: number) => void;
    isLoading?: boolean;
}

export default function DietMealRemoveDialog({
    isOpen,
    onOpenChange,
    mealId,
    mealName,
    onConfirm,
    isLoading = false
}: DietMealRemoveDialogProps) {
    const { t } = useTranslation();
    const [isPending, setIsPending] = useState(false);
    
    // Use translation for default meal name
    const mealNameDisplay = mealName || t('meal.defaultName');

    const handleConfirm = async () => {
        if (!mealId) return;
        
        setIsPending(true);
        try {
            await onConfirm(mealId);
        } finally {
            setIsPending(false);
            onOpenChange(false);
        }
    };

    return (
        <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{t('meal.removeFromDiet')}</AlertDialogTitle>
                    <AlertDialogDescription>
                        {t('meal.removeFromDietConfirmation', { name: mealNameDisplay })}
                        {mealId ? ` (ID: ${mealId})` : ''}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isPending || isLoading}>
                        {t('common.cancel')}
                    </AlertDialogCancel>
                    <AlertDialogAction 
                        onClick={handleConfirm}
                        disabled={isPending || isLoading || !mealId}
                        className="bg-destructive hover:bg-destructive/90"
                    >
                        {(isPending || isLoading) ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                {t('common.removing')}
                            </>
                        ) : (
                            t('common.remove')
                        )}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
} 