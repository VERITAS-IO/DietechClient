import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { FilterX, Search, SlidersHorizontal } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export interface FilterOption<T = string> {
  id: string;
  label: string;
  type: 'text' | 'select' | 'date' | 'number' | 'checkbox' | 'custom';
  placeholder?: string;
  options?: { value: T; label: string }[];
  defaultValue?: unknown;
  component?: React.ReactNode;
}

export interface CardDataGridFilterProps<T = unknown> {
  filterOptions: FilterOption[];
  onFilterChange: (filters: Record<string, unknown>) => void;
  onResetFilters?: () => void;
  activeFilters?: Record<string, unknown>;
  className?: string;
  showFilterToggle?: boolean;
  searchColumn?: string;
}

export function CardDataGridFilter({
  filterOptions,
  onFilterChange,
  onResetFilters,
  activeFilters = {},
  className,
  showFilterToggle = true,
  searchColumn = 'search',
}: CardDataGridFilterProps) {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);
  const [pendingFilters, setPendingFilters] = useState<Record<string, any>>(activeFilters || {});
  const [searchInput, setSearchInput] = useState(activeFilters?.[searchColumn] || '');
  
  // Add debug log for initial render
  
  // Flag to prevent useEffect from overriding user's search input
  const userEditedSearch = useRef(false);
  // Track last applied search for debugging
  const lastAppliedSearch = useRef(activeFilters?.[searchColumn] || '');

  // Update local state when activeFilters prop changes, but don't override user's search input
  useEffect(() => {
    // Update pending filters
    setPendingFilters((prev) => {
      const newFilters = { ...activeFilters };
      
      // If user edited search, preserve that value in pending filters
      if (userEditedSearch.current) {
        if (searchInput.trim() === '') {
          delete newFilters[searchColumn];
        } else {
          newFilters[searchColumn] = searchInput;
        }
      } 
      // If not user edited but active filters have a search term
      else if (activeFilters?.[searchColumn]) {
        setSearchInput(activeFilters[searchColumn]);
        lastAppliedSearch.current = activeFilters[searchColumn];
      }
      
      return newFilters;
    });
    
    // Only update search input from activeFilters if user hasn't edited it
    if (!userEditedSearch.current && activeFilters?.[searchColumn] !== searchInput) {
      setSearchInput(activeFilters?.[searchColumn] || '');
      lastAppliedSearch.current = activeFilters?.[searchColumn] || '';
    }
    
  }, [activeFilters, searchColumn]);

  // Handle input change - only updates local state without triggering filter change
  const handleInputChange = (id: string, value: any) => {
    setPendingFilters((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  // Handle search input change
  const handleSearchInputChange = (value: string) => {
    userEditedSearch.current = true;
    setSearchInput(value);
  };

  // Apply filters - triggered by the search button
  const applyFilters = () => {
    
    // Reset user edited flag since we're explicitly applying filters now
    userEditedSearch.current = false;
    
    // Track the search we're applying
    lastAppliedSearch.current = searchInput;
    
    // Create a new filters object based on current pending filters
    // Use a completely fresh object to ensure we're not carrying over old state
    const updatedFilters = { ...pendingFilters };
    
    // Always force the search term to match the current input, regardless of pending filters
    if (searchInput.trim() === '') {
      // If search input is empty, remove the search filter entirely
      delete updatedFilters[searchColumn];
    } else {
      // Otherwise set the search term
      updatedFilters[searchColumn] = searchInput;
    }
    
    // Log what we're sending
    
    // Apply all filters
    onFilterChange(updatedFilters);
  };

  // Reset filters
  const resetFilters = () => {
    userEditedSearch.current = false;
    lastAppliedSearch.current = '';
    
    const defaultFilters: Record<string, any> = {};
    filterOptions.forEach((option) => {
      if (option.defaultValue !== undefined) {
        defaultFilters[option.id] = option.defaultValue;
      }
    });
    
    setPendingFilters(defaultFilters);
    setSearchInput('');
    
    if (onResetFilters) {
      onResetFilters();
    } else {
      onFilterChange(defaultFilters);
    }
  };

  // Handle clear search specifically
  const handleClearSearch = () => {
    setSearchInput('');
    userEditedSearch.current = true;
    
    // Don't apply filters here - wait for the user to click search
  };

  // Check if any filters are active
  const hasActiveFilters = Object.keys(activeFilters).length > 0;

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex flex-col sm:flex-row gap-2 w-full">
        <div className="flex flex-1 gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder={t('common.search')}
              className="pl-8"
              value={searchInput}
              onChange={(e) => handleSearchInputChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  applyFilters();
                }
              }}
            />
            {searchInput && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground"
                aria-label="Clear search"
              >
                <FilterX className="h-4 w-4" />
              </button>
            )}
          </div>
          <Button onClick={applyFilters}>
            {t('common.search')}
          </Button>
        </div>
        
        {showFilterToggle && (
          <Button
            variant="outline"
            onClick={() => setIsExpanded(!isExpanded)}
            className="gap-2"
          >
            <SlidersHorizontal className="h-4 w-4" />
            {t('common.filters')}
          </Button>
        )}
        
        {hasActiveFilters && (
          <Button
            variant="ghost"
            onClick={resetFilters}
            className="gap-2 text-muted-foreground"
          >
            <FilterX className="h-4 w-4" />
            {t('common.resetFilters')}
          </Button>
        )}
      </div>

      {isExpanded && filterOptions.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">{t('common.filters')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filterOptions.map((option) => (
                <div key={option.id} className="space-y-2">
                  <label
                    htmlFor={option.id}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {option.label}
                  </label>

                  {option.type === 'text' && (
                    <Input
                      id={option.id}
                      type="text"
                      placeholder={option.placeholder}
                      value={pendingFilters[option.id] || ''}
                      onChange={(e) => handleInputChange(option.id, e.target.value)}
                    />
                  )}

                  {option.type === 'number' && (
                    <Input
                      id={option.id}
                      type="number"
                      placeholder={option.placeholder}
                      value={pendingFilters[option.id] || ''}
                      onChange={(e) => handleInputChange(option.id, e.target.value)}
                    />
                  )}

                  {option.type === 'select' && option.options && (
                    <Select
                      value={pendingFilters[option.id] || 'all'}
                      onValueChange={(value) => handleInputChange(option.id, value === 'all' ? '' : value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={option.placeholder} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">
                          {t('common.all')}
                        </SelectItem>
                        {option.options.map((opt) => (
                          <SelectItem key={opt.value.toString()} value={opt.value.toString()}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}

                  {/* Add other filter types as needed */}
                  {option.type === 'custom' && option.component}
                </div>
              ))}
            </div>

            <div className="flex justify-end mt-4 space-x-2">
              <Button variant="outline" onClick={resetFilters}>
                {t('common.reset')}
              </Button>
              <Button onClick={applyFilters}>
                {t('common.apply')}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 