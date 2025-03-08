import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from "@/components/ui/button";
import { useGetDiet, useUpdateDiet } from '@/hooks/diet-hooks';
import { useDietStore } from '@/stores/diet-store';
import { DietType } from '@/types/diet';
import { useForm } from 'react-hook-form';
import { Loader2 } from 'lucide-react';
import BaseDietDialog from './BaseDietDialog';

interface DietFormValues {
    name: string;
    description: string;
    type: DietType;
    duration: number;
    calories: number;
    startDate?: string;
    endDate?: string;
    isActive?: boolean;
}

export default function DietDetailDialog() {
    const { t } = useTranslation();
    const {
        selectedDietId,
        isDetailModalOpen,
        isEditMode,
        setDetailModalOpen,
        setDeleteModalOpen,
        setEditMode
    } = useDietStore();

    const { data: diet, isLoading } = selectedDietId !== null 
        ? useGetDiet(selectedDietId) 
        : { data: undefined, isLoading: false };

    const updateMutation = useUpdateDiet();

    const { register, handleSubmit, setValue, reset, formState: { dirtyFields } } = useForm<DietFormValues>({
        defaultValues: diet ? {
            name: diet.name || '',
            description: diet.dietDescription || '',
            type: diet.dietType as DietType,
            duration: diet.dietDuration || 0,
            calories: diet.totalCalories || 0,
            startDate: diet.startDate ? new Date(diet.startDate).toISOString().split('T')[0] : '',
            endDate: diet.endDate ? new Date(diet.endDate).toISOString().split('T')[0] : '',
            isActive: diet.isActive || false
        } : {}
    });

    const handleClose = () => {
        setDetailModalOpen(false);
        setEditMode(false);
        reset();
    };

    React.useEffect(() => {
        if (diet) {
            const nameValue = diet.name || '';
            
            // Format dates for input fields
            const startDate = diet.startDate ? new Date(diet.startDate).toISOString().split('T')[0] : '';
            const endDate = diet.endDate ? new Date(diet.endDate).toISOString().split('T')[0] : '';
            
            reset({
                name: nameValue,
                description: diet.dietDescription || '',
                type: diet.dietType as DietType,
                duration: diet.dietDuration || 0,
                calories: diet.totalCalories || 0,
                startDate: startDate,
                endDate: endDate,
                isActive: diet.isActive || false
            }, { keepDirtyValues: false }); // Force reset all values
            
            setValue('name', nameValue);
            setValue('description', diet.dietDescription || '');
            setValue('type', diet.dietType as DietType);
            setValue('duration', diet.dietDuration || 0);
            setValue('calories', diet.totalCalories || 0);
            setValue('startDate', startDate);
            setValue('endDate', endDate);
            setValue('isActive', diet.isActive || false);
        }
    }, [diet, reset, setValue, isEditMode]); 

    const onSubmit = (data: any) => {
        if (!selectedDietId || !diet) return;

        const updateData = {
            name: data.name,
            dietDescription: data.description,
            dietType: data.type,
            dietDuration: Number(data.duration),
            totalCalories: Number(data.calories),
            startDate: data.startDate ? new Date(data.startDate).toISOString() : diet.startDate,
            endDate: data.endDate ? new Date(data.endDate).toISOString() : diet.endDate,
            isActive: data.isActive !== undefined ? !!data.isActive : diet.isActive,
        };
        
        const hasChanges = Object.keys(dirtyFields).length > 0;
        
        if (!hasChanges) {
            setEditMode(false);
            return;
        }
        
        updateMutation.mutate({
            id: selectedDietId,
            request: updateData
        }, {
            onSuccess: () => {
                setEditMode(false);
            }
        });
    };

    const defaultValues = diet ? {
        name: diet.name || '',
        description: diet.dietDescription || '',
        type: diet.dietType as DietType,
        duration: diet.dietDuration || 0,
        calories: diet.totalCalories || 0,
        startDate: diet.startDate ? new Date(diet.startDate).toISOString().split('T')[0] : '',
        endDate: diet.endDate ? new Date(diet.endDate).toISOString().split('T')[0] : '',
        isActive: diet.isActive || false
    } : {
        name: '',
        description: '',
        type: DietType.VEGETARIAN,
        duration: 0,
        calories: 0,
        startDate: '',
        endDate: '',
        isActive: false
    };

    const footerContent = isEditMode ? (
        <>
            <Button
                type="button"
                variant="outline"
                onClick={() => setEditMode(false)}
            >
                {t('common.cancel')}
            </Button>
            <Button
                onClick={handleSubmit(onSubmit)}
                disabled={updateMutation.isPending}
            >
                {updateMutation.isPending ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {t('common.saving')}
                    </>
                ) : (
                    t('common.save')
                )}
            </Button>
        </>
    ) : (
        <>
            <Button
                type="button"
                variant="outline"
                onClick={() => setEditMode(true)}
            >
                {t('common.edit')}
            </Button>
            <Button
                type="button"
                variant="destructive"
                onClick={() => setDeleteModalOpen(true)}
            >
                {t('common.delete')}
            </Button>
        </>
    );

    return (
        <BaseDietDialog
            isOpen={isDetailModalOpen}
            onClose={handleClose}
            title={isEditMode ? t('diet.edit') : t('diet.details')}
            isLoading={isLoading}
            register={register}
            setValue={setValue}
            defaultValues={defaultValues}
            isDisabled={!isEditMode}
            footerContent={footerContent}
        />
    );
}
