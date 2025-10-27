import React from 'react';
import { useTranslation } from 'react-i18next';
import { DataTable, DataTableColumn, DataTableFilterOption } from '@/components/ui/data-table';
import { useDataTable } from '@/hooks/use-data-table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Eye } from 'lucide-react';

// Example data type
interface ExampleItem {
  id: number;
  name: string;
  email: string;
  status: 'active' | 'inactive' | 'pending';
  role: 'admin' | 'user' | 'moderator';
  createdAt: string;
  lastLogin: string;
}

// Example data
const exampleData: ExampleItem[] = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    status: 'active',
    role: 'admin',
    createdAt: '2024-01-15',
    lastLogin: '2024-01-20'
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane@example.com',
    status: 'inactive',
    role: 'user',
    createdAt: '2024-01-10',
    lastLogin: '2024-01-18'
  },
  {
    id: 3,
    name: 'Bob Johnson',
    email: 'bob@example.com',
    status: 'pending',
    role: 'moderator',
    createdAt: '2024-01-12',
    lastLogin: '2024-01-19'
  },
  // Add more example data...
];

export function DataTableExample() {
  const { t } = useTranslation();
  
  // Define columns
  const columns: DataTableColumn<ExampleItem>[] = [
    {
      key: 'name',
      title: 'Name',
      sortable: true,
      render: (item) => (
        <div className="font-medium">{item.name}</div>
      )
    },
    {
      key: 'email',
      title: 'Email',
      sortable: true,
      render: (item) => (
        <div className="text-muted-foreground">{item.email}</div>
      )
    },
    {
      key: 'status',
      title: 'Status',
      sortable: true,
      render: (item) => (
        <Badge 
          variant={item.status === 'active' ? 'default' : item.status === 'pending' ? 'secondary' : 'destructive'}
        >
          {item.status}
        </Badge>
      )
    },
    {
      key: 'role',
      title: 'Role',
      sortable: true,
      render: (item) => (
        <Badge variant="outline">
          {item.role}
        </Badge>
      )
    },
    {
      key: 'createdAt',
      title: 'Created',
      sortable: true,
      render: (item) => (
        <div className="text-sm text-muted-foreground">
          {new Date(item.createdAt).toLocaleDateString()}
        </div>
      )
    },
    {
      key: 'lastLogin',
      title: 'Last Login',
      sortable: true,
      render: (item) => (
        <div className="text-sm text-muted-foreground">
          {new Date(item.lastLogin).toLocaleDateString()}
        </div>
      )
    }
  ];
  
  // Define filter options
  const filterOptions: DataTableFilterOption[] = [
    {
      id: 'status',
      label: 'Status',
      type: 'select',
      options: [
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'Inactive' },
        { value: 'pending', label: 'Pending' }
      ]
    },
    {
      id: 'role',
      label: 'Role',
      type: 'select',
      options: [
        { value: 'admin', label: 'Admin' },
        { value: 'user', label: 'User' },
        { value: 'moderator', label: 'Moderator' }
      ]
    }
  ];
  
  // Use the data table hook
  const {
    processedData,
    searchValue,
    setSearchValue,
    activeFilters,
    setActiveFilters,
    resetFilters,
    sortColumn,
    sortDirection,
    setSorting,
    currentPage,
    pageSize,
    totalItems,
    setCurrentPage,
    setPageSize,
    selectedItems,
    setSelectedItems,
    paginatedData
  } = useDataTable({
    data: exampleData,
    columns,
    initialPageSize: 10,
    filterOptions,
    searchable: true,
    sortable: true,
    filterable: true,
    selectable: true
  });
  
  // Handle row click
  const handleRowClick = (item: ExampleItem) => {
  };
  
  // Handle actions
  const handleEdit = (item: ExampleItem) => {
  };
  
  const handleDelete = (item: ExampleItem) => {
  };
  
  const handleView = (item: ExampleItem) => {
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Data Table Example</h2>
        <div className="text-sm text-muted-foreground">
          {selectedItems.length > 0 && `${selectedItems.length} selected`}
        </div>
      </div>
      
      <DataTable
        data={paginatedData}
        columns={columns}
        loading={false}
        error={null}
        onRowClick={handleRowClick}
        keyExtractor={(item) => item.id}
        
        // Search
        searchable={true}
        searchPlaceholder="Search users..."
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        
        // Filtering
        filterable={true}
        filterOptions={filterOptions}
        activeFilters={activeFilters}
        onFilterChange={setActiveFilters}
        onResetFilters={resetFilters}
        
        // Sorting
        sortable={true}
        sortColumn={sortColumn}
        sortDirection={sortDirection}
        onSortChange={setSorting}
        
        // Pagination
        pagination={{
          currentPage,
          pageSize,
          totalItems,
          onPageChange: setCurrentPage,
          onPageSizeChange: setPageSize,
          pageSizeOptions: [5, 10, 25, 50],
          showPageSizeSelector: true
        }}
        
        // Actions
        actions={{
          label: 'Actions',
          render: (item) => (
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  handleView(item);
                }}
              >
                <Eye className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  handleEdit(item);
                }}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(item);
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          )
        }}
        
        // Selection
        selectable={true}
        selectedItems={selectedItems}
        onSelectionChange={setSelectedItems}
        
        // Layout
        className="w-full"
        emptyMessage="No users found"
      />
    </div>
  );
}
