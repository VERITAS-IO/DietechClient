import { useTranslation } from 'react-i18next';
import { useMealStore } from '@/stores/meal-store';
import { MealType, MealOrder } from '@/types/meal';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useDebounce } from '@/hooks/use-debounce';

export default function MealFilter() {
    const { t } = useTranslation();
    const filters = useMealStore((state) => state.filters);
    const setFilters = useMealStore((state) => state.setFilters);
    const resetFilters = useMealStore((state) => state.resetFilters);

    const [searchTerm, setSearchTerm] = useState(filters.searchTerm || '');
    const debouncedSearchTerm = useDebounce(searchTerm, 500);

    useEffect(() => {
        setFilters({ searchTerm: debouncedSearchTerm || undefined, pageNumber: 1 });
    }, [debouncedSearchTerm, setFilters]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const handleMealTypeChange = (value: string) => {
        setFilters({ 
            mealType: value && value !== 'all' ? value as MealType : undefined, 
            pageNumber: 1 
        });
    };

    const handleMealOrderChange = (value: string) => {
        setFilters({ 
            mealOrder: value && value !== 'all' ? value as MealOrder : undefined, 
            pageNumber: 1 
        });
    };

    const handleSortChange = (value: string) => {
        console.log("handleSortChange triggered, value:", value);
        setFilters({ 
            orderBy: value && value !== 'all' ? value : undefined, 
            pageNumber: 1 
        });
    };

    const handleResetFilters = () => {
        setSearchTerm('');
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
                            value={searchTerm}
                            onChange={handleSearchChange}
                        />
                    </div>
                </div>

                <div className="flex flex-row gap-2">
                    <Select
                        value={(filters.mealType || 'all')}
                        onValueChange={handleMealTypeChange}
                    >
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder={t('meal.filterType')} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">{t('common.all')}</SelectItem>
                            {Object.entries(MealType)
                                .filter(([key]) => key !== 'Unknown')
                                .map(([key, value]) => (
                                    <SelectItem key={key} value={value}>
                                        {t(`meal.types.${key.toLowerCase()}`)}
                                    </SelectItem>
                                ))}
                        </SelectContent>
                    </Select>

                    <Select
                        value={(filters.mealOrder || 'all')}
                        onValueChange={handleMealOrderChange}
                    >
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder={t('meal.filterOrder')} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">{t('common.all')}</SelectItem>
                            {Object.entries(MealOrder)
                                .filter(([key]) => key !== 'Unknown' && key !== 'Custom')
                                .map(([key, value]) => (
                                    <SelectItem key={key} value={value}>
                                        {t(`meal.orders.${key.toLowerCase()}`)}
                                    </SelectItem>
                                ))}
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
