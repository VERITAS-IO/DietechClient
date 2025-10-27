import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { CardDataGrid, CardColumn } from '@/components/ui/card-data-grid';
import { CardDataGridFilter, FilterOption } from '@/components/ui/card-data-grid-filter';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { Mail, Phone, Calendar } from 'lucide-react';
import { QueryClientResponse } from '@/types/client';
import { useQueryClients } from '@/hooks/client-hooks';

interface ClientCardListProps {
  onClientClick?: (client: QueryClientResponse) => void;
}

export default function ClientCardList({ onClientClick }: ClientCardListProps) {
  const { t } = useTranslation();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const [sortBy, setSortBy] = useState('name-asc');
  const [filters, setFilters] = useState<Record<string, unknown>>({
    search: '',
    status: '',
    sort: 'name-asc'
  });
  const [activeFilters, setActiveFilters] = useState<Record<string, unknown>>({
    search: '',
    status: '',
    sort: 'name-asc'
  });

  // Use React Query to fetch clients
  const { data: clients = [], isLoading, error } = useQueryClients({
    pageNumber: currentPage,
    pageSize: pageSize,
    // Add any additional filters from activeFilters as needed
    ...(activeFilters.status && activeFilters.status !== 'all' ? { status: activeFilters.status as string } : {}),
    ...(activeFilters.search ? { search: activeFilters.search as string } : {})
  });

  // Filter and sort clients based on active filters
  const filteredClients = clients
    .sort((a, b) => {
      switch (activeFilters.sort || sortBy) {
        case 'name-desc':
          return (b.fullName || '').localeCompare(a.fullName || '');
        case 'recent':
          // Assuming dateOfBirth is used for sorting by recency
          return new Date(b.dateOfBirth || new Date()).getTime() - new Date(a.dateOfBirth || new Date()).getTime();
        case 'oldest':
          // Assuming dateOfBirth is used for sorting by oldest
          return new Date(a.dateOfBirth || new Date()).getTime() - new Date(b.dateOfBirth || new Date()).getTime();
        default:
          return (a.fullName || '').localeCompare(b.fullName || '');
      }
    });

  // Calculate pagination
  const totalItems = filteredClients.length;
  const paginatedClients = filteredClients;

  // Handle filter changes - now only triggered when the user clicks the apply button
  const handleFilterChange = (newFilters: Record<string, unknown>) => {
    
    // Convert 'all' values to empty strings for internal handling
    const processedFilters = { ...newFilters };
    
    setFilters(processedFilters); // Store pending filters
    setActiveFilters(processedFilters); // Apply filters
    setCurrentPage(1); // Reset to first page when filters change
    
    if ('sort' in newFilters) {
      setSortBy((newFilters.sort as string) || 'name-asc');
    }
  };

  // Handle page size change
  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1); // Reset to first page when changing page size
  };
  
  // Reset filters
  const handleResetFilters = () => {
    const defaultFilters = {
      search: '',
      status: 'all',
      sort: 'name-asc'
    };
    setFilters(defaultFilters);
    setActiveFilters(defaultFilters);
    setSortBy('name-asc');
    setCurrentPage(1);
  };

  // Define filter options
  const filterOptions: FilterOption[] = [
    {
      id: 'status',
      label: t('client.status'),
      type: 'select',
      options: [
        { value: 'Active', label: 'Active' },
        { value: 'Pending', label: 'Pending' },
      ],
      placeholder: t('client.filterStatus'),
    },
    {
      id: 'sort',
      label: t('client.sort'),
      type: 'select',
      options: [
        { value: 'name-asc', label: t('client.sortOptions.nameAsc') },
        { value: 'name-desc', label: t('client.sortOptions.nameDesc') },
        { value: 'recent', label: t('client.sortOptions.recent') },
        { value: 'oldest', label: t('client.sortOptions.oldest') },
      ],
      placeholder: t('client.sort'),
    },
  ];

  // Define columns for the card data grid
  const columns: CardColumn<QueryClientResponse>[] = [
    {
      key: 'fullName',
      title: t('client.name'),
      primary: true,
    },
    {
      key: 'email',
      title: t('client.email'),
      secondary: true,
      render: (client) => (
        <div className="flex items-center text-sm text-muted-foreground">
          <Mail className="mr-1 h-3.5 w-3.5" />
          {client.email}
        </div>
      )
    },
    {
      key: 'gender',
      title: t('client.gender'),
      header: true,
      render: (client) => (
        <Badge 
          variant="outline"
          className="capitalize"
        >
          {client.gender}
        </Badge>
      ),
    },
    {
      key: 'phoneNumber',
      title: t('client.phone'),
      render: (client) => (
        <div className="flex items-center">
          <Phone className="mr-1 h-3.5 w-3.5 text-muted-foreground" />
          {client.phoneNumber}
        </div>
      ),
    },
    {
      key: 'dateOfBirth',
      title: t('client.dateOfBirth'),
      render: (client) => (
        <div className="flex items-center">
          <Calendar className="mr-1 h-3.5 w-3.5 text-muted-foreground" />
          {client.dateOfBirth ? format(new Date(client.dateOfBirth), 'dd/MM/yyyy') : '-'}
        </div>
      ),
    },
    {
      key: 'actions',
      title: t('common.actions'),
      footer: true,
      render: (client) => (
        <Link to={`/dashboard/clients/${client.id}`}>
          <Button variant="outline" size="sm">
            {t('client.viewDetails')}
          </Button>
        </Link>
      ),
    },
  ];

  // Handle card click
  const handleCardClick = (client: QueryClientResponse) => {
    if (onClientClick) {
      onClientClick(client);
    }
  };

  return (
    <div className="space-y-4">
      <CardDataGridFilter
        filterOptions={filterOptions}
        onFilterChange={handleFilterChange}
        onResetFilters={handleResetFilters}
        activeFilters={filters}
        showFilterToggle={true}
        searchColumn="search"
      />

      <CardDataGrid
        data={paginatedClients}
        columns={columns}
        loading={isLoading}
        error={error ? (error instanceof Error ? error : new Error('An error occurred')) : null}
        onCardClick={handleCardClick}
        pagination={{
          currentPage,
          pageSize,
          totalItems,
          onPageChange: setCurrentPage,
          onPageSizeChange: handlePageSizeChange,
          pageSizeOptions: [6, 12, 24, 48],
          showPageSizeSelector: true,
        }}
        layoutOptions={{
          grid: { xs: 1, sm: 1, md: 1, lg: 1 },
          cardSize: 'default',
          vertical: true
        }}
        className="mt-4"
      />
    </div>
  );
} 