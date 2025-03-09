import { CreateNutritionInfoRequest } from "./nutrition";
import { PagedRequest } from "./request-parameters";

/**
 * Enum representing different meal types
 */
export enum MealType {
    Unknown = 0,
    Breakfast = 1,
    Lunch = 2,
    Dinner = 3,
    Snack = 4,
    PreWorkout = 5,
    PostWorkout = 6,
    Custom = 99
}

/**
 * Enum representing the order of meals
 */
export enum MealOrder {
    Unknown = 0,
    FirstMeal = 1,
    SecondMeal = 2,
    ThirdMeal = 3,
    FourthMeal = 4,
    FifthMeal = 5,
    SixthMeal = 6,
    SeventhMeal = 7,
    EighthMeal = 8,
    NinthMeal = 9,
    TenthMeal = 10,
    Custom = 99
}

/**
 * Interface for creating a new meal
 */
export interface CreateMealRequest {
    name: string;
    description: string;
    mealType: MealType;
    mealOrder: MealOrder;
    startTime: string; // ISO date string
    endTime: string; // ISO date string
    dietId: number;
    tenantId: number;
    nutritionInfoIds?: number[];
    newNutritionInfoRequests?: any[]; // Replace with actual type when available
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
    nutritionInfoList: any[]; // Replace with actual type when available
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
