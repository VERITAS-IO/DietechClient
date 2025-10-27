import { useTranslation } from 'react-i18next';
import { useNutritionInfoQuery } from '@/hooks/nutrition-hooks';
import { useNutritionStore } from '@/stores/nutrition-store';
import { NutritionInfoListItem, ServingUnit, FoodCategory } from '@/types/nutrition';
import { nutritionService } from '@/services/nutrition-service';
import { Badge } from '@/components/ui/badge';
import { CardDataGrid, CardColumn } from '@/components/ui/card-data-grid';
import { CardDataGridFilter, FilterOption } from '@/components/ui/card-data-grid-filter';
import { NutritionInfoDetail as NutritionInfoDetailDialog } from './NutritionInfoDetail';
import { NutritionInfoDelete } from './NutritionInfoDelete';
import { NutritionInfoCreate } from './NutritionInfoCreate';
import { useState, useEffect } from 'react';

export const NutritionInfoCardList = () => {
    const { t } = useTranslation();
    const filters = useNutritionStore((state) => state.filters);
    const setFilters = useNutritionStore((state) => state.setFilters);
    const resetFilters = useNutritionStore((state) => state.resetFilters);
    const setSelectedNutritionInfo = useNutritionStore((state) => state.setSelectedNutritionInfo);
    const setDetailModalOpen = useNutritionStore((state) => state.setDetailModalOpen);
    
    // Local state for active filters to be used with CardDataGridFilter
    const [activeFilters, setActiveFilters] = useState<Record<string, any>>({
        search: filters.name || '',
        servingUnit: filters.servingUnit || 'all',
        foodCategory: filters.foodCategory || 'all',
        minCalories: filters.minCalories || '',
        maxCalories: filters.maxCalories || ''
    });

    // Update local filter state when store filters change
    useEffect(() => {
        setActiveFilters({
            search: filters.name || '',
            servingUnit: filters.servingUnit || 'all',
            foodCategory: filters.foodCategory || 'all',
            minCalories: filters.minCalories || '',
            maxCalories: filters.maxCalories || ''
        });
    }, [filters]);
    
    // Query nutrition info items with current filters
    const { data, isLoading, error } = useNutritionInfoQuery(filters);

    // Handle card click to show nutrition details
    const handleCardClick = async (item: NutritionInfoListItem) => {
        try {
            const details = await nutritionService.getById(item.id);
            setSelectedNutritionInfo(details);
            setDetailModalOpen(true);
        } catch (error) {
        }
    };

    // Handle filter changes from the filter component
    const handleFilterChange = (newFilters: Record<string, any>) => {
        const updatedFilters = { ...filters };
        
        // Handle search
        if ('search' in newFilters) {
            updatedFilters.name = newFilters.search || undefined;
        }
        
        // Handle serving unit
        if ('servingUnit' in newFilters) {
            updatedFilters.servingUnit = newFilters.servingUnit && newFilters.servingUnit !== 'all' 
                ? newFilters.servingUnit
                : undefined;
        }
        
        // Handle food category
        if ('foodCategory' in newFilters) {
            updatedFilters.foodCategory = newFilters.foodCategory && newFilters.foodCategory !== 'all' 
                ? newFilters.foodCategory
                : undefined;
        }
        
        // Handle calories range
        if ('minCalories' in newFilters) {
            updatedFilters.minCalories = newFilters.minCalories ? Number(newFilters.minCalories) : undefined;
        }
        
        if ('maxCalories' in newFilters) {
            updatedFilters.maxCalories = newFilters.maxCalories ? Number(newFilters.maxCalories) : undefined;
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
            servingUnit: 'all',
            foodCategory: 'all',
            minCalories: '',
            maxCalories: ''
        });
    };

    // Define filter options
    const filterOptions: FilterOption[] = [
        {
            id: 'servingUnit',
            label: t('dashboard.nutrition.list.columns.unit'),
            type: 'select',
            options: [
                { value: 'Grams', label: 'Grams' },
                { value: 'Milliliters', label: 'Milliliters' },
                { value: 'Pieces', label: 'Pieces' },
                { value: 'Cups', label: 'Cups' },
                { value: 'Tablespoons', label: 'Tablespoons' }
            ],
            placeholder: t('dashboard.nutrition.filters.selectUnit')
        },
        {
            id: 'foodCategory',
            label: t('dashboard.nutrition.list.columns.category'),
            type: 'select',
            options: [
                { value: 'Dairy', label: 'Dairy' },
                { value: 'Proteins', label: 'Proteins' },
                { value: 'Grains', label: 'Grains' },
                { value: 'Vegetables', label: 'Vegetables' },
                { value: 'Fruits', label: 'Fruits' }
            ],
            placeholder: t('dashboard.nutrition.filters.selectCategory')
        },
        {
            id: 'minCalories',
            label: t('dashboard.nutrition.filters.minCalories'),
            type: 'number',
            placeholder: '0'
        },
        {
            id: 'maxCalories',
            label: t('dashboard.nutrition.filters.maxCalories'),
            type: 'number',
            placeholder: '1000'
        }
    ];

    // Define columns for the card data grid
    const columns: CardColumn<NutritionInfoListItem>[] = [
        {
            key: 'name',
            title: t('dashboard.nutrition.list.columns.name'),
            primary: true
        },
        {
            key: 'servingSize',
            title: t('dashboard.nutrition.list.columns.servingSize'),
            secondary: true,
            render: (item) => `${item.servingSize} ${item.servingUnit}`
        },
        {
            key: 'foodCategory',
            title: t('dashboard.nutrition.list.columns.category'),
            header: true,
            render: (item) => (
                <Badge variant="secondary">
                    {item.foodCategory}
                </Badge>
            )
        },
        {
            key: 'calories',
            title: t('dashboard.nutrition.list.columns.calories'),
            render: (item) => item.caloriesPerServing ? `${item.caloriesPerServing} kcal` : '-'
        },
        {
            key: 'macros',
            title: t('dashboard.nutrition.macronutrients'),
            footer: true,
            render: (item) => (
                <div className="flex gap-2">
                    <Badge variant="outline">
                        {t('dashboard.nutrition.list.columns.protein')}: {item.protein || '0'}g
                    </Badge>
                    <Badge variant="outline">
                        {t('dashboard.nutrition.list.columns.carbs')}: {item.carbohydrates || '0'}g
                    </Badge>
                    <Badge variant="outline">
                        {t('dashboard.nutrition.list.columns.fat')}: {item.totalFat || '0'}g
                    </Badge>
                </div>
            )
        }
    ];

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">{t('dashboard.nutrition.list.title')}</h2>
                <NutritionInfoCreate />
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
                    currentPage: filters.pageNumber,
                    pageSize: filters.pageSize,
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

            <NutritionInfoDetailDialog />
            <NutritionInfoDelete />
        </div>
    );
}; 