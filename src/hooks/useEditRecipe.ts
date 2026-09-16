"use client"

import { useState, useEffect, useRef } from "react";
import { RecipeCategory, RecipeIngredient, RecipeStep, Recipe } from "@/types/recipes.types";
import { ApiError } from "@/types/api.types";
import { parsePreparationTime, formatPreparationTime } from "@/utils/format.utils";
import { updateRecipe, getRecipeTypes } from "@/api/services/recipes.service";
import { invalidateRecipesCache } from "@/hooks/useRecipes";
import { calculateTotalNutrition } from "@/utils/nutrition.utils";
import { useAuth } from "@/hooks/useAuth";
import { useImageUpload } from "@/hooks/useImageUpload";

type PickerType = "time" | "persons" | "ingredient" | "step" | null;

export const useEditRecipe = (recipeData: Recipe | null, ingredient: RecipeIngredient[], steps: RecipeStep[], id: number) => {
    const [title, setTitle] = useState("");
    const [preparationTime, setPreparationTime] = useState("");
    const [servings, setServings] = useState<number>();
    const [selectedRecipeTypeId, setSelectedRecipeTypeId] = useState<string>("");
    const [recipeType, setRecipeType] = useState<RecipeCategory[]>([]);
    const [activePicker, setActivePicker] = useState<PickerType>(null);
    const [ingredients, setIngredients] = useState<RecipeIngredient[]>([]);
    const [step, setStep] = useState<RecipeStep[]>([]);
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
        setInitialPhotoUrl,
    } = useImageUpload();

    useEffect(() => {
        const fetchRecipeTypes = async () => {
            if (!isAuthenticated) return;
            const result = await getRecipeTypes();
            setRecipeType(result.data);
        };
        fetchRecipeTypes();
    }, [isAuthenticated]);

    useEffect(() => {
        if (recipeData) {
            setTitle(recipeData.name);
            setInitialPhotoUrl(recipeData.photo_url)
            setPreparationTime(formatPreparationTime(recipeData.preparation_time_minutes))
            setServings(recipeData.servings)
            setSelectedRecipeTypeId(recipeData.recipe_type_id.toString())
            setIngredients(recipeData.recipe_ingredients)
            setStep(recipeData.preparation_steps)
        }
    }, [recipeData, setInitialPhotoUrl]);

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
            await updateRecipe({
                recipe,
                preparation_steps: steps,
                ingredients: formattedIngredients,
                photo_url: photoUrl,
            }, id);
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

                submittingRef.current = false;
                setSubmitting(false);
                return false
            }
            submittingRef.current = false;
            setSubmitting(false);
            return false;
        }
    }

    return {
        title,
        setTitle,
        photo,
        photoUrl,
        previewUrl,
        uploading,
        uploadError,
        selectImage,
        clearImage,
        preparationTime,
        setPreparationTime,
        setServings,
        servings,
        setSelectedRecipeTypeId,
        selectedRecipeTypeId,
        recipeType,
        activePicker,
        setActivePicker,
        ingredients,
        setIngredients,
        step,
        setStep,
        errors,
        submitting,
        handleSubmit
    }
}
