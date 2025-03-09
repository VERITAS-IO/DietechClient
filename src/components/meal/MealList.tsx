import { useTranslation } from 'react-i18next';
import { useQueryMeals } from '@/hooks/meal-hooks';
import { useMealStore } from '@/stores/meal-store';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Loader2, AlertCircle, Plus } from 'lucide-react';
import { DataTablePagination } from '@/components/common/DataTablePagination';
import { MealListResponse, MealType } from '@/types/meal';
import { format } from 'date-fns';
import MealDetailDialog from './MealDetailDialog';
import MealFilter from './MealFilter';
import MealCreateDialog from './MealCreateDialog';
import MealUpdateDialog from './MealUpdateDialog';

export default function MealList() {
    const { t } = useTranslation();
    const filters = useMealStore((state) => state.filters);
    const setFilters = useMealStore((state) => state.setFilters);
    const setSelectedMealId = useMealStore((state) => state.setSelectedMealId);
    const setDetailModalOpen = useMealStore((state) => state.setDetailModalOpen);
    const setCreateMealModalOpen = useMealStore((state) => state.setCreateMealModalOpen);
    
    const { data, isLoading, error, isError } = useQueryMeals(filters);

    const handleRowClick = (meal: MealListResponse) => {
        setSelectedMealId(meal.id);
        setDetailModalOpen(true);
    };

    const getMealTypeName = (mealType: number): string => {
        const mealTypeKeys = Object.keys(MealType)
            .filter(key => !isNaN(Number(key)))
            .map(key => Number(key));
        
        const mealTypeKey = mealTypeKeys.find(key => key === mealType);
        return mealTypeKey !== undefined 
            ? t(`meal.types.${MealType[mealTypeKey].toLowerCase()}`) 
            : t('meal.types.unknown');
    };

    const renderTableContent = () => {
        if (isLoading) {
            return (
                <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                        <Loader2 className="h-8 w-8 animate-spin mx-auto" />
                        <span className="mt-2">{t('common.loading')}</span>
                    </TableCell>
                </TableRow>
            );
        }

        if (isError) {
            return (
                <TableRow>
                    <TableCell colSpan={5} className="h-24">
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>
                                {error?.message || t('common.error')}
                            </AlertDescription>
                        </Alert>
                    </TableCell>
                </TableRow>
            );
        }

        if (!data?.items || data.items.length === 0) {
            return (
                <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                        {t('meal.noData')}
                    </TableCell>
                </TableRow>
            );
        }

        return data.items.map((meal: MealListResponse) => (
            <TableRow
                key={meal.id}
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => handleRowClick(meal)}
            >
                <TableCell>{meal.name}</TableCell>
                <TableCell>{getMealTypeName(meal.mealType)}</TableCell>
                <TableCell>{format(new Date(meal.startTime), 'HH:mm')} - {format(new Date(meal.endTime), 'HH:mm')}</TableCell>
                <TableCell>{meal.dietId}</TableCell>
                <TableCell className="truncate max-w-md">{meal.description}</TableCell>
            </TableRow>
        ));
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">{t('meal.list.title')}</h2>
                <Button onClick={() => setCreateMealModalOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    {t('meal.create')}
                </Button>
            </div>
            
            <MealFilter />
            
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>{t('meal.name')}</TableHead>
                            <TableHead>{t('meal.type')}</TableHead>
                            <TableHead>{t('meal.time')}</TableHead>
                            <TableHead>{t('meal.dietId')}</TableHead>
                            <TableHead>{t('meal.description')}</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {renderTableContent()}
                    </TableBody>
                </Table>
            </div>

            {data && data.totalCount > 0 && (
                <DataTablePagination
                    currentPage={filters.pageNumber}
                    pageSize={filters.pageSize}
                    totalItems={data.totalCount}
                    onPageChange={(page) => setFilters({ pageNumber: page })}
                />
            )}

            <MealDetailDialog />
            <MealCreateDialog />
            <MealUpdateDialog />
        </div>
    );
}
