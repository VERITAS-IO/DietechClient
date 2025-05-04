import { CreateMealRequest, MealListResponse } from "./meal";
import { PagedRequest } from "./request-parameters";

export enum DietType {
    Unknown = 0,
    Standard = 1,
    Mediterranean = 2,
    LowCarb = 3,
    Ketogenic = 4,
    Vegetarian = 5,
    Vegan = 6,
    PaleoStyle = 7,
    GlutenFree = 8,
    DairyFree = 9,
    LowFat = 10,
    LowSodium = 11,
    DiabetesFriendly = 12,
    HighProtein = 13,
    WeightLoss = 14,
    WeightGain = 15,
    Elimination = 16,
    Custom = 99
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
