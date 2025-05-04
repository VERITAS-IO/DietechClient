import { useTranslation } from 'react-i18next';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { DietType } from '@/types/diet';
import { useDietStore } from '@/stores/diet-store';
import { Card, CardContent } from '@/components/ui/card';

export default function DietFilters() {
    const { t } = useTranslation();
    const { filters, setFilters, resetFilters } = useDietStore();

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

    return (
        <Card className="mb-4">
            <CardContent className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                        <Select
                            value={filters.dietType !== undefined ? String(filters.dietType) : 'all'}
                            onValueChange={(value) =>
                                setFilters({ dietType: value !== 'all' ? Number(value) as DietType : undefined })
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder={t('diet.filterType')} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">{t('common.all')}</SelectItem>
                                {dietTypes.map((type) => (
                                    <SelectItem key={type.value} value={String(type.value)}>
                                        {type.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Input
                            type="number"
                            placeholder={t('diet.filterMinCalories')}
                            value={filters.minCalories || ''}
                            onChange={(e) =>
                                setFilters({
                                    minCalories: e.target.value ? Number(e.target.value) : undefined,
                                })
                            }
                        />
                    </div>

                    <div>
                        <Input
                            type="number"
                            placeholder={t('diet.filterMaxCalories')}
                            value={filters.maxCalories || ''}
                            onChange={(e) =>
                                setFilters({
                                    maxCalories: e.target.value ? Number(e.target.value) : undefined,
                                })
                            }
                        />
                    </div>

                    <div>
                        <Button
                            variant="outline"
                            className="w-full"
                            onClick={() => resetFilters()}
                        >
                            {t('common.resetFilters')}
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
