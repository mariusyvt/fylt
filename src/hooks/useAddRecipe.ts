import { RecipeCategory, RecipeIngredient, RecipeStep } from "@/types/recipes.types";
import { ApiError } from "@/types/api.types";
import { useEffect, useState } from "react";
import { createRecipe, getRecipeTypes } from "@/api/services/recipes.service";
import { useAuth } from "@/hooks/useAuth";
import { parsePreparationTime } from "@/utils/format.utils";
import { calculateTotalNutrition } from "@/utils/nutrition.utils";

type PickerType = "time" | "persons" | "ingredient" | "step" | null;

export const useAddRecipe = (ingredient: RecipeIngredient[], steps: RecipeStep[]) => {
    const [preparationTime, setPreparationTime] = useState("");
    const [servings, setServings] = useState<number>();
    const [title, setTitle] = useState("");
    const [selectedRecipeTypeId, setSelectedRecipeTypeId] = useState<string>("");
    const [photo, setPhoto] = useState<File | null>(null);
    const [recipeType, setRecipeType] = useState<RecipeCategory[]>([]);
    const [activePicker, setActivePicker] = useState<PickerType>(null);
    const {token} = useAuth();
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        const fetchRecipeTypes = async () => {
            if (!token) return;
            const result = await getRecipeTypes(token);
            setRecipeType(result.data);
        };
        fetchRecipeTypes();
    }, [token]);

    const handleSubmit = async () => {
        setErrors({});
        if (!token) {
            setErrors({ _global: "Vous devez être connecté." });
            return false;
        }
        const totals = calculateTotalNutrition(ingredient);

        const recipe = {
            name: title,
            preparation_time_minutes: parsePreparationTime(preparationTime),
            servings: servings,
            total_calories: totals.calories,
            total_proteins: totals.proteins,
            total_carbs: totals.carbs,
            total_lipids: totals.lipids,
            recipe_type_id: Number(selectedRecipeTypeId),
        }

        const formattedIngredients = JSON.stringify(ingredient.map(ing => ({
            api_ingredient_id: 1,
            ingredient_name: ing.ingredient_name,
            quantity: Number(ing.quantity),
            unit: "g",
            ingredient_calories: Number(ing.ingredient_calories),
            ingredient_proteins: Number(ing.ingredient_proteins),
            ingredient_carbs: Number(ing.ingredient_carbs),
            ingredient_lipids: Number(ing.ingredient_lipids),
        })))

        const recipeData = new FormData();

        recipeData.append("recipe", JSON.stringify(recipe))
        recipeData.append("preparation_steps", JSON.stringify(steps))
        recipeData.append("ingredients", formattedIngredients)
        if (photo) recipeData.append("photo", photo)

        try {
            await createRecipe(recipeData, token);
            return true
        } catch (error) {
            const apiError = error as ApiError;
            if (apiError.errors && Array.isArray(apiError.errors)) {
                const errorMap: Record<string, string> = {};
                apiError.errors.forEach((e) => {
                    errorMap[e.field] = e.message;
                });
                setErrors(errorMap);
            }
            return false;
        }
    }

    return {
        photo,
        setPhoto,
        preparationTime,
        setPreparationTime,
        servings,
        setServings,
        title,
        setTitle,
        selectedRecipeTypeId,
        setSelectedRecipeTypeId,
        recipeType,
        activePicker,
        setActivePicker,
        handleSubmit,
        errors
    }
}