import { CreateMealRequest, MealListResponse } from "./meal";
import { PagedRequest } from "./request-parameters";

export enum DietType {
    Standard = 'Standard',
    Mediterranean = 'Mediterranean',
    LowCarb = 'LowCarb',
    Ketogenic = 'Ketogenic',
    Vegetarian = 'Vegetarian',
    Vegan = 'Vegan',
    PaleoStyle = 'PaleoStyle',
    GlutenFree = 'GlutenFree',
    DairyFree = 'DairyFree',
    LowFat = 'LowFat',
    LowSodium = 'LowSodium',
    DiabetesFriendly = 'DiabetesFriendly',
    HighProtein = 'HighProtein',
    WeightLoss = 'WeightLoss',
    WeightGain = 'WeightGain',
    Elimination = 'Elimination',
    Custom = 'Custom'
}

export interface CreateDietRequest {
    name: string;
    dietDescription: string;
    dietType: DietType;
    dietDuration: number;
    totalCalories: number;
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
    nutritionInfoList: any[];
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
