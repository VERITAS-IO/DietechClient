// 🎯 Type Organization Structure (Rehberinizden)
// File organization: Type'ları ayrı tut

// ✅ Main Types Index
export * from './common';
export * from './components';
export * from './api';

// ✅ Domain Types
export * from './auth';
export * from './client';
export * from './diet';
export * from './meal';
export * from './nutrition';
export * from './financial';
export * from './appointment';
export * from './dashboard';

// ✅ Request/Response Types
export * from './request-parameters';
export * from './response-types';

// ✅ Re-export commonly used types for convenience
export type {
  ApiResponse,
  PagedResponse,
  PagedRequest,
  User,
  Status,
  Theme,
  Gender,
  FormData,
  FormErrors,
  FormState,
} from './common';

export type {
  ButtonProps,
  InputProps,
  TableProps,
  TableColumn,
  PaginationProps,
  LoadingProps,
  ErrorProps,
  EmptyStateProps,
} from './components';

export type {
  FinancialType,
  FinancialStatus,
  FinancialInterval,
  Financial,
} from './financial';

export type {
  DietType,
  CreateDietRequest,
  DietListResponse,
} from './diet';
