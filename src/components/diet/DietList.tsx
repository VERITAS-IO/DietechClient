import { useTranslation } from 'react-i18next';
import { useQueryDiets } from '@/hooks/diet-hooks';
import { useDietStore } from '@/stores/diet-store';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, AlertCircle } from 'lucide-react';
import { DataTablePagination } from '@/components/common/DataTablePagination';
import { DietListResponse } from '@/types/diet';
import DietDetailDialog from './DietDetailDialog';

export default function DietList(){
    const { t } = useTranslation();
    const filters = useDietStore((state) => state.filters);
    const setFilters = useDietStore((state) => state.setFilters);
    const setSelectedDietId = useDietStore((state) => state.setSelectedDietId);
    const setDetailModalOpen = useDietStore((state) => state.setDetailModalOpen);
    
    const { data, isLoading, error, isError } = useQueryDiets(filters);

    console.log('Diet List Data:', data);

    const handleRowClick = (diet: DietListResponse) => {
        setSelectedDietId(diet.id);
        setDetailModalOpen(true);
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
                        {t('diet.noData')}
                    </TableCell>
                </TableRow>
            );
        }

        return data.items.map((diet: DietListResponse) => (
            <TableRow
                key={diet.id}
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => handleRowClick(diet)}
            >
                <TableCell>{diet.name}</TableCell>
                <TableCell>{t(`diet.types.${diet.dietType.toLowerCase()}`)}</TableCell>
                <TableCell>{diet.dietDuration} {t('diet.days')}</TableCell>
                <TableCell>{diet.totalCalories} kcal</TableCell>
                <TableCell className="truncate max-w-md">{diet.dietDescription}</TableCell>
            </TableRow>
        ));
    };

    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-bold">{t('diet.list.title')}</h2>
            
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>{t('diet.name')}</TableHead>
                            <TableHead>{t('diet.type')}</TableHead>
                            <TableHead>{t('diet.duration')}</TableHead>
                            <TableHead>{t('diet.calories')}</TableHead>
                            <TableHead>{t('diet.description')}</TableHead>
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

            <DietDetailDialog />
        </div>
    );
};