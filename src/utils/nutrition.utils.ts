import { Nutrients, CalculatedNutrients } from "@/types/nutrition.types";

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

