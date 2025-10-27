// 🎯 Component Props Templates (Rehberinizden)
// Copy-paste friendly, basit ve pratik

import { ReactNode } from 'react';

// ✅ Button Props Template (Rehberinizden)
export interface ButtonProps {
  children: ReactNode;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
}

// ✅ Input Props Template (Rehberinizden)
export interface InputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  type?: 'text' | 'email' | 'password' | 'number';
}

// ✅ Card Props Template
export interface CardProps {
  children: ReactNode;
  title?: string;
  className?: string;
  onClick?: () => void;
}

// ✅ Modal Props Template
export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

// ✅ Table Props Template
export interface TableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  loading?: boolean;
  error?: string;
  onRowClick?: (item: T) => void;
  keyExtractor?: (item: T) => string | number;
}

export interface TableColumn<T> {
  key: string;
  title: string;
  render?: (item: T) => ReactNode;
  sortable?: boolean;
  width?: string;
}

// ✅ Form Props Template (Rehberinizden)
export interface FormProps {
  onSubmit: (data: FormData) => void;
  initialData?: FormData;
  validation?: FormValidation;
  loading?: boolean;
}

export interface FormValidation {
  [key: string]: (value: unknown) => string | null;
}

// ✅ List Props Template
export interface ListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => ReactNode;
  keyExtractor: (item: T) => string | number;
  loading?: boolean;
  emptyMessage?: string;
}

// ✅ Search Props Template
export interface SearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onSearch?: (query: string) => void;
  suggestions?: string[];
}

// ✅ Filter Props Template
export interface FilterProps {
  filters: Record<string, unknown>;
  onFilterChange: (filters: Record<string, unknown>) => void;
  onReset: () => void;
  options: FilterOption[];
}

export interface FilterOption {
  key: string;
  label: string;
  type: 'text' | 'select' | 'date' | 'number';
  options?: { value: string; label: string }[];
}

// ✅ Pagination Props Template
export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  pageSize?: number;
  onPageSizeChange?: (size: number) => void;
  showPageSizeSelector?: boolean;
}

// ✅ Loading Props Template
export interface LoadingProps {
  loading: boolean;
  children: ReactNode;
  fallback?: ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

// ✅ Error Props Template
export interface ErrorProps {
  error: string | null;
  onRetry?: () => void;
  children?: ReactNode;
}

// ✅ Empty State Props Template
export interface EmptyStateProps {
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  icon?: ReactNode;
}
