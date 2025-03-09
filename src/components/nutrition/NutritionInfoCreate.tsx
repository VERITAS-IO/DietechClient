import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useNutritionStore } from '@/stores/nutrition-store';
import { ServingUnit, FoodCategory, CreateNutritionInfoRequest } from '@/types/nutrition';
import { nutritionService } from '@/services/nutrition-service';
import { useQueryClient } from '@tanstack/react-query';
import { t } from 'i18next';

const formSchema = z.object({
    name: z.string().min(1, { message: t('validation.required') }),
    servingSize: z.number().min(0.1, { message: t('validation.min', { min: 0.1 }) }),
    servingUnit: z.nativeEnum(ServingUnit),
    foodCategory: z.nativeEnum(FoodCategory),
    caloriesPerServing: z.number().min(0, { message: t('validation.min', { min: 0 }) }).optional(),
    protein: z.number().min(0).optional(),
    carbohydrates: z.number().min(0).optional(),
    totalFat: z.number().min(0).optional(),
    fiber: z.number().min(0).optional(),
});

interface Props {
    className?: string;
}

export const NutritionInfoCreate = ({ className }: Props) => {
    const [open, setOpen] = useState(false);
    const queryClient = useQueryClient();
    
    const form = useForm<CreateNutritionInfoRequest>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            servingSize: 100,
            servingUnit: ServingUnit.Grams,
            foodCategory: FoodCategory.Unknown,
            caloriesPerServing: 0,
        },
    });

    const onSubmit = async (data: CreateNutritionInfoRequest) => {
        try {
            // Ensure numeric fields are properly converted
            const request = {
                ...data,
                servingSize: Number(data.servingSize),
                servingUnit: Number(data.servingUnit),
                foodCategory: Number(data.foodCategory),
                caloriesPerServing: data.caloriesPerServing ? Number(data.caloriesPerServing) : undefined,
                protein: data.protein ? Number(data.protein) : undefined,
                carbohydrates: data.carbohydrates ? Number(data.carbohydrates) : undefined,
                totalFat: data.totalFat ? Number(data.totalFat) : undefined,
                fiber: data.fiber ? Number(data.fiber) : undefined,
            };
            
            console.log('Submitting request:', request);
            await nutritionService.create(request);
            queryClient.invalidateQueries({ queryKey: ['nutrition-info', 'list'] });
            setOpen(false);
            form.reset();
        } catch (error) {
            console.error('Failed to create nutrition info:', error);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="default" className={className}>
                    {t('nutrition.create')}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{t('nutrition.createTitle')}</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('nutrition.name')}</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="servingSize"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('nutrition.servingSize')}</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            step="0.1"
                                            {...field}
                                            onChange={(e) => field.onChange(parseFloat(e.target.value))}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="servingUnit"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('nutrition.servingUnit')}</FormLabel>
                                    <Select
                                        onValueChange={(value) => field.onChange(parseInt(value))}
                                        defaultValue={field.value.toString()}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {Object.entries(ServingUnit)
                                                .filter(([key]) => isNaN(Number(key)))
                                                .map(([key, value]) => (
                                                    <SelectItem key={value} value={value.toString()}>
                                                        {t(`nutrition.servingUnits.${key.toLowerCase()}`)}
                                                    </SelectItem>
                                                ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="foodCategory"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('nutrition.foodCategory')}</FormLabel>
                                    <Select
                                        onValueChange={(value) => field.onChange(parseInt(value))}
                                        defaultValue={field.value.toString()}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {Object.entries(FoodCategory)
                                                .filter(([key]) => isNaN(Number(key)))
                                                .map(([key, value]) => (
                                                    <SelectItem key={value} value={value.toString()}>
                                                        {t(`nutrition.foodCategories.${key.toLowerCase()}`)}
                                                    </SelectItem>
                                                ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="caloriesPerServing"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('nutrition.calories')}</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            {...field}
                                            onChange={(e) => field.onChange(parseFloat(e.target.value))}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="protein"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('nutrition.protein')}</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                {...field}
                                                onChange={(e) => field.onChange(parseFloat(e.target.value))}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="carbohydrates"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('nutrition.carbs')}</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                {...field}
                                                onChange={(e) => field.onChange(parseFloat(e.target.value))}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="totalFat"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('nutrition.fat')}</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                {...field}
                                                onChange={(e) => field.onChange(parseFloat(e.target.value))}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="fiber"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('nutrition.fiber')}</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                {...field}
                                                onChange={(e) => field.onChange(parseFloat(e.target.value))}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="flex justify-end space-x-2 pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setOpen(false)}
                            >
                                {t('common.cancel')}
                            </Button>
                            <Button type="submit">
                                {t('common.create')}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};
