import { PagedRequest } from './request-parameters';

// ✅ Union Types (Rehberinizden: Enum yerine union kullan)
export type ServingUnit = 'Grams' | 'Milliliters' | 'Pieces' | 'Cups' | 'Tablespoons';
export type FoodCategory = 'Dairy' | 'Proteins' | 'Grains' | 'Vegetables' | 'Fruits';

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

