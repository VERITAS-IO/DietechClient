import { useTranslation } from 'react-i18next';
import { useMealStore } from '@/stores/meal-store';
import { MealType } from '@/types/meal';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, X } from 'lucide-react';

export default function MealFilter() {
    const { t } = useTranslation();
    const filters = useMealStore((state) => state.filters);
    const setFilters = useMealStore((state) => state.setFilters);
    const resetFilters = useMealStore((state) => state.resetFilters);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFilters({ searchTerm: e.target.value, pageNumber: 1 });
    };

    const handleMealTypeChange = (value: string) => {
        setFilters({ mealType: value ? parseInt(value) : undefined, pageNumber: 1 });
    };

    const handleSortChange = (value: string) => {
        setFilters({ orderBy: value, pageNumber: 1 });
    };

    const handleResetFilters = () => {
        resetFilters();
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder={t('common.search')}
                            className="pl-8"
                            value={filters.searchTerm || ''}
                            onChange={handleSearchChange}
                        />
                    </div>
                </div>

                <div className="flex flex-row gap-2">
                    <Select
                        value={filters.mealType?.toString() || ''}
                        onValueChange={handleMealTypeChange}
                    >
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder={t('meal.filterType')} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">{t('common.all')}</SelectItem>
                            {Object.keys(MealType)
                                .filter(key => !isNaN(Number(key)))
                                .map(key => (
                                    <SelectItem key={key} value={key}>
                                        {t(`meal.types.${MealType[Number(key)].toLowerCase()}`)}
                                    </SelectItem>
                                ))}
                        </SelectContent>
                    </Select>

                    <Select
                        value={filters.orderBy || ''}
                        onValueChange={handleSortChange}
                    >
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder={t('common.sortBy')} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">{t('common.default')}</SelectItem>
                            <SelectItem value="name:asc">{t('meal.name')} (A-Z)</SelectItem>
                            <SelectItem value="name:desc">{t('meal.name')} (Z-A)</SelectItem>
                            <SelectItem value="mealType:asc">{t('meal.type')} (A-Z)</SelectItem>
                            <SelectItem value="mealType:desc">{t('meal.type')} (Z-A)</SelectItem>
                        </SelectContent>
                    </Select>

                    <Button
                        variant="outline"
                        size="icon"
                        onClick={handleResetFilters}
                        title={t('common.resetFilters')}
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
