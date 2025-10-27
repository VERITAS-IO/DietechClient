import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus, Loader2 } from "lucide-react";
import { useDebounce } from '@/hooks/use-debounce';
import { nutritionService } from '@/services/nutrition-service';
import { NutritionInfoListItem } from '@/types/nutrition';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";

interface NutritionSearchProps {
    selectedNutritionIds: number[];
    onSelectNutrition: (nutritionId: number) => void;
    onRemoveNutrition: (nutritionId: number) => void;
    onAddNewNutrition: () => void;
}

export default function NutritionSearch({
    selectedNutritionIds,
    onSelectNutrition,
    onRemoveNutrition,
    onAddNewNutrition
}: NutritionSearchProps) {
    const { t } = useTranslation();
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState<NutritionInfoListItem[]>([]);
    const [selectedItems, setSelectedItems] = useState<NutritionInfoListItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    const debouncedSearchTerm = useDebounce(searchTerm, 300);

    // Fetch search results when the debounced search term changes
    useEffect(() => {
        const fetchSearchResults = async () => {
            if (!debouncedSearchTerm || debouncedSearchTerm.length < 2) {
                setSearchResults([]);
                setError(null);
                return;
            }

            setIsLoading(true);
            setError(null);
            
            try {
                const response = await nutritionService.query({
                    pageNumber: 1,
                    pageSize: 10,
                    name: debouncedSearchTerm
                });
                
                setSearchResults(response.items || []);
            } catch (error) {
                setError(t('nutrition.searchError'));
                setSearchResults([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchSearchResults();
    }, [debouncedSearchTerm, t]);

    // Fetch selected nutrition items when selectedNutritionIds changes
    useEffect(() => {
        const fetchSelectedItems = async () => {
            if (!selectedNutritionIds.length) {
                setSelectedItems([]);
                return;
            }

            try {
                const items = await Promise.all(
                    selectedNutritionIds.map(id => nutritionService.getById(id))
                );
                setSelectedItems(items);
            } catch (error) {
            }
        };

        fetchSelectedItems();
    }, [selectedNutritionIds]);

    const handleSelectNutrition = (item: NutritionInfoListItem) => {
        if (!selectedNutritionIds.includes(item.id)) {
            onSelectNutrition(item.id);
            setSearchTerm('');
            setSearchResults([]);
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center space-x-2">
                <div className="relative flex-1">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder={t('nutrition.search')}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-8"
                    />
                </div>
                <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onAddNewNutrition();
                    }}
                    className="whitespace-nowrap"
                    type="button"
                >
                    <Plus className="h-4 w-4 mr-2" />
                    {t('nutrition.addNew')}
                </Button>
            </div>

            {/* Loading state */}
            {isLoading && (
                <div className="text-center py-4">
                    <Loader2 className="h-5 w-5 animate-spin mx-auto" />
                    <p className="text-sm text-muted-foreground mt-2">{t('common.loading')}</p>
                </div>
            )}

            {/* Error state */}
            {error && (
                <div className="text-center py-4 text-destructive">
                    <p>{error}</p>
                </div>
            )}

            {/* No results state */}
            {!isLoading && !error && debouncedSearchTerm.length >= 2 && searchResults.length === 0 && (
                <div className="text-center py-4 text-muted-foreground">
                    {t('nutrition.noResults')}
                </div>
            )}

            {/* Search Results */}
            {!isLoading && searchResults.length > 0 && (
                <Card className="border shadow-sm">
                    <CardContent className="p-0">
                        <ScrollArea className="h-[200px]">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>{t('nutrition.name')}</TableHead>
                                        <TableHead>{t('nutrition.calories')}</TableHead>
                                        <TableHead>{t('nutrition.servingSize')}</TableHead>
                                        <TableHead></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {searchResults.map((item) => (
                                        <TableRow 
                                            key={item.id}
                                            className="cursor-pointer hover:bg-muted/50"
                                        >
                                            <TableCell>{item.name}</TableCell>
                                            <TableCell>{item.caloriesPerServing || '-'}</TableCell>
                                            <TableCell>
                                                {item.servingSize} {t(`nutrition.servingUnits.${item.servingUnit.toString().toLowerCase()}`)}
                                            </TableCell>
                                            <TableCell>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleSelectNutrition(item)}
                                                    disabled={selectedNutritionIds.includes(item.id)}
                                                >
                                                    {selectedNutritionIds.includes(item.id) 
                                                        ? t('nutrition.added') 
                                                        : t('nutrition.add')}
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </ScrollArea>
                    </CardContent>
                </Card>
            )}

            {/* Selected Nutrition Items */}
            {selectedItems.length > 0 && (
                <div className="mt-4">
                    <h3 className="text-sm font-medium mb-2">{t('nutrition.selected')}</h3>
                    <div className="flex flex-wrap gap-2">
                        {selectedItems.map((item) => (
                            <Badge 
                                key={item.id} 
                                variant="secondary"
                                className="flex items-center gap-1 px-3 py-1"
                            >
                                <span>{item.name}</span>
                                <button
                                    className="ml-1 rounded-full hover:bg-muted p-0.5"
                                    onClick={() => onRemoveNutrition(item.id)}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="14"
                                        height="14"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <line x1="18" y1="6" x2="6" y2="18"></line>
                                        <line x1="6" y1="6" x2="18" y2="18"></line>
                                    </svg>
                                </button>
                            </Badge>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
} 