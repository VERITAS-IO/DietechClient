/**
 * Enum representing different types of financial transactions
 */
export enum FinancialType {
  Income = 'INCOME',
  Expense = 'EXPENSE',
  Consultation = 'CONSULTATION',
  Appointment = 'APPOINTMENT',
  Other = 'OTHER'
}

/**
 * Enum representing different statuses of financial transactions
 */
export enum FinancialStatus {
  Pending = 'PENDING',
  Completed = 'COMPLETED',
  Cancelled = 'CANCELLED',
  Refunded = 'REFUNDED'
}

/**
 * Interface representing a financial transaction
 */
export interface Financial {
  id: string;
  type: FinancialType;
  status: FinancialStatus;
  amount: number;
  date: string;
  description: string;
  clientId?: string;
  clientName?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Interface for creating a new financial transaction
 */
export interface CreateFinancialRequest {
  type: FinancialType;
  status: FinancialStatus;
  amount: number;
  date: string;
  description: string;
  clientId?: string;
}

/**
 * Interface for updating an existing financial transaction
 */
export interface UpdateFinancialRequest {
  id: string;
  type?: FinancialType;
  status?: FinancialStatus;
  amount?: number;
  date?: string;
  description?: string;
  clientId?: string;
}

/**
 * Interface for querying financial transactions
 */
export interface QueryFinancialsRequest {
  page?: number;
  pageSize?: number;
  type?: FinancialType;
  status?: FinancialStatus;
  startDate?: string;
  endDate?: string;
  description?: string;
  clientId?: string;
}

/**
 * Interface for the response when querying financial transactions
 */
export interface QueryFinancialsResponse {
  items: Financial[];
  totalItems: number;
  page: number;
  pageSize: number;
}

/**
 * Interface for financial summary statistics
 */
export interface FinancialSummary {
  totalIncome: number;
  totalExpense: number;
  netIncome: number;
  pendingAmount: number;
  completedAmount: number;
  monthlyData: {
    month: string;
    income: number;
    expense: number;
  }[];
} 