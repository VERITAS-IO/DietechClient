import React from 'react';
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
import { useFinancialStore } from '@/stores/financial-store';
import { useDeleteFinancial } from '@/hooks/useFinancials';

const FinancialDeleteDialog: React.FC = () => {
    const { t } = useTranslation();
    const deleteFinancialMutation = useDeleteFinancial();
    const { isDeleteModalOpen, setDeleteModalOpen, selectedFinancial } = useFinancialStore();

    // Handle delete confirmation
    const handleDeleteConfirm = async () => {
        if (selectedFinancial) {
            try {
                await deleteFinancialMutation.mutateAsync(selectedFinancial.id);
                setDeleteModalOpen(false);
            } catch (error) {
            }
        }
    };

    // Handle cancel
    const handleCancel = () => {
        setDeleteModalOpen(false);
    };

    return (
        <AlertDialog open={isDeleteModalOpen} onOpenChange={setDeleteModalOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{t('financial.deleteConfirmTitle')}</AlertDialogTitle>
                    <AlertDialogDescription>
                        {t('financial.deleteConfirmMessage')}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={handleCancel}>
                        {t('common.cancel')}
                    </AlertDialogCancel>
                    <AlertDialogAction 
                        onClick={handleDeleteConfirm}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                        {deleteFinancialMutation.isPending
                            ? t('common.deleting')
                            : t('common.delete')}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default FinancialDeleteDialog; 