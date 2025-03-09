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

    return (
        <Card className="mb-4">
            <CardContent className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                        <Select
                            value={filters.dietType?.toString() || 'all'}
                            onValueChange={(value) =>
                                setFilters({ dietType: value !== 'all' ? (value as DietType) : undefined })
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder={t('diet.filterType')} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">{t('common.all')}</SelectItem>
                                {Object.values(DietType).map((type) => (
                                    <SelectItem key={type} value={type}>
                                        {t(`diet.types.${type.toLowerCase()}`)}
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
