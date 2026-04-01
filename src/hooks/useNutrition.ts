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
            ingredientName,
            quantity: String(quantity),
            calories: proportion.calories,
            proteins: proportion.proteins,
            carbs: proportion.carbs,
            lipids: proportion.lipids,
        }]);
        setScannedNutrients(null);
        setIngredientName("");
        setQuantity("");
    }

    const removeIngredient = (index: number) => {
        setIngredient(prev => prev.filter((_, i) => i !== index));
    };

    return {
        ingredient,
        scannedNutrients,
        setScannedNutrients,
        ingredientName,
        setIngredientName,
        quantity,
        setQuantity,
        addIngredient,
        removeIngredient
    };
}