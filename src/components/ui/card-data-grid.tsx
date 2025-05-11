import React, { ReactNode } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Loader2 } from 'lucide-react';
import { DataTablePagination } from '@/components/ui/data-table-pagination';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

// Column definition type
export interface CardColumn<T = any> {
  key: string;
  title: string;
  render?: (item: T) => ReactNode;
  primary?: boolean;
  secondary?: boolean;
  footer?: boolean;
  header?: boolean;
  badge?: boolean;
  sortable?: boolean;
  sortKey?: string;
  hidden?: boolean;
}

// Main component props
export interface CardDataGridProps<T = any> {
  data: T[];
  columns: CardColumn<T>[];
  loading?: boolean;
  error?: Error | null;
  onCardClick?: (item: T) => void;
  keyExtractor?: (item: T) => string | number;
  pagination?: {
    currentPage: number;
    pageSize: number;
    totalItems: number;
    onPageChange: (page: number) => void;
    onPageSizeChange: (size: number) => void;
    pageSizeOptions?: number[];
    showPageSizeSelector?: boolean;
  };
  layoutOptions?: {
    grid?: {
      xs?: number;
      sm?: number;
      md?: number;
      lg?: number;
      xl?: number;
    };
    cardSize?: 'compact' | 'default' | 'large';
    vertical?: boolean;
  };
  sort?: {
    column?: string;
    direction?: 'asc' | 'desc';
    onSortChange?: (column: string, direction: 'asc' | 'desc') => void;
  };
  renderEmpty?: () => ReactNode;
  renderLoading?: () => ReactNode;
  renderError?: (error: Error) => ReactNode;
  className?: string;
  cardClassName?: string;
}

export function CardDataGrid<T extends object>({
  data,
  columns,
  loading = false,
  error = null,
  onCardClick,
  keyExtractor = (item: any) => item.id || Math.random().toString(),
  pagination,
  layoutOptions = {
    grid: { xs: 1, sm: 1, md: 1, lg: 1, xl: 1 },
    cardSize: 'default',
    vertical: true,
  },
  sort,
  renderEmpty,
  renderLoading,
  renderError,
  className,
  cardClassName,
}: CardDataGridProps<T>) {
  const { t } = useTranslation();
  
  // Extract primary, secondary, content, and footer columns
  const primaryColumn = columns.find((col) => col.primary);
  const secondaryColumn = columns.find((col) => col.secondary);
  const headerColumns = columns.filter((col) => col.header && !col.primary && !col.secondary);
  const contentColumns = columns.filter((col) => !col.header && !col.footer && !col.primary && !col.secondary);
  const footerColumns = columns.filter((col) => col.footer);
  const hiddenColumns = columns.filter((col) => col.hidden);

  // Function to render card spacing based on cardSize
  const getCardSpacing = () => {
    switch (layoutOptions.cardSize) {
      case 'compact':
        return 'py-2 px-3';
      case 'large':
        return 'p-4';
      default:
        return 'py-2 px-4';
    }
  };

  const getGridClasses = () => {
    if (layoutOptions.vertical) {
      return 'flex flex-col gap-2';
    }

    const { grid } = layoutOptions;
    return cn(
      'grid gap-4',
      grid?.xs && `grid-cols-1`,
      grid?.sm && `sm:grid-cols-${grid.sm}`,
      grid?.md && `md:grid-cols-${grid.md}`,
      grid?.lg && `lg:grid-cols-${grid.lg}`,
      grid?.xl && `xl:grid-cols-${grid.xl}`
    );
  };

  // Render functions
  const renderLoadingState = () => {
    if (renderLoading) return renderLoading();
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="mt-2 text-sm text-muted-foreground">{t('common.loading')}</p>
      </div>
    );
  };

  const renderErrorState = () => {
    if (renderError && error) return renderError(error);
    return (
      <Alert variant="destructive" className="my-4">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error?.message || t('common.errorOccurred')}</AlertDescription>
      </Alert>
    );
  };

  const renderEmptyState = () => {
    if (renderEmpty) return renderEmpty();
    return (
      <Card className="flex items-center justify-center p-6 text-center border-dashed border-2">
        <div className="py-6 space-y-3">
          <div className="text-muted-foreground opacity-70 mx-auto flex justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-12 w-12"
            >
              <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
              <line x1="3" x2="21" y1="9" y2="9" />
              <path d="m9 16 3-3 3 3" />
            </svg>
          </div>
          <div className="text-xl font-medium">{t('common.noDataAvailable')}</div>
          <div className="text-muted-foreground text-sm">{t('common.noItemsFound')}</div>
        </div>
      </Card>
    );
  };

  // Determine what to render in the data grid
  let content: React.ReactNode;

  if (loading) {
    content = renderLoadingState();
  } else if (error) {
    content = renderErrorState();
  } else if (!data || data.length === 0) {
    content = renderEmptyState();
  } else {
    content = (
      <div className={getGridClasses()}>
        {data.map((item) => {
          const key = keyExtractor(item);
          
          // Get values for primary and secondary fields
          const primaryValue = primaryColumn ? 
            (primaryColumn.render ? primaryColumn.render(item) : (item as any)[primaryColumn.key]) : 
            null;
            
          const secondaryValue = secondaryColumn ? 
            (secondaryColumn.render ? secondaryColumn.render(item) : (item as any)[secondaryColumn.key]) : 
            null;

          return (
            <Card 
              key={key} 
              className={cn(
                'transition-all border-l-4 border-l-primary/50',
                onCardClick && 'cursor-pointer hover:bg-muted/50',
                getCardSpacing(),
                cardClassName
              )}
              onClick={onCardClick ? () => onCardClick(item) : undefined}
            >
              {(primaryValue || secondaryValue || headerColumns.length > 0) && (
                <div className="mb-1.5">
                  {primaryValue && <h3 className="font-medium text-base leading-5">{primaryValue}</h3>}
                  {secondaryValue && <div className="text-sm text-muted-foreground leading-tight">{secondaryValue}</div>}
                  
                  {headerColumns.length > 0 && (
                    <div className="flex flex-wrap mt-1 gap-1.5">
                      {headerColumns.map((column) => (
                        <div key={column.key} className="flex items-center">
                          {column.render ? column.render(item) : (item as any)[column.key]}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {contentColumns.length > 0 && (
                <div className="space-y-0.5">
                  {contentColumns.map((column) => (
                    <div key={column.key} className="flex justify-between py-0.5 text-sm">
                      <span className="text-muted-foreground">{column.title}:</span>
                      <span>
                        {column.render ? column.render(item) : (item as any)[column.key]}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {footerColumns.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2 justify-between">
                  {footerColumns.map((column) => (
                    <div key={column.key}>
                      {column.render ? column.render(item) : (item as any)[column.key]}
                    </div>
                  ))}
                </div>
              )}
            </Card>
          );
        })}
      </div>
    );
  }

  return (
    <div className={cn('w-full space-y-4', className)}>
      {content}
      
      {pagination && !loading && data && data.length > 0 && (
        <DataTablePagination
          currentPage={pagination.currentPage}
          pageSize={pagination.pageSize}
          totalItems={pagination.totalItems}
          onPageChange={pagination.onPageChange}
          onPageSizeChange={pagination.onPageSizeChange}
          pageSizeOptions={pagination.pageSizeOptions || [5, 10, 25, 50]}
          showPageSizeSelector={pagination.showPageSizeSelector}
          className="mt-4"
        />
      )}
    </div>
  );
} 