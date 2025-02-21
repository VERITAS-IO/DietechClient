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
import { Loader2 } from "lucide-react";
import { useNutritionStore } from '@/stores/nutrition-store';
import { useDeleteNutritionInfo } from '@/hooks/nutrition-hooks';

export const NutritionInfoDelete = () => {
    const {
        selectedNutritionInfo,
        isDeleteModalOpen,
        setDeleteModalOpen,
        setDetailModalOpen
    } = useNutritionStore();

    const deleteMutation = useDeleteNutritionInfo();

    const handleDelete = () => {
        if (!selectedNutritionInfo) return;

        deleteMutation.mutate(selectedNutritionInfo.id, {
            onSuccess: () => {
                setDeleteModalOpen(false);
                setDetailModalOpen(false);
            }
        });
    };

    return (
        <AlertDialog open={isDeleteModalOpen} onOpenChange={setDeleteModalOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the
                        nutrition info and remove it from our servers.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleDelete}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        disabled={deleteMutation.isPending}
                    >
                        {deleteMutation.isPending ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Deleting...
                            </>
                        ) : (
                            'Delete'
                        )}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};
