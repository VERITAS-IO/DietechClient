import { CreateMealRequest } from "./meal";
import { PagedRequest } from "./request-parameters";

export enum DietType {
    VEGETARIAN = 'VEGETARIAN',
    VEGAN = 'VEGAN',
    KETO = 'KETO',
    PALEO = 'PALEO',
    MEDITERRANEAN = 'MEDITERRANEAN',
    LOW_CARB = 'LOW_CARB',
    HIGH_PROTEIN = 'HIGH_PROTEIN'
}

export interface CreateDietRequest {
    name: string;
    dietDescription: string;
    dietType: DietType;
    dietDuration: number;
    totalCalories: number;
    tenantId: number;
    meals?:CreateMealRequest[]; 
}

export interface UpdateDietRequest {
    name?: string;
    dietDescription?: string;
    dietType?: DietType;
    dietDuration?: number;
    totalCalories?: number;
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
    dietType: string;
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
}
