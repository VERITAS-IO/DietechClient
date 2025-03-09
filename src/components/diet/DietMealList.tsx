// src/components/diet/DietMealList.tsx
import { useTranslation } from 'react-i18next';
import { MealListResponse } from '@/types/meal';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useMealStore } from '@/stores/meal-store';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

interface DietMealListProps {
  meals?: MealListResponse[];
  isEditMode?: boolean;
  onRemoveMeal?: (mealId: number) => void;
}

export default function DietMealList({ meals, isEditMode = false, onRemoveMeal }: DietMealListProps) {
  const { t } = useTranslation();
  const setSelectedMealId = useMealStore((state) => state.setSelectedMealId);
  const setDetailModalOpen = useMealStore((state) => state.setDetailModalOpen);

  if (!meals || meals.length === 0) {
    return (
      <Card className="mt-6">
        <CardContent className="text-center py-6 text-muted-foreground">
          {t('diet.noMealsAdded')}
        </CardContent>
      </Card>
    );
  }

  const handleRowClick = (meal: MealListResponse) => {
    setSelectedMealId(meal.id);
    setDetailModalOpen(true);
  };

  const handleRemove = (e: React.MouseEvent, mealId: number) => {
    alert("handle remove triggered:"+mealId);
    e.stopPropagation(); // Prevent row click event
    e.preventDefault(); // Prevent form submission
    if (onRemoveMeal && mealId) {
      onRemoveMeal(mealId);
    }
  };

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>{t('meal.list')}</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('meal.name')}</TableHead>
              <TableHead>{t('meal.type')}</TableHead>
              <TableHead>{t('meal.time')}</TableHead>
              {isEditMode && <TableHead className="w-[100px]"></TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {meals.map((meal, index) => (
              <TableRow 
                key={meal.id ? `meal-${meal.id}` : `temp-meal-${index}`} // Use meal.id if available, otherwise use index
                className="cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => handleRowClick(meal)}
              >
                <TableCell className="font-medium">{meal.name}</TableCell>
                <TableCell>{t(`meal.types.${meal.mealType.toString()}`)}</TableCell>
                <TableCell>
                  {meal.startTime ? format(new Date(meal.startTime), 'HH:mm') : '-'}
                </TableCell>
                {isEditMode && (
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      type="button" // Explicitly set type to button to prevent form submission
                      onClick={(e) => handleRemove(e, meal.id || 0)}
                      className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />  
                    </Button>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}