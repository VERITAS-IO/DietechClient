import { useTranslation } from 'react-i18next';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useGetDiet, useUpdateDiet, useCreateDiet } from '@/hooks/diet-hooks';
import { useDietStore } from '@/stores/diet-store';
import { DietType } from '@/types/diet';
import { useForm } from 'react-hook-form';
import { Loader2 } from 'lucide-react';

export default function DietDetail(){
    const { t } = useTranslation();
    const {
        selectedDietId,
        isDetailModalOpen,
        isEditMode,
        setDetailModalOpen,
        setDeleteModalOpen,
        setEditMode
    } = useDietStore();

    // Only fetch diet data if we have a selected diet ID
    const { data: diet, isLoading } = selectedDietId !== null 
        ? useGetDiet(selectedDietId) 
        : { data: undefined, isLoading: false };
    const updateMutation = useUpdateDiet();
    const { register, handleSubmit, reset, setValue } = useForm();

    const handleClose = () => {
        setDetailModalOpen(false);
        setEditMode(false);
        reset();
    };

    // Import the create mutation hook
    const createMutation = useCreateDiet();

    const onSubmit = (data: any) => {
        if (isCreateMode) {
            // Create a new diet with required fields for CreateDietRequest
            const createData = {
                name: data.name,
                dietDescription: data.description,
                dietType: data.type || DietType.VEGETARIAN,
                dietDuration: Number(data.duration),
                totalCalories: Number(data.calories),
                tenantId: 1, // Default tenant ID, adjust as needed
                nutritionInfoIds: [] // Empty array for now, adjust as needed
            };
            
            createMutation.mutate(createData, {
                onSuccess: () => {
                    handleClose();
                }
            });
        } else if (selectedDietId) {
            // Update existing diet
            const updateData = {
                name: data.name,
                dietDescription: data.description,
                dietType: data.type,
                dietDuration: Number(data.duration),
                totalCalories: Number(data.calories),
            };
            
            updateMutation.mutate({
                id: selectedDietId,
                request: updateData
            }, {
                onSuccess: () => {
                    setEditMode(false);
                }
            });
        }
    };

    // Determine if we're in create mode (no selected diet ID)
    const isCreateMode = selectedDietId === null;

    // Only render the dialog when it's supposed to be open
    return (
        <Dialog open={isDetailModalOpen} onOpenChange={handleClose}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>
                        {isCreateMode ? t('diet.create') : (isEditMode ? t('diet.edit') : t('diet.details'))}
                    </DialogTitle>
                </DialogHeader>
                
                {isLoading ? (
                    <div className="flex justify-center p-6">
                        <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                ) : isCreateMode ? (
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label>{t('diet.name')}</label>
                                <Input
                                    {...register('name', { required: true })}
                                    placeholder={t('diet.namePlaceholder')}
                                />
                            </div>

                            <div className="space-y-2">
                                <label>{t('diet.type')}</label>
                                <Select
                                    onValueChange={(value) => setValue('type', value)}
                                    defaultValue={DietType.VEGETARIAN}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Object.values(DietType).map((type) => (
                                            <SelectItem key={type} value={type}>
                                                {t(`diet.types.${type.toLowerCase()}`)}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <label>{t('diet.duration')}</label>
                                <Input
                                    type="number"
                                    {...register('duration', { required: true, min: 1 })}
                                    placeholder="7"
                                />
                            </div>

                            <div className="space-y-2">
                                <label>{t('diet.calories')}</label>
                                <Input
                                    type="number"
                                    {...register('calories', { required: true, min: 0 })}
                                    placeholder="2000"
                                />
                            </div>

                            <div className="col-span-2 space-y-2">
                                <label>{t('diet.description')}</label>
                                <Textarea
                                    {...register('description', { required: true })}
                                    placeholder={t('diet.descriptionPlaceholder')}
                                    className="min-h-[100px]"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end space-x-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleClose}
                            >
                                {t('common.cancel')}
                            </Button>
                            <Button
                                type="submit"
                                disabled={updateMutation.isPending}
                            >
                                {updateMutation.isPending ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        {t('common.saving')}
                                    </>
                                ) : (
                                    t('common.create')
                                )}
                            </Button>
                        </div>
                    </form>
                ) : diet ? (

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label>{t('diet.name')}</label>
                            <Input
                                {...register('name')}
                                defaultValue={diet.dietName}
                                disabled={!isEditMode}
                            />
                        </div>

                        <div className="space-y-2">
                            <label>{t('diet.type')}</label>
                            <Select
                                disabled={!isEditMode}
                                onValueChange={(value) => setValue('type', value)}
                                defaultValue={diet.dietType}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {Object.values(DietType).map((type) => (
                                        <SelectItem key={type} value={type}>
                                            {t(`diet.types.${type.toLowerCase()}`)}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <label>{t('diet.duration')}</label>
                            <Input
                                type="number"
                                {...register('duration')}
                                defaultValue={diet.dietDuration}
                                disabled={!isEditMode}
                            />
                        </div>

                        <div className="space-y-2">
                            <label>{t('diet.calories')}</label>
                            <Input
                                type="number"
                                {...register('calories')}
                                defaultValue={diet.totalCalories}
                                disabled={!isEditMode}
                            />
                        </div>

                        <div className="col-span-2 space-y-2">
                            <label>{t('diet.description')}</label>
                            <Textarea
                                {...register('description')}
                                defaultValue={diet.dietDescription}
                                disabled={!isEditMode}
                                className="min-h-[100px]"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end space-x-2">
                        {isEditMode ? (
                            <>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setEditMode(false)}
                                >
                                    {t('common.cancel')}
                                </Button>
                                <Button
                                    type="submit"
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
                        )}
                    </div>
                </form>
                ) : (
                    <div className="p-4 text-center">
                        <p>{t('common.error')}</p>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
};