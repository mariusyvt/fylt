import { Nutrients, CalculatedNutrients } from "@/types/nutrition.types";
import { RecipeIngredient } from "@/types/recipes.types";

export const calculateProportionalNutrients = (
    nutrients: Nutrients,
    quantityInGrams: number
): CalculatedNutrients => {

    return {
        calories: ((quantityInGrams * nutrients.calories) / 100).toFixed(1),
        proteins: ((quantityInGrams * nutrients.proteins) / 100).toFixed(1),
        carbs: ((quantityInGrams * nutrients.carbs) / 100).toFixed(1),
        lipids: ((quantityInGrams * nutrients.lipids) / 100).toFixed(1),
    };
};

/**
 * Additionne les valeurs nutritionnelles d'une liste d'ingrédients.
 */
export const calculateTotalNutrition = (ingredients: RecipeIngredient[]) => ({
    calories: ingredients.reduce((sum, ing) => sum + parseFloat(ing.ingredient_calories), 0),
    proteins: ingredients.reduce((sum, ing) => sum + parseFloat(ing.ingredient_proteins), 0),
    carbs: ingredients.reduce((sum, ing) => sum + parseFloat(ing.ingredient_carbs), 0),
    lipids: ingredients.reduce((sum, ing) => sum + parseFloat(ing.ingredient_lipids), 0),
});
