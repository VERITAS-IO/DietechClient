import { useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useNutritionStore } from '@/stores/nutrition-store';
import { useUpdateNutritionInfo } from '@/hooks/nutrition-hooks';
import { ServingUnit, FoodCategory, UpdateNutritionInfoRequest } from '@/types/nutrition';
import { useForm } from 'react-hook-form';
import { Loader2 } from 'lucide-react';

export const NutritionInfoDetail = () => {
    const { 
        selectedNutritionInfo,
        isDetailModalOpen,
        isEditMode,
        setDetailModalOpen,
        setDeleteModalOpen,
        setEditMode 
    } = useNutritionStore();

    const { register, handleSubmit, reset, setValue } = useForm<UpdateNutritionInfoRequest>();
    const updateMutation = useUpdateNutritionInfo();

    useEffect(() => {
        if (selectedNutritionInfo && isDetailModalOpen) {
            reset(selectedNutritionInfo);
        }
    }, [selectedNutritionInfo, isDetailModalOpen, reset]);

    const handleClose = () => {
        setDetailModalOpen(false);
        setEditMode(false);
        reset();
    };

    const onSubmit = (data: UpdateNutritionInfoRequest) => {
        if (!selectedNutritionInfo) return;

        // Convert number fields to ensure they are not sent as strings
        const formattedData: UpdateNutritionInfoRequest = {
            ...data,
            servingSize: Number(data.servingSize),
            servingUnit: Number(data.servingUnit),
            foodCategory: Number(data.foodCategory),
            caloriesPerServing: Number(data.caloriesPerServing),
            totalFat: Number(data.totalFat),
            protein: Number(data.protein),
            carbohydrates: Number(data.carbohydrates),
        };

        updateMutation.mutate({
            id: selectedNutritionInfo.id,
            request: formattedData
        }, {
            onSuccess: () => {
                setEditMode(false);
            }
        });
    };

    if (!selectedNutritionInfo) return null;

    return (
        <Dialog open={isDetailModalOpen} onOpenChange={handleClose}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>
                        {isEditMode ? 'Edit Nutrition Info' : 'Nutrition Info Details'}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label>Name</label>
                            <Input
                                {...register('name')}
                                disabled={!isEditMode}
                            />
                        </div>

                        <div className="space-y-2">
                            <label>Serving Size</label>
                            <Input
                                type="number"
                                step="any"
                                {...register('servingSize', { valueAsNumber: true })}
                                disabled={!isEditMode}
                            />
                        </div>

                        <div className="space-y-2">
                            <label>Serving Unit</label>
                            <Select
                                disabled={!isEditMode}
                                onValueChange={(value) => setValue('servingUnit', Number(value))}
                                defaultValue={String(selectedNutritionInfo.servingUnit)}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {Object.entries(ServingUnit)
                                        .filter(([key]) => isNaN(Number(key)))
                                        .map(([key, value]) => (
                                            <SelectItem key={value} value={String(value)}>
                                                {key}
                                            </SelectItem>
                                        ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <label>Category</label>
                            <Select
                                disabled={!isEditMode}
                                onValueChange={(value) => setValue('foodCategory', Number(value))}
                                defaultValue={String(selectedNutritionInfo.foodCategory)}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {Object.entries(FoodCategory)
                                        .filter(([key]) => isNaN(Number(key)))
                                        .map(([key, value]) => (
                                            <SelectItem key={value} value={String(value)}>
                                                {key}
                                            </SelectItem>
                                        ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Nutritional values */}
                        <div className="space-y-2">
                            <label>Calories per Serving</label>
                            <Input
                                type="number"
                                step="any"
                                {...register('caloriesPerServing', { valueAsNumber: true })}
                                disabled={!isEditMode}
                            />
                        </div>

                        <div className="space-y-2">
                            <label>Total Fat (g)</label>
                            <Input
                                type="number"
                                step="any"
                                {...register('totalFat', { valueAsNumber: true })}
                                disabled={!isEditMode}
                            />
                        </div>

                        <div className="space-y-2">
                            <label>Protein (g)</label>
                            <Input
                                type="number"
                                step="any"
                                {...register('protein', { valueAsNumber: true })}
                                disabled={!isEditMode}
                            />
                        </div>

                        <div className="space-y-2">
                            <label>Carbohydrates (g)</label>
                            <Input
                                type="number"
                                step="any"
                                {...register('carbohydrates', { valueAsNumber: true })}
                                disabled={!isEditMode}
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
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={updateMutation.isPending}
                                >
                                    {updateMutation.isPending ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        'Save Changes'
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
                                    Edit
                                </Button>
                                <Button
                                    type="button"
                                    variant="destructive"
                                    onClick={() => setDeleteModalOpen(true)}
                                >
                                    Delete
                                </Button>
                            </>
                        )}
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};