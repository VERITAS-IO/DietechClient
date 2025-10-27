import { useTranslation } from 'react-i18next';
import { useQueryMeals } from '@/hooks/meal-hooks';
import { useMealStore } from '@/stores/meal-store';
import { MealListResponse, MealType, MealOrder } from '@/types/meal';
import { format } from 'date-fns';
import { Plus, Clock } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from '@/components/ui/badge';
import { CardDataGrid, CardColumn } from '@/components/ui/card-data-grid';
import { CardDataGridFilter, FilterOption } from '@/components/ui/card-data-grid-filter';
import MealDetailDialog from './MealDetailDialog';
import MealCreateDialog from './MealCreateDialog';
import MealUpdateDialog from './MealUpdateDialog';
import { useState, useEffect } from 'react';

export default function MealCardList() {
    const { t } = useTranslation();
    const filters = useMealStore((state) => state.filters);
    const setFilters = useMealStore((state) => state.setFilters);
    const resetFilters = useMealStore((state) => state.resetFilters);
    const setSelectedMealId = useMealStore((state) => state.setSelectedMealId);
    const setDetailModalOpen = useMealStore((state) => state.setDetailModalOpen);
    const setCreateMealModalOpen = useMealStore((state) => state.setCreateMealModalOpen);
    
    // Local state for active filters to be used with CardDataGridFilter
    const [activeFilters, setActiveFilters] = useState<Record<string, any>>({
        search: filters.searchTerm || '',
        mealType: filters.mealType || 'all',
        mealOrder: filters.mealOrder || 'all',
        orderBy: filters.orderBy || 'all'
    });

    // Update local filter state when store filters change
    useEffect(() => {
        setActiveFilters({
            search: filters.searchTerm || '',
            mealType: filters.mealType || 'all',
            mealOrder: filters.mealOrder || 'all',
            orderBy: filters.orderBy || 'all'
        });
    }, [filters]);

    // Query meals with current filters
    const { data, isLoading, error } = useQueryMeals(filters);

    // Handle card click to show meal details
    const handleCardClick = (meal: MealListResponse) => {
        setSelectedMealId(meal.id);
        setDetailModalOpen(true);
    };

    // Handle filter changes from the filter component
    const handleFilterChange = (newFilters: Record<string, any>) => {
        const updatedFilters = { ...filters };
        
        // Handle search
        if ('search' in newFilters) {
            updatedFilters.searchTerm = newFilters.search || undefined;
        }
        
        // Handle meal type
        if ('mealType' in newFilters) {
            updatedFilters.mealType = newFilters.mealType && newFilters.mealType !== 'all' 
                ? newFilters.mealType as MealType 
                : undefined;
        }
        
        // Handle meal order
        if ('mealOrder' in newFilters) {
            updatedFilters.mealOrder = newFilters.mealOrder && newFilters.mealOrder !== 'all' 
                ? newFilters.mealOrder as MealOrder 
                : undefined;
        }
        
        // Handle sorting
        if ('orderBy' in newFilters) {
            updatedFilters.orderBy = newFilters.orderBy && newFilters.orderBy !== 'all' 
                ? newFilters.orderBy 
                : undefined;
        }
        
        // Update filters and reset to first page
        setFilters({ 
            ...updatedFilters,
            pageNumber: 1 
        });
    };

    // Reset all filters
    const handleResetFilters = () => {
        resetFilters();
        setActiveFilters({
            search: '',
            mealType: 'all',
            mealOrder: 'all',
            orderBy: 'all'
        });
    };

    // Get meal type name for display
    const getMealTypeName = (mealType: MealType): string => {
        return t(`meal.types.${mealType.toLowerCase()}`);
    };

    // ✅ Filter Options (Rehberinizden: String literals kullan)
    const filterOptions: FilterOption[] = [
        {
            id: 'mealType',
            label: t('meal.type'),
            type: 'select',
            options: [
                { value: 'Breakfast', label: t('meal.types.breakfast') },
                { value: 'Lunch', label: t('meal.types.lunch') },
                { value: 'Dinner', label: t('meal.types.dinner') },
                { value: 'Snack', label: t('meal.types.snack') },
                { value: 'PreWorkout', label: t('meal.types.preworkout') },
                { value: 'PostWorkout', label: t('meal.types.postworkout') },
                { value: 'Custom', label: t('meal.types.custom') },
            ],
            placeholder: t('meal.filterType')
        },
        {
            id: 'mealOrder',
            label: t('meal.order'),
            type: 'select',
            options: [
                { value: 'FirstMeal', label: t('meal.orders.firstmeal') },
                { value: 'SecondMeal', label: t('meal.orders.secondmeal') },
                { value: 'ThirdMeal', label: t('meal.orders.thirdmeal') },
                { value: 'FourthMeal', label: t('meal.orders.fourthmeal') },
                { value: 'FifthMeal', label: t('meal.orders.fifthmeal') },
                { value: 'SixthMeal', label: t('meal.orders.sixthmeal') },
                { value: 'SeventhMeal', label: t('meal.orders.seventhmeal') },
                { value: 'EighthMeal', label: t('meal.orders.eighthmeal') },
                { value: 'NinthMeal', label: t('meal.orders.ninthmeal') },
                { value: 'TenthMeal', label: t('meal.orders.tenthmeal') },
            ],
            placeholder: t('meal.filterOrder')
        },
        {
            id: 'orderBy',
            label: t('common.sort'),
            type: 'select',
            options: [
                { value: 'name', label: t('meal.name') },
                { value: 'startTime', label: t('meal.time') },
                { value: 'mealType', label: t('meal.type') }
            ],
            placeholder: t('common.sortBy')
        }
    ];

    // Define columns for the card data grid
    const columns: CardColumn<MealListResponse>[] = [
        {
            key: 'name',
            title: t('meal.name'),
            primary: true
        },
        {
            key: 'description',
            title: t('meal.description'),
            secondary: true,
            render: (meal) => meal.description || '-'
        },
        {
            key: 'mealType',
            title: t('meal.type'),
            header: true,
            render: (meal) => (
                <Badge variant="secondary">
                    {getMealTypeName(meal.mealType)}
                </Badge>
            )
        },
        {
            key: 'time',
            title: t('meal.time'),
            render: (meal) => (
                <div className="flex items-center">
                    <Clock className="mr-1 h-3.5 w-3.5 text-muted-foreground" />
                    {format(new Date(meal.startTime), 'HH:mm')} - {format(new Date(meal.endTime), 'HH:mm')}
                </div>
            )
        },
        {
            key: 'dietId',
            title: t('meal.dietId'),
            render: (meal) => meal.dietId || '-'
        }
    ];

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">{t('meal.list.title')}</h2>
                <Button onClick={() => setCreateMealModalOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    {t('meal.create')}
                </Button>
            </div>
            
            <CardDataGridFilter
                filterOptions={filterOptions}
                onFilterChange={handleFilterChange}
                onResetFilters={handleResetFilters}
                activeFilters={activeFilters}
                showFilterToggle={true}
                searchColumn="search"
            />
            
            <CardDataGrid
                data={data?.items || []}
                columns={columns}
                loading={isLoading}
                error={error}
                onCardClick={handleCardClick}
                pagination={data ? {
                    currentPage: data.pageNumber,
                    pageSize: data.pageSize,
                    totalItems: data.totalCount,
                    onPageChange: (page) => setFilters({ ...filters, pageNumber: page }),
                    onPageSizeChange: (size) => setFilters({ 
                        ...filters,
                        pageSize: size,
                        pageNumber: 1
                    }),
                    pageSizeOptions: [5, 10, 25, 50],
                    showPageSizeSelector: true
                } : undefined}
                layoutOptions={{
                    grid: { xs: 1, sm: 1, md: 1, lg: 1 },
                    cardSize: 'default',
                    vertical: true
                }}
            />

            <MealDetailDialog />
            <MealCreateDialog />
            <MealUpdateDialog />
        </div>
    );
} 