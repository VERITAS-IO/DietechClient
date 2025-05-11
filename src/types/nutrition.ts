import { IntervalData } from './financial';
import { PagedRequest } from './request-parameters';

export enum ServingUnit {
    Grams = "Grams",
    Milliliters = "Milliliters",
    Pieces = "Pieces",
    Cups = "Cups",
    Tablespoons = "Tablespoons"
}


export enum FoodCategory {
    Dairy = "Dairy",
    Proteins = "Proteins",
    Grains = "Grains",
    Vegetables = "Vegetables",
    Fruits = "Fruits"
}

export interface CreateNutritionInfoRequest {
    name: string;
    servingSize: number;
    servingUnit: ServingUnit;
    foodCategory: FoodCategory;
    totalCalories?: number;
    totalFat?: number;
    carbohydrates?: number;
    protein?: number;
    fiber?: number;
    addedSugars?: number;
    sugars?: number;
    saturatedFat?: number;
    transFat?: number;
    cholesterol?: number;
    sodium?: number;
    potassium?: number;
    vitaminA?: number;
    vitaminB?: number;
    vitaminC?: number;
    vitaminD?: number;
    calcium?: number;
    iron?: number;
}

export interface UpdateNutritionInfoRequest {
    name?: string;
    servingSize?: number;
    servingUnit?: ServingUnit;
    foodCategory?: FoodCategory;
    caloriesPerServing?: number;
    totalFat?: number;
    carbohydrates?: number;
    protein?: number;
    fiber?: number;
    addedSugars?: number;
    sugars?: number;
    saturatedFat?: number;
    transFat?: number;
    cholesterol?: number;
    sodium?: number;
    potassium?: number;
    vitaminA?: number;
    vitaminB?: number;
    vitaminC?: number;
    vitaminD?: number;
    calcium?: number;
    iron?: number;
}

export interface QueryNutritionInfoRequest extends PagedRequest {
    name?: string;
    servingUnit?: ServingUnit;
    foodCategory?: FoodCategory;
    minCalories?: number;
    maxCalories?: number;
}

export interface NutritionInfoListItem {
    id: number;
    name: string;
    servingSize: number;
    servingUnit: ServingUnit;
    foodCategory: FoodCategory;
    caloriesPerServing?: number;
    totalFat?: number;
    protein?: number;
    carbohydrates?: number;
    fiber?: number;
    sugars?: number;
    sodium?: number;
    tenantId: number;
}

export interface NutritionInfoDetail {
    id: number;
    name: string;
    servingSize: number;
    servingUnit: ServingUnit;
    foodCategory: FoodCategory;
    totalCalories: number;
    caloriesPerServing?: number;
    totalFat?: number;
    carbohydrates?: number;
    protein?: number;
    fiber?: number;
    addedSugars?: number;
    sugars?: number;
    saturatedFat?: number;
    transFat?: number;
    cholesterol?: number;
    sodium?: number;
    potassium?: number;
    vitaminA?: number;
    vitaminB?: number;
    vitaminC?: number;
    vitaminD?: number;
    calcium?: number;
    iron?: number;
    tenantId: number;
    createdAt: Date;
    lastModifiedAt: Date;
}

export enum FinancialInterval {
    Unknown = 0,
    Daily = 1,
    Weekly = 2,
    Monthly = 3,
    Yearly = 4
}

export interface GetFinancialOverviewInitRequest {
    startDate?: Date;
    endDate?: Date;
    interval?: FinancialInterval;
    dieticianId?: number;
}

export interface GetFinancialOverviewInitResponse {
    intervals: Record<FinancialInterval, IntervalData[]>;
    totalNetIncome: number;
    totalExpenses: number;
    pendingExpenses: number;
    pendingIncome: number;
    pendingNetIncome: number;
    completedIncomes: number;
    totalTransactions: number;
}
