import { useTranslation } from 'react-i18next';
import { Button } from "@/components/ui/button";
import { useCreateDiet } from '@/hooks/diet-hooks';
import { useDietStore } from '@/stores/diet-store';
import { DietType } from '@/types/diet';
import { useForm } from 'react-hook-form';
import { Loader2 } from 'lucide-react';
import BaseDietDialog from './BaseDietDialog';

export default function DietCreateDialog() {
    const { t } = useTranslation();
    const {
        isCreateModalOpen,
        setCreateModalOpen
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
        reset();
    };

    const onSubmit = (data: any) => {
        // Create a new diet with required fields for CreateDietRequest
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
            isActive: !!data.isActive
        };
        
        createMutation.mutate(createData, {
            onSuccess: () => {
                handleClose();
            }
        });
    };

    const footerContent = (
        <>
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
        </>
    );

    return (
        <BaseDietDialog
            isOpen={isCreateModalOpen}
            onClose={handleClose}
            title={t('diet.create')}
            register={register}
            setValue={setValue}
            footerContent={footerContent}
        />
    );
}
