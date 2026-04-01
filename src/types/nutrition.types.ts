export interface Nutrients {
    name: string;
    calories: number;
    proteins: number;
    carbs: number;
    lipids: number;
}

export interface CalculatedNutrients {
    calories: string;
    proteins: string;
    carbs: string;
    lipids: string;
}

export interface IngredientNutrients {
    nutrients: CalculatedNutrients,
    name: string;
    quantity: number
}
