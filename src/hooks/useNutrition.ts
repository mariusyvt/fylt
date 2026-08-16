import { useState } from "react";
import { calculateProportionalNutrients } from "@/utils/nutrition.utils";
import { Nutrients } from "@/types/nutrition.types";
import { RecipeIngredient } from "@/types/recipes.types";

export const useNutrition = () => {
    const [ingredient, setIngredient] = useState<RecipeIngredient[]>([])
    const [scannedNutrients, setScannedNutrients] = useState<Nutrients | null>(null);
    const [ingredientName ,setIngredientName] = useState<string>("");
    const [quantity, setQuantity] = useState("");


    const addIngredient = (nutrients: Nutrients, quantity: number, name: string) => {
        const proportion = calculateProportionalNutrients(nutrients, quantity);
        setIngredient(prev => [...prev, {
            ingredient_name: name,
            quantity: String(quantity),
            unit: "g",
            ingredient_calories: proportion.calories,
            ingredient_proteins: proportion.proteins,
            ingredient_carbs: proportion.carbs,
            ingredient_lipids: proportion.lipids,
        }]);
        setScannedNutrients(null);
        setIngredientName("");
        setQuantity("");
    }

    const removeIngredient = (index: number) => {
        setIngredient(prev => prev.filter((_, i) => i !== index));
    };

    const editIngredient = (index: number, nutrients: Nutrients, quantity: number, name: string) => {
        const proportion = calculateProportionalNutrients(nutrients, quantity);
        setIngredient(prev => prev.map((ing, i) => i === index ? {
            ingredient_name: name,
            quantity: String(quantity),
            unit: "g",
            ingredient_calories: proportion.calories,
            ingredient_proteins: proportion.proteins,
            ingredient_carbs: proportion.carbs,
            ingredient_lipids: proportion.lipids,
        } : ing));
        setScannedNutrients(null);
        setIngredientName("");
        setQuantity("");
    };

    return {
        ingredient,
        setIngredient,
        scannedNutrients,
        setScannedNutrients,
        ingredientName,
        setIngredientName,
        quantity,
        setQuantity,
        addIngredient,
        removeIngredient,
        editIngredient
    };
}