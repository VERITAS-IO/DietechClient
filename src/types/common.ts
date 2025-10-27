// 🎯 Minimalist TypeScript Templates
// Rehberinizden: Copy-paste friendly, basit ve pratik

// ✅ API Response Template (Rehberinizden)
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message: string;
}

export interface ApiError {
  success: false;
  message: string;
  code: number;
}

// ✅ Paged Response Template (Mevcut PagedDataResponse'u basitleştir)
export interface PagedResponse<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

// ✅ Request Parameters Template
export interface PagedRequest {
  pageNumber: number;
  pageSize: number;
  orderBy?: string;
  searchTerm?: string;
}

// ✅ Form Template (Rehberinizden)
export interface FormData {
  [key: string]: string | number | boolean;
}

export interface FormErrors {
  [key: string]: string;
}

export interface FormState {
  data: FormData;
  errors: FormErrors;
  isValid: boolean;
}

// ✅ State Management Template (Rehberinizden)
export interface AppState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export type Action =
  | { type: 'SET_USER'; payload: User }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string };

// ✅ Basit User Interface (Rehberinizden)
export interface User {
  id: number;
  name: string;
  email: string;
  roles?: string[];
  dieticianId?: number;
}

// ✅ Union Types (Enum yerine - Rehberinizden)
export type Status = 'loading' | 'success' | 'error';
export type Theme = 'light' | 'dark';

// ✅ Gender Union (Enum yerine)
export type Gender = 'Male' | 'Female' | 'Other';

// ✅ Physical Activity Union
export type PhysicalActivity = 'None' | 'Light' | 'Moderate' | 'Active' | 'VeryActive';

// ✅ Stress Level Union
export type StressLevel = 'Low' | 'Moderate' | 'High' | 'VeryHigh';

// ✅ Smoking Union
export type Smoking = 'None' | 'Occasional' | 'Regular' | 'Heavy';

// ✅ Alcohol Union
export type Alcohol = 'None' | 'Occasional' | 'Regular' | 'Heavy';

// ✅ Blood Pressure Union
export type BloodPressure = 'Normal' | 'HighStageOne' | 'HighStageTwo' | 'HypertensiveCrisis';

// ✅ Blood Type Union
export type BloodType = 
  | 'A_Positive' | 'A_Negative' 
  | 'B_Positive' | 'B_Negative' 
  | 'AB_Positive' | 'AB_Negative' 
  | 'O_Positive' | 'O_Negative';

// ✅ Utility Types (Rehberinizden: Basit kullanım)
export type Optional<T> = Partial<T>;
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;
export type OptionalFields<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

// ✅ Record Pattern (Rehberinizden)
export type UserRoles = Record<string, string[]>;
export type ApiEndpoints = Record<string, string>;

// ✅ Function Types (Rehberinizden)
export type Handler<T> = (data: T) => void;
export type Validator<T> = (value: T) => boolean;
export type AsyncFetcher<T> = (id: number) => Promise<T>;

// ✅ Type Guards (Rehberinizden)
export function isUser(data: unknown): data is User {
  return typeof data === 'object' && 
         data !== null && 
         'id' in data && 
         'name' in data && 
         'email' in data;
}

export function isApiError(data: unknown): data is ApiError {
  return typeof data === 'object' && 
         data !== null && 
         'success' in data && 
         (data as Record<string, unknown>).success === false;
}

// ✅ Debug Pattern (Rehberinizden)
export type Debug<T> = T extends infer U ? U : never;
