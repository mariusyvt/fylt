"use client"

import { useState, useEffect } from "react";
import { RecipeCategory, RecipeIngredient, RecipeStep, RecipeType } from "@/types/recipes.types";
import { parsePreparationTime } from "@/utils/format.utils";
import { createRecipe, updateRecipe } from "@/api/services/recipes.service";
import { useAuth } from "@/context/AuthContext";
import { storeHydrationErrorStateFromConsoleArgs } from "next/dist/next-devtools/userspace/pages/hydration-error-state";

type PickerType = "time" | "persons" | "ingredient" | "step" | null;

export const useEditRecipe = (recipeData: RecipeType | null, ingredient: RecipeIngredient[], steps: RecipeStep[], id: number) => {
    const [title, setTitle] = useState("");
    const [photo, setPhoto] = useState<File | null>(null);
    const [photoUrl, setPhotoUrl] = useState<string | null>(null);
    const [preparationTime, setPreparationTime] = useState("");
    const [servings, setServings] = useState<number>();
    const [selectedRecipeTypeId, setSelectedRecipeTypeId] = useState<string>("");
    const [recipeType, setRecipeType] = useState<RecipeCategory[]>([]);
    const [activePicker, setActivePicker] = useState<PickerType>(null);
    const [ingredients, setIngredients] = useState<RecipeIngredient[]>([]);
    const [step, setStep] = useState<RecipeStep[]>([]);
    const {token} = useAuth();
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (recipeData) {
            setTitle(recipeData.name);
            setPhotoUrl(recipeData.photo_url)
            setPreparationTime(recipeData.preparation_time_minutes.toString())
            setServings(recipeData.servings)
            setSelectedRecipeTypeId(recipeData.recipe_type_id.toString())
            setIngredients(recipeData.recipe_ingredients)
            setStep(recipeData.preparation_steps)
        }
    }, [recipeData]);

    const handleSubmit = async () => {
        setErrors({});
        const calculatedCalories = ingredient.reduce((sum, ing) => sum + parseFloat(ing.ingredient_calories), 0)
        const calculatedProteins = ingredient.reduce((sum, ing) => sum + parseFloat(ing.ingredient_proteins), 0)
        const calculatedCarbs = ingredient.reduce((sum, ing) => sum + parseFloat(ing.ingredient_carbs), 0)
        const calculatedLipids = ingredient.reduce((sum, ing) => sum + parseFloat(ing.ingredient_lipids), 0)

        const recipe = {
            name: title,
            preparation_time_minutes: parsePreparationTime(preparationTime),
            servings: servings,
            total_calories: calculatedCalories,
            total_proteins: calculatedProteins,
            total_carbs: calculatedCarbs,
            total_lipids: calculatedLipids,
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

        const formData = new FormData();

        formData.append("recipe", JSON.stringify(recipe))
        formData.append("preparation_steps", JSON.stringify(steps))
        formData.append("ingredients", formattedIngredients)
        if (photo) formData.append("photo", photo)

        try {
            console.log("📤 Envoi PATCH avec:", { recipe, formattedIngredients, steps });
            const result = await updateRecipe(formData, id, token!);
            console.log("✅ Réponse API:", result);
            return true
        } catch (error: any) {
            console.log("❌ ERREUR API:", error);
            if (error.errors && Array.isArray(error.errors)) {
                const errorMap: Record<string, string> = {};
                error.errors.forEach((e: any) => {
                    errorMap[e.field] = e.message;
                });
                setErrors(errorMap);

                return false
            }
            return false;
        }
    }

    return {
        title,
        setTitle,
        photo,
        setPhoto,
        photoUrl,
        preparationTime,
        setPreparationTime,
        setServings,
        servings,
        setSelectedRecipeTypeId,
        selectedRecipeTypeId,
        setRecipeType,
        recipeType,
        activePicker,
        setActivePicker,
        ingredients,
        setIngredients,
        step,
        setStep,
        errors,
        handleSubmit
    }
}
