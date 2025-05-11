import { useTranslation } from 'react-i18next';
import { useQueryDiets } from '@/hooks/diet-hooks';
import { useDietStore } from '@/stores/diet-store';
import { DietListResponse, DietType } from '@/types/diet';
import { CardDataGrid, CardColumn } from '@/components/ui/card-data-grid';
import { CardDataGridFilter, FilterOption } from '@/components/ui/card-data-grid-filter';
import { Badge } from '@/components/ui/badge';
import DietDetailDialog from './DietDetailDialog';
import { useState, useEffect } from 'react';

export default function DietCardList() {
    const { t } = useTranslation();
    const filters = useDietStore((state) => state.filters);
    const setFilters = useDietStore((state) => state.setFilters);
    const setSelectedDietId = useDietStore((state) => state.setSelectedDietId);
    const setDetailModalOpen = useDietStore((state) => state.setDetailModalOpen);
    const isDetailModalOpen = useDietStore((state) => state.isDetailModalOpen);
    const resetFilters = useDietStore((state) => state.resetFilters);
    
    const [activeFilters, setActiveFilters] = useState<Record<string, any>>({
        search: filters.searchTerm || '',
        dietType: filters.dietType ? filters.dietType.toString() : 'all',
        minCalories: filters.minCalories || '',
        maxCalories: filters.maxCalories || ''
    });

    // Debug log
    console.log('DietCardList rendered:', { filters, activeFilters });

    // Update activeFilters when filters change
    useEffect(() => {
        setActiveFilters({
            search: filters.searchTerm || '',
            dietType: filters.dietType ? filters.dietType.toString() : 'all',
            minCalories: filters.minCalories || '',
            maxCalories: filters.maxCalories || ''
        });
    }, [filters]);

    // Query diets with filters
    const { data, isLoading, error } = useQueryDiets(filters);

    // Handle card click to show diet details
    const handleCardClick = (diet: DietListResponse) => {
        setSelectedDietId(diet.id);
        setDetailModalOpen(true);
    };

    // Handle filter changes
    const handleFilterChange = (newFilters: Record<string, any>) => {
        
        const updatedFilters = { ...filters };
        
        // Handle search
        if ('search' in newFilters) {
            updatedFilters.searchTerm = newFilters.search || undefined;
        }
        
        // Handle diet type
        if ('dietType' in newFilters) {
            updatedFilters.dietType = newFilters.dietType && newFilters.dietType !== 'all' 
                ? Number(newFilters.dietType) 
                : undefined;
        }
        
        // Handle calories
        if ('minCalories' in newFilters) {
            updatedFilters.minCalories = newFilters.minCalories ? Number(newFilters.minCalories) : undefined;
        }
        
        if ('maxCalories' in newFilters) {
            updatedFilters.maxCalories = newFilters.maxCalories ? Number(newFilters.maxCalories) : undefined;
        }
        
        console.log('Setting new filters:', updatedFilters);
        
        // Update filters and reset to first page
        setFilters({ 
            ...updatedFilters,
            pageNumber: 1 
        });
    };

    // Reset all filters including search
    const handleResetFilters = () => {
        console.log('handleResetFilters called');
        resetFilters();
        setActiveFilters({
            search: '',
            dietType: 'all',
            minCalories: '',
            maxCalories: ''
        });
    };

    // Define filter options
    const filterOptions: FilterOption[] = [
        {
            id: 'dietType',
            label: t('diet.type'),
            type: 'select',
            options: Object.entries(DietType)
                .filter(([key]) => !isNaN(Number(key))) // Only use numeric keys
                .map(([key, value]) => ({
                    value: key,
                    label: t(`diet.types.${key}`)
                })),
            placeholder: t('diet.filterType')
        },
        {
            id: 'minCalories',
            label: t('diet.filterMinCalories'),
            type: 'number',
            placeholder: '1000'
        },
        {
            id: 'maxCalories',
            label: t('diet.filterMaxCalories'),
            type: 'number',
            placeholder: '3000'
        }
    ];

    // Define columns for the card data grid
    const columns: CardColumn<DietListResponse>[] = [
        {
            key: 'name',
            title: t('diet.name'),
            primary: true
        },
        {
            key: 'dietDescription',
            title: t('diet.description'),
            secondary: true,
            render: (diet) => diet.dietDescription || '-'
        },
        {
            key: 'dietType',
            title: t('diet.type'),
            header: true,
            render: (diet) => {
                const dietTypeKey = typeof diet.dietType === 'string' ? diet.dietType : diet.dietType.toString();
                return (
                    <Badge variant="secondary">{t(`diet.types.${dietTypeKey}`)}</Badge>
                );
            }
        },
        {
            key: 'dietDuration',
            title: t('diet.duration'),
            render: (diet) => `${diet.dietDuration} ${t('diet.days')}`
        },
        {
            key: 'totalCalories',
            title: t('diet.calories'),
            render: (diet) => `${diet.totalCalories} kcal`
        },
        {
            key: 'isActive',
            title: t('diet.isActive'),
            footer: true,
            render: (diet) => (
                <Badge variant={diet.isActive ? "success" : "secondary"}>
                    {diet.isActive ? t('common.active') : t('common.inactive')}
                </Badge>
            )
        }
    ];

    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-bold">{t('diet.list.title')}</h2>
            
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

            {isDetailModalOpen && <DietDetailDialog />}
        </div>
    );
} 