import { CreateNutritionInfoRequest } from "./nutrition";
import { PagedRequest } from "./request-parameters";

// ✅ Union Types (Rehberinizden: Enum yerine union kullan)
export type MealType = 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack' | 'PreWorkout' | 'PostWorkout' | 'Custom';
export type MealOrder = 'FirstMeal' | 'SecondMeal' | 'ThirdMeal' | 'FourthMeal' | 'FifthMeal' | 'SixthMeal' | 'SeventhMeal' | 'EighthMeal' | 'NinthMeal' | 'TenthMeal' | 'Custom';

// ✅ Basit Interface (Rehberinizden: Karmaşık yapma)
export interface CreateMealRequest {
  name: string;
  description: string;
  mealType: MealType;
  mealOrder: MealOrder;
  startTime?: string; 
  endTime?: string; 
  dietId: number;
  tenantId: number;
  nutritionInfoIds?: number[];
  newNutritionInfoRequests?: CreateNutritionInfoRequest[]; 
}

/**
 * Interface for deleting a meal
 */
export interface DeleteMealRequest {
    id: number;
}

/**
 * Interface for getting a specific meal
 */
export interface GetMealRequest {
    id: number;
}

/**
 * Interface for querying meals with pagination and filters
 */
export interface QueryMealRequest extends PagedRequest {
    name?: string;
    dietId?: number;
    mealType?: MealType;
    mealOrder?: MealOrder;
    startTime?: string; // ISO date string
    endTime?: string; // ISO date string
    tenantId?: number;
    searchTerm?: string;
    orderBy?: string;
    includeDeleted?: boolean;
}

/**
 * Interface for updating an existing meal
 */
export interface UpdateMealRequest {
    name?: string;
    description?: string;
    mealType?: MealType;
    mealOrder?: MealOrder;
    startTime?: string; // ISO date string
    endTime?: string; // ISO date string
    dietId?: number;
    nutritionInfoIdsToAdd?: number[];
    nutritionInfoIdsToRemove?: number[];
    newNutritionInfosToAdd?: CreateNutritionInfoRequest[];
}

/**
 * Interface for meal list response
 */
export interface MealListResponse {
    id: number;
    name: string;
    description: string;
    mealType: MealType;
    mealOrder: MealOrder;
    startTime: string; // ISO date string
    endTime: string; // ISO date string
    dietId: number;
    tenantId: number;
    isActive: boolean;
    nutritionInfoList: unknown[]; // ✅ Unknown kullan (Rehberinizden)
}

/**
 * Interface for paginated meal list response
 */
export interface PaginatedMealListResponse {
    items: MealListResponse[];
    totalCount: number;
    pageNumber: number;
    pageSize: number;
}

/**
 * Interface for detailed meal response
 */
export interface MealDetailResponse extends MealListResponse {
    // Additional properties for detailed view if needed
}
