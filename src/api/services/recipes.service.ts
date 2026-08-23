import { apiFetchJson } from "@/api/config/api.config";
import { ApiResponse } from "@/types/api.types";
import { Recipe, RecipeCategory } from "@/types/recipes.types";

export const getRecipes = async () =>
    apiFetchJson<ApiResponse<Recipe[]>>("/recipes", { method: "GET" });

export const getRecipeTypes = async () =>
    apiFetchJson<ApiResponse<RecipeCategory[]>>("/recipe-types", { method: "GET" });

export const getRecipeById = async (id: number) =>
    apiFetchJson<ApiResponse<Recipe>>(`/recipes/${id}`, { method: "GET" });

export const createRecipe = async (recipeData: FormData) =>
    apiFetchJson("/recipes", { method: "POST", body: recipeData });

export const deleteRecipe = async (id: number) =>
    apiFetchJson(`/recipes/${id}`, { method: "DELETE" });

export const updateRecipe = async (recipeData: FormData, id: number) =>
    apiFetchJson(`/recipes/${id}`, { method: "PATCH", body: recipeData });
