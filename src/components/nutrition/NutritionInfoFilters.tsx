import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useNutritionStore } from '@/stores/nutrition-store';
import { ServingUnit, FoodCategory } from '@/types/nutrition';

export const NutritionInfoFilters = () => {
    const { filters, setFilters, resetFilters } = useNutritionStore();

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-4 gap-4">
                <Input
                    placeholder="Search by name..."
                    value={filters.name || ''}
                    onChange={(e) => setFilters({ name: e.target.value })}
                />

                <Select
                    value={filters.servingUnit?.toString() || 'all'}
                    onValueChange={(value) => 
                        setFilters({ servingUnit: value === 'all' ? undefined : Number(value) })
                    }
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Select unit" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Units</SelectItem>
                        {Object.entries(ServingUnit)
                            .filter(([key]) => isNaN(Number(key)))
                            .map(([key, value]) => (
                                <SelectItem key={value} value={String(value)}>
                                    {key}
                                </SelectItem>
                            ))}
                    </SelectContent>
                </Select>

                <Select
                    value={filters.foodCategory?.toString() || 'all'}
                    onValueChange={(value) => 
                        setFilters({ foodCategory: value === 'all' ? undefined : Number(value) })
                    }
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {Object.entries(FoodCategory)
                            .filter(([key]) => isNaN(Number(key)))
                            .map(([key, value]) => (
                                <SelectItem key={value} value={String(value)}>
                                    {key}
                                </SelectItem>
                            ))}
                    </SelectContent>
                </Select>

                <div className="flex space-x-2">
                    <Input
                        type="number"
                        placeholder="Min calories"
                        value={filters.minCalories || ''}
                        onChange={(e) => 
                            setFilters({ minCalories: e.target.value ? Number(e.target.value) : undefined })
                        }
                    />
                    <Input
                        type="number"
                        placeholder="Max calories"
                        value={filters.maxCalories || ''}
                        onChange={(e) => 
                            setFilters({ maxCalories: e.target.value ? Number(e.target.value) : undefined })
                        }
                    />
                </div>
            </div>

            <div className="flex justify-end space-x-2">
                <Button
                    variant="outline"
                    onClick={resetFilters}
                >
                    Reset Filters
                </Button>
            </div>
        </div>
    );
};
