export interface Recipe {
    id: number;
    name: string;
    photo_url: string;
    preparation_time_minutes: number;
    recipe_type_id: number;
    recipe_types: RecipeCategory;
    servings: number;
    total_calories: string;
    total_carbs: string;
    total_lipids: string;
    total_proteins: string;
    total_weight: number;
    updated_at: string;
    preparation_steps: RecipeStep[];
    recipe_ingredients: RecipeIngredient[];
}

export interface RecipeCategory {
    id: number;
    name: string;
}

export interface RecipeIngredient {
    ingredient_name: string
    quantity: string;
    unit: string;
    ingredient_calories: string;
    ingredient_proteins: string;
    ingredient_carbs: string;
    ingredient_lipids: string;
}

export interface RecipeStep {
    id?: number;
    step_order: number;
    description: string;
}

export interface RecipeInput {
    name: string;
    preparation_time_minutes: number;
    servings?: number;
    total_calories: number;
    total_proteins: number;
    total_carbs: number;
    total_lipids: number;
    recipe_type_id: number;
}

export interface RecipeIngredientInput {
    api_ingredient_id: number;
    ingredient_name: string;
    quantity: number;
    unit: string;
    ingredient_calories: number;
    ingredient_proteins: number;
    ingredient_carbs: number;
    ingredient_lipids: number;
}

export interface RecipePayload {
    recipe: RecipeInput;
    preparation_steps: RecipeStep[];
    ingredients: RecipeIngredientInput[];
    photo_url: string | null;
}