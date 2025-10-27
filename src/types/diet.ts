import { CreateMealRequest, MealListResponse } from "./meal";
import { PagedRequest } from "./request-parameters";

// ✅ Union Types (Rehberinizden: Enum yerine union kullan)
export type DietType = 
  | 'Standard'
  | 'Mediterranean'
  | 'LowCarb'
  | 'Ketogenic'
  | 'Vegetarian'
  | 'Vegan'
  | 'PaleoStyle'
  | 'GlutenFree'
  | 'DairyFree'
  | 'LowFat'
  | 'LowSodium'
  | 'DiabetesFriendly'
  | 'HighProtein'
  | 'WeightLoss'
  | 'WeightGain'
  | 'Elimination'
  | 'Custom';

// ✅ Basit Interface (Rehberinizden: Karmaşık yapma)
export interface CreateDietRequest {
  name: string;
  dietDescription: string;
  dietType: DietType;
  dietDuration: number;
  totalCalories: number;
  isActive: boolean;
  tenantId: number;
  meals?: CreateMealRequest[];
}

export interface CreateDietResponse {
    id: number;
    name: string;
}

export interface UpdateDietRequest {
    name?: string;
    dietDescription?: string;
    dietType?: DietType;
    dietDuration?: number;
    totalCalories?: number;
    startDate?: string;
    endDate?: string;
    isActive?: boolean;
    mealIdsToAdd?: number[];    
    mealIdsToRemove?: number[];
    newMealsToAdd?: CreateMealRequest[];
}

export interface QueryDietsRequest extends PagedRequest {
    minCalories?: number;
    maxCalories?: number;
    dietType?: DietType;
}

export interface DietListResponse {
    id: number;
    name: string;
    dietType: DietType;
    dietDescription: string;
    totalCalories: number;
    dietDuration: number;
    tenantId: number;
    startDate: string;
    endDate: string;
    isActive: boolean;
    nutritionInfoList: unknown[];
}

export interface PaginatedDietListResponse {
    items: DietListResponse[];
    totalCount: number;
    pageNumber: number;
    pageSize: number;
}

export interface DietDetailResponse extends DietListResponse {
    dietName: string;
    meals?: MealListResponse[]; 
}

export interface CreateDietResponse {
    id: number;
    name: string;
}
