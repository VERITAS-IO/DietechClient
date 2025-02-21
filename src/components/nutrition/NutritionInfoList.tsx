import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { AlertCircle, Loader2 } from "lucide-react";
import { useNutritionInfoQuery } from '@/hooks/nutrition-hooks';
import { useNutritionStore } from '@/stores/nutrition-store';
import { NutritionInfoListItem, ServingUnit, FoodCategory } from '@/types/nutrition';
import { NutritionInfoDetail as NutritionInfoDetailDialog } from './NutritionInfoDetail';
import { NutritionInfoDelete } from './NutritionInfoDelete';
import { DataTablePagination } from '@/components/common/DataTablePagination';
import { NutritionInfoFilters } from "./NutritionInfoFilters";
import { nutritionService } from '@/services/nutrition-service';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { t } from "i18next";

export const NutritionInfoList = () => {
    const filters = useNutritionStore((state) => state.filters);
    const setFilters = useNutritionStore((state) => state.setFilters);
    const setSelectedNutritionInfo = useNutritionStore((state) => state.setSelectedNutritionInfo);
    const setDetailModalOpen = useNutritionStore((state) => state.setDetailModalOpen);
    
    const { data, isLoading, error, isError } = useNutritionInfoQuery(filters);

    const handleRowClick = async (item: NutritionInfoListItem) => {
        try {
            const details = await nutritionService.getById(item.id);
            setSelectedNutritionInfo(details);
            setDetailModalOpen(true);
        } catch (error) {
            console.error('Failed to fetch nutrition info details:', error);
        }
    };

    const renderTableContent = () => {
        if (isLoading) {
            return (
                <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
                        <Loader2 className="h-8 w-8 animate-spin mx-auto" />
                        <span className="mt-2">{t('dashboard.nutrition.list.loading')}</span>
                    </TableCell>
                </TableRow>
            );
        }

        if (isError) {
            return (
                <TableRow>
                    <TableCell colSpan={8} className="h-24">
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>
                                {t('dashboard.nutrition.list.error')}
                            </AlertDescription>
                        </Alert>
                    </TableCell>
                </TableRow>
            );
        }

        if (!data?.items?.length) {
            return (
                <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
                        {t('dashboard.nutrition.list.noData')}
                    </TableCell>
                </TableRow>
            );
        }

        return data.items.map((item) => (
            <TableRow
                key={item.id}
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => handleRowClick(item)}
            >
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.servingSize}</TableCell>
                <TableCell>{ServingUnit[item.servingUnit]}</TableCell>
                <TableCell>{FoodCategory[item.foodCategory]}</TableCell>
                <TableCell>{item.caloriesPerServing || '-'}</TableCell>
                <TableCell>{item.protein || '-'}</TableCell>
                <TableCell>{item.carbohydrates || '-'}</TableCell>
                <TableCell>{item.totalFat || '-'}</TableCell>
            </TableRow>
        ));
    }

    return (
        <div className="space-y-4">
        <h2 className="text-2xl font-bold">{t('dashboard.nutrition.list.title')}</h2>
        <NutritionInfoFilters />
        
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>{t('dashboard.nutrition.list.columns.name')}</TableHead>
                        <TableHead>{t('dashboard.nutrition.list.columns.servingSize')}</TableHead>
                        <TableHead>{t('dashboard.nutrition.list.columns.unit')}</TableHead>
                        <TableHead>{t('dashboard.nutrition.list.columns.category')}</TableHead>
                        <TableHead>{t('dashboard.nutrition.list.columns.calories')}</TableHead>
                        <TableHead>{t('dashboard.nutrition.list.columns.protein')}</TableHead>
                        <TableHead>{t('dashboard.nutrition.list.columns.carbs')}</TableHead>
                        <TableHead>{t('dashboard.nutrition.list.columns.fat')}</TableHead>
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

            <NutritionInfoDetailDialog />
            <NutritionInfoDelete />
        </div>
    );
};