import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DietType } from '@/types/diet';
import { Loader2 } from 'lucide-react';
import { UseFormRegister, UseFormSetValue } from 'react-hook-form';

interface BaseDietDialogProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children?: ReactNode;
    isLoading?: boolean;
    register: UseFormRegister<any>;
    setValue: UseFormSetValue<any>;
    defaultValues?: {
        name?: string;
        description?: string;
        type?: DietType;
        duration?: number;
        calories?: number;
        startDate?: string;
        endDate?: string;
        isActive?: boolean;
        nutritionInfoIds?: number[];
    };
    isDisabled?: boolean;
    footerContent: ReactNode;
}

export default function BaseDietDialog({
    isOpen,
    onClose,
    title,
    children,
    isLoading = false,
    register,
    setValue,
    defaultValues = {},
    isDisabled = false,
    footerContent,
}: BaseDietDialogProps) {
    const { t } = useTranslation();

    // Create an array of diet types for rendering select options
    const dietTypes = [
        { value: DietType.Unknown, label: t('diet.types.0') },
        { value: DietType.Standard, label: t('diet.types.1') },
        { value: DietType.Mediterranean, label: t('diet.types.2') },
        { value: DietType.LowCarb, label: t('diet.types.3') },
        { value: DietType.Ketogenic, label: t('diet.types.4') },
        { value: DietType.Vegetarian, label: t('diet.types.5') },
        { value: DietType.Vegan, label: t('diet.types.6') },
        { value: DietType.PaleoStyle, label: t('diet.types.7') },
        { value: DietType.GlutenFree, label: t('diet.types.8') },
        { value: DietType.DairyFree, label: t('diet.types.9') },
        { value: DietType.LowFat, label: t('diet.types.10') },
        { value: DietType.LowSodium, label: t('diet.types.11') },
        { value: DietType.DiabetesFriendly, label: t('diet.types.12') },
        { value: DietType.HighProtein, label: t('diet.types.13') },
        { value: DietType.WeightLoss, label: t('diet.types.14') },
        { value: DietType.WeightGain, label: t('diet.types.15') },
        { value: DietType.Elimination, label: t('diet.types.16') },
        { value: DietType.Custom, label: t('diet.types.99') }
    ];

    if (isLoading) {
        return (
            <Dialog open={isOpen} onOpenChange={onClose}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>{title}</DialogTitle>
                    </DialogHeader>
                    <div className="flex justify-center p-6">
                        <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col p-0 overflow-hidden">
                <DialogHeader className="px-6 pt-6 pb-2">
                    <DialogTitle>{title}</DialogTitle>
                </DialogHeader>

                <div className="flex-1 overflow-auto px-6 py-2" style={{ maxHeight: 'calc(90vh - 10rem)' }}>
                    <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label>{t('diet.name')}</label>
                                <Input
                                    {...register('name', { required: true })}
                                    disabled={isDisabled}
                                    placeholder={t('diet.namePlaceholder')}
                                />
                            </div>

                            <div className="space-y-2">
                                <label>{t('diet.type')}</label>
                                <Select
                                    disabled={isDisabled}
                                    onValueChange={(value) => setValue('type', Number(value))}
                                    defaultValue={defaultValues.type !== undefined 
                                        ? String(defaultValues.type) 
                                        : String(DietType.Standard)}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {dietTypes.map((type) => (
                                            <SelectItem key={type.value} value={String(type.value)}>
                                                {type.label}
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
                                    disabled={isDisabled}
                                    placeholder="7"
                                />
                            </div>

                            <div className="space-y-2">
                                <label>{t('diet.calories')}</label>
                                <Input
                                    type="number"
                                    {...register('calories', { required: true, min: 0 })}
                                    disabled={isDisabled}
                                    placeholder="2000"
                                />
                            </div>
                            
                            <div className="space-y-2 flex items-center">
                                <label className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        {...register('isActive')}
                                        disabled={isDisabled}
                                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary dark:border-gray-600 dark:bg-gray-700"
                                    />
                                    <span>{t('diet.isActive')}</span>
                                </label>
                            </div>

                            <div className="col-span-2 space-y-2">
                                <label>{t('diet.description')}</label>
                                <Textarea
                                    {...register('description', { required: true })}
                                    disabled={isDisabled}
                                    className="min-h-[100px]"
                                    placeholder={t('diet.descriptionPlaceholder')}
                                />
                            </div>
                        </div>

                        {children}
                    </form>
                </div>

                <DialogFooter className="px-6 py-4 border-t">
                    <div className="flex justify-end space-x-2 w-full">
                        {footerContent}
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
