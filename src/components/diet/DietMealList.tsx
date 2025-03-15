// src/components/diet/DietMealList.tsx
import { useTranslation } from 'react-i18next';
import { MealListResponse } from '@/types/meal';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useMealStore } from '@/stores/meal-store';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { useState } from 'react';
import { DataTablePagination } from '@/components/common/DataTablePagination';

interface DietMealListProps {
  meals?: MealListResponse[];
  isEditMode?: boolean;
  onRemoveMeal?: (mealId: number) => void;
}

export default function DietMealList({ meals, isEditMode = false, onRemoveMeal }: DietMealListProps) {
  const { t } = useTranslation();
  const setSelectedMealId = useMealStore((state) => state.setSelectedMealId);
  const setDetailModalOpen = useMealStore((state) => state.setDetailModalOpen);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5); // Number of meals per page

  if (!meals || meals.length === 0) {
    return (
      <Card className="mt-4 mb-4 card">
        <CardContent className="text-center py-6 text-muted-foreground">
          {t('diet.noMealsAdded')}
        </CardContent>
      </Card>
    );
  }

  const handleRowClick = (meal: MealListResponse) => {
    // Only open detail modal for existing meals (positive IDs)
    if (meal.id && meal.id > 0) {
      setSelectedMealId(meal.id);
      setDetailModalOpen(true);
    }
    // For temporary meals, do nothing as they don't have details yet
  };

  const handleRemove = (e: React.MouseEvent, mealId: number) => {
    e.stopPropagation(); // Prevent row click event
    e.preventDefault(); // Prevent form submission
    
    // For temporary meals (negative IDs) or valid existing meals
    if (onRemoveMeal && (mealId < 0 || mealId > 0)) {
      onRemoveMeal(mealId);
    }
  };

  // Calculate pagination
  const totalItems = meals.length;
  const paginatedMeals = meals.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1); // Reset to first page when changing page size
  };

  return (
    <Card className="mt-4 mb-4 card">
      <CardHeader className="py-3 px-4">
        <CardTitle className="text-base">{t('meal.list.title')}</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="max-h-[300px] overflow-auto">
          <Table>
            <TableHeader className="sticky top-0 bg-background z-10">
              <TableRow>
                <TableHead className="w-[40%]">{t('meal.name')}</TableHead>
                <TableHead className="w-[30%]">{t('meal.type')}</TableHead>
                <TableHead className="w-[20%]">{t('meal.time')}</TableHead>
                {isEditMode && <TableHead className="w-[10%]"></TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedMeals.map((meal, index) => (
                <TableRow 
                  key={meal.id ? `meal-${meal.id}` : `temp-meal-${index}`}
                  className={`cursor-pointer hover:bg-muted/50 transition-colors ${meal.id < 0 ? 'border-l-4 border-l-primary' : ''}`}
                  onClick={() => handleRowClick(meal)}
                >
                  <TableCell className="font-medium">
                    {meal.name}
                    {meal.id < 0 && <span className="ml-2 text-xs text-primary">{t('common.new')}</span>}
                  </TableCell>
                  <TableCell>{t(`meal.types.${meal.mealType.toString()}`)}</TableCell>
                  <TableCell>
                    {meal.startTime ? format(new Date(meal.startTime), 'HH:mm') : '-'}
                  </TableCell>
                  {isEditMode && (
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        type="button"
                        onClick={(e) => handleRemove(e, meal.id || 0)}
                        className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                        disabled={!meal.id} // Disable the button if there's no meal ID
                      >
                        <Trash2 className="h-4 w-4" />  
                      </Button>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        {totalItems > pageSize && (
          <div className="p-4 border-t">
            <DataTablePagination
              currentPage={currentPage}
              pageSize={pageSize}
              totalItems={totalItems}
              onPageChange={setCurrentPage}
              onPageSizeChange={handlePageSizeChange}
              pageSizeOptions={[5, 10, 25, 50]}
              showPageSizeSelector={true}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}