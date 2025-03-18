import { useTranslation } from 'react-i18next';
import { useFinancialStore } from '@/stores/financial-store';
import { useDeleteFinancial } from '@/hooks/useFinancials';
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

export default function FinancialDeleteDialog() {
    const { t } = useTranslation();
    const isDeleteModalOpen = useFinancialStore((state) => state.isDeleteModalOpen);
    const setDeleteModalOpen = useFinancialStore((state) => state.setDeleteModalOpen);
    const selectedFinancial = useFinancialStore((state) => state.selectedFinancial);

    const deleteFinancialMutation = useDeleteFinancial();

    const handleDelete = async () => {
        if (!selectedFinancial) {
            console.error("Cannot delete financial: No financial selected");
            setDeleteModalOpen(false);
            return;
        }
        
        try {
            await deleteFinancialMutation.mutateAsync(parseInt(selectedFinancial.id));
            setDeleteModalOpen(false);
        } catch (error) {
            console.error("Error deleting financial:", error);
        }
    };

    return (
        <AlertDialog open={isDeleteModalOpen} onOpenChange={setDeleteModalOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{t('financial.delete.title')}</AlertDialogTitle>
                    <AlertDialogDescription>
                        {t('financial.delete.description')}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={deleteFinancialMutation.isPending}>
                        {t('common.cancel')}
                    </AlertDialogCancel>
                    <AlertDialogAction 
                        onClick={handleDelete}
                        disabled={deleteFinancialMutation.isPending || !selectedFinancial}
                        className="bg-destructive hover:bg-destructive/90"
                    >
                        {deleteFinancialMutation.isPending ? (
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