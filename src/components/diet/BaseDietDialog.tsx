import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
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
    footerContent
}: BaseDietDialogProps) {
    const { t } = useTranslation();

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
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                </DialogHeader>

                <form className="space-y-4">
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
                                onValueChange={(value) => setValue('type', value)}
                                defaultValue={defaultValues.type || DietType.VEGETARIAN}
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
                        
                        <div className="space-y-2">
                            <label>{t('diet.startDate')}</label>
                            <Input
                                type="date"
                                {...register('startDate')}
                                disabled={isDisabled}
                            />
                        </div>
                        
                        <div className="space-y-2">
                            <label>{t('diet.endDate')}</label>
                            <Input
                                type="date"
                                {...register('endDate')}
                                disabled={isDisabled}
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

                    <div className="flex justify-end space-x-2">
                        {footerContent}
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
