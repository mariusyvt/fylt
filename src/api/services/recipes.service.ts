import { apiFetchJson } from "@/api/config/api.config";
import { ApiResponse } from "@/types/api.types";
import { Recipe, RecipeCategory, RecipePayload } from "@/types/recipes.types";

export const getRecipes = async () =>
    apiFetchJson<ApiResponse<Recipe[]>>("/recipes", { method: "GET" });

export const getRecipeTypes = async () =>
    apiFetchJson<ApiResponse<RecipeCategory[]>>("/recipe-types", { method: "GET" });

export const getRecipeById = async (id: number) =>
    apiFetchJson<ApiResponse<Recipe>>(`/recipes/${id}`, { method: "GET" });

export const uploadRecipeImage = async (file: File): Promise<{ photo_url: string }> => {
    const formData = new FormData();
    formData.append("photo", file);
    const response = await apiFetchJson<ApiResponse<{ photo_url: string }>>("/uploads/recipes", {
        method: "POST",
        body: formData,
    });
    return response.data;
};

export const createRecipe = async (payload: RecipePayload) =>
    apiFetchJson("/recipes", { method: "POST", json: payload });

export const deleteRecipe = async (id: number) =>
    apiFetchJson(`/recipes/${id}`, { method: "DELETE" });

export const updateRecipe = async (payload: RecipePayload, id: number) =>
    apiFetchJson(`/recipes/${id}`, { method: "PATCH", json: payload });

export const editPreparationStep = async (
    recipeId: number,
    preparationId: number,
    payload: { description?: string; step_order?: number }
) =>
    apiFetchJson<ApiResponse<{ id: number; description: string; step_order: number }>>(
        `/preparation/recipe/${recipeId}/preparation/${preparationId}`,
        { method: "PATCH", json: { preparation: payload } }
    );
