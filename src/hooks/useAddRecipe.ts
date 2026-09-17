import { RecipeCategory, RecipeIngredient, RecipeStep } from "@/types/recipes.types";
import { ApiError } from "@/types/api.types";
import { useEffect, useRef, useState } from "react";
import { createRecipe, getRecipeTypes } from "@/api/services/recipes.service";
import { invalidateRecipesCache } from "@/hooks/useRecipes";
import { useAuth } from "@/hooks/useAuth";
import { useImageUpload } from "@/hooks/useImageUpload";
import { parsePreparationTime } from "@/utils/format.utils";
import { calculateTotalNutrition } from "@/utils/nutrition.utils";

type PickerType = "time" | "persons" | "ingredient" | "step" | null;

export const useAddRecipe = (ingredient: RecipeIngredient[], steps: RecipeStep[]) => {
    const [preparationTime, setPreparationTime] = useState("");
    const [servings, setServings] = useState<number>();
    const [title, setTitle] = useState("");
    const [selectedRecipeTypeId, setSelectedRecipeTypeId] = useState<string>("");
    const [recipeType, setRecipeType] = useState<RecipeCategory[]>([]);
    const [activePicker, setActivePicker] = useState<PickerType>(null);
    const {isAuthenticated} = useAuth();
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [submitting, setSubmitting] = useState(false);
    const submittingRef = useRef(false);

    const {
        photo,
        photoUrl,
        previewUrl,
        uploading,
        uploadError,
        selectImage,
        clearImage,
    } = useImageUpload();

    useEffect(() => {
        const fetchRecipeTypes = async () => {
            if (!isAuthenticated) return;
            const result = await getRecipeTypes();
            setRecipeType(result.data);
        };
        fetchRecipeTypes();
    }, [isAuthenticated]);

    const handleSubmit = async () => {
        if (submittingRef.current) return false;
        setErrors({});
        if (!isAuthenticated) {
            setErrors({ _global: "Vous devez être connecté." });
            return false;
        }
        if (uploading) {
            setErrors({ photo: "Veuillez patienter, l'image est en cours d'envoi." });
            return false;
        }
        if (uploadError) {
            setErrors({ photo: uploadError });
            return false;
        }

        submittingRef.current = true;
        setSubmitting(true);
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

        const formattedIngredients = ingredient.map(ing => ({
            api_ingredient_id: 1,
            ingredient_name: ing.ingredient_name,
            quantity: Number(ing.quantity),
            unit: "g",
            ingredient_calories: Number(ing.ingredient_calories),
            ingredient_proteins: Number(ing.ingredient_proteins),
            ingredient_carbs: Number(ing.ingredient_carbs),
            ingredient_lipids: Number(ing.ingredient_lipids),
        }))

        try {
            await createRecipe({
                recipe,
                preparation_steps: steps,
                ingredients: formattedIngredients,
                photo_url: photoUrl,
            });
            invalidateRecipesCache();
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
            submittingRef.current = false;
            setSubmitting(false);
            return false;
        }
    }

    return {
        photo,
        photoUrl,
        previewUrl,
        uploading,
        uploadError,
        selectImage,
        clearImage,
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
        submitting,
        errors
    }
}