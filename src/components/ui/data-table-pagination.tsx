import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface DataTablePaginationProps {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  pageSizeOptions?: number[];
  showPageSizeSelector?: boolean;
  className?: string;
}

export function DataTablePagination({
  currentPage,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 30, 40, 50],
  showPageSizeSelector = false,
  className,
}: DataTablePaginationProps) {
  const { t, i18n } = useTranslation();
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  
  // Calculate start and end item numbers
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  // Ensure current page is within valid range
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      onPageChange(totalPages);
    }
  }, [currentPage, totalPages, onPageChange]);

  // Handle page size change
  const handlePageSizeChange = (value: string) => {
    const newPageSize = parseInt(value, 10);
    if (onPageSizeChange) {
      onPageSizeChange(newPageSize);
    }
  };

  // Navigation functions
  const goToFirstPage = () => {
    if (currentPage !== 1) {
      onPageChange(1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const goToLastPage = () => {
    if (currentPage !== totalPages) {
      onPageChange(totalPages);
    }
  };

  // If there are no items, don't render pagination
  if (totalItems === 0) {
    return (
      <div className={`text-sm text-muted-foreground py-2 ${className || ''}`}>
        {t('pagination.noResults')}
      </div>
    );
  }

  return (
    <div className={`flex flex-col xs:flex-row items-center justify-between gap-4 py-1 ${className || ''}`}>
      {/* Results summary */}
      <div className="text-sm text-muted-foreground">
        {t('pagination.showing', {
            from: startItem,
            to: endItem,
            total: totalItems,
        })}
      </div>

      {/* Pagination controls */}
      <div className="flex flex-col xs:flex-row items-center gap-4 xs:gap-6">
        {/* Page size selector */}
        {showPageSizeSelector && onPageSizeChange && (
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium whitespace-nowrap">
              {t('pagination.rowsPerPage')}
            </span>
            <Select
              value={pageSize.toString()}
              onValueChange={handlePageSizeChange}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue placeholder={pageSize.toString()} />
              </SelectTrigger>
              <SelectContent side="top">
                {pageSizeOptions.map((option) => (
                  <SelectItem key={option} value={option.toString()}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Navigation buttons */}
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-md"
            onClick={goToFirstPage}
            disabled={currentPage === 1}
            aria-label={t('pagination.firstPage')}
            title={t('pagination.firstPage')}
          >
            <ChevronsLeftIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-md"
            onClick={goToPreviousPage}
            disabled={currentPage === 1}
            aria-label={t('pagination.previousPage')}
            title={t('pagination.previousPage')}
          >
            <ChevronLeftIcon className="h-4 w-4" />
          </Button>
          
          <div className="flex items-center mx-2 min-w-[5.5rem] justify-center">
            <span className="text-sm font-medium">
              {t('pagination.page')} {currentPage} {t('pagination.of')} {totalPages}
            </span>
          </div>
          
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-md"
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
            aria-label={t('pagination.nextPage')}
            title={t('pagination.nextPage')}
          >
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-md"
            onClick={goToLastPage}
            disabled={currentPage === totalPages}
            aria-label={t('pagination.lastPage')}
            title={t('pagination.lastPage')}
          >
            <ChevronsRightIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
} 