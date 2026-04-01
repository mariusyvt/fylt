export interface RecipeType {
    id: number;
    name: string;
    photo_url: string;
    preparation_time_minutes: number;
    recipe_type_id: number;
    servings: number;
    total_calories: string;
    total_carbs: string;
    total_lipids: string;
    total_proteins: string;
    updated_at: string;
    preparation_steps: RecipeStep[];
    recipe_ingredients: OneDetailIngredient[];
}

export interface RecipeCategory {
    id: number;
    name: string;
}

export interface RecipeIngredient {
    ingredientName: string
    quantity: string;
    unit: string;
    calories: string;
    proteins: string;
    carbs: string;
    lipids: string;
}

export interface RecipeStep {
    step_order: number;
    description: string;
}

export interface OneDetailIngredient {
    ingredient_calories: string;
    ingredient_carbs: string;
    ingredient_lipids: string;
    ingredient_name: string;
    ingredient_proteins: string;
    quantity: string;
    unit: string;
}