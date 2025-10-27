// ✅ Union Types (Rehberinizden: Enum yerine union kullan)
export type FinancialType = 'Income' | 'Expense' | 'Consultation' | 'Appointment' | 'Other';
export type FinancialStatus = 'Pending' | 'Completed' | 'Failed' | 'Refunded' | 'Cancelled';
export type FinancialInterval = 'Daily' | 'Weekly' | 'Monthly' | 'Yearly';

// ✅ Mapping Object (Rehberinizden: Record pattern)
export const FinancialIntervalMapping = {
  toNumber: {
    'Daily': 1,
    'Weekly': 2,
    'Monthly': 3,
    'Yearly': 4
  },
  toString: {
    1: 'Daily',
    2: 'Weekly', 
    3: 'Monthly',
    4: 'Yearly'
  }
} as const;

// ✅ Basit Interface (Rehberinizden: Karmaşık yapma)
export interface Financial {
  id: number;
  type: FinancialType;
  status: FinancialStatus;
  amount: number;
  date: string;
  description: string;
  dieticianId: number;
  tenantId: number;
  clientId?: number;
  clientName?: string;
  subject?: string;
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
  date: Date;
  description: string;
  dieticianId: number;
  tenantId: number;
  clientId?: number;
  subject?: string;
}

/**
 * Interface for the response when creating a financial
 */
export interface CreateFinancialResponse {
  id: number;
}

/**
 * Interface for updating an existing financial transaction
 */
export interface UpdateFinancialRequest {
  id: number;
  type?: FinancialType;
  status?: FinancialStatus;
  amount?: number;
  description?: string;
}

/**
 * Interface for getting a financial by ID
 */
export interface GetFinancialRequest {
  id: number;
}

/**
 * Interface for getting a financial response
 */
export interface GetFinancialResponse extends Financial {}

/**
 * Interface for querying financial transactions
 */
export interface QueryFinancialsRequest {
  pageNumber?: number;
  pageSize?: number;
  dieticianId?: number;
  type?: FinancialType;
  status?: FinancialStatus;
  startDate?: string;
  endDate?: string;
  minAmount?: number;
  maxAmount?: number;
  description?: string;
}

/**
 * Interface for the response when querying financial transactions
 */
export interface QueryFinancialsResponse extends Financial {}

/**
 * Interface for financial overview request
 */
export interface GetFinancialOverviewInitRequest {
  startDate?: Date;
  endDate?: Date;
  interval?: FinancialInterval | number;
  dieticianId?: number;
}

/**
 * Interface for interval data item in financial overview
 */
export interface IntervalData {
  date: string;
  numberOfIncomes: number;
  numberOfExpenses: number;
  totalIncome: number;
  totalNetIncome: number;
  totalExpenses: number;
}

/**
 * Interface for chart data item
 */
export interface ChartDataItem {
  label: string;
  income: number;
  expense: number;
}

/**
 * Interface for financial overview response
 */
export interface GetFinancialOverviewInitResponse {
  intervals: Record<string | number, IntervalData[]>;
  totalNetIncome: number;
  totalExpenses: number;
  pendingExpenses: number;
  pendingIncome: number;
  pendingNetIncome: number;
  completedIncomes: number;
  totalTransactions: number;
}

/**
 * Interface for deleting a financial
 */
export interface DeleteFinancialRequest {
  id: number;
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