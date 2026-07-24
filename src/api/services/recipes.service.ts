import { apiUrl, authHeaders, buildApiError } from "@/api/config/api.config";

export const getRecipes = async (token: string) => {
    const response = await fetch(apiUrl("/recipes"), {
        method: "GET",
        headers: authHeaders(token),
    });

    if (!response.ok) await buildApiError(response);
    return await response.json();
};

export const getRecipeTypes = async (token: string) => {
    const response = await fetch(apiUrl("/recipe-types"), {
        method: "GET",
        headers: authHeaders(token),
    });

    if (!response.ok) await buildApiError(response);
    return await response.json();
};

export const getRecipeById = async (id: number, token: string) => {
    const response = await fetch(apiUrl(`/recipes/${id}`), {
        method: "GET",
        headers: authHeaders(token),
    });

    if (!response.ok) await buildApiError(response);
    return await response.json();
};

export const createRecipe = async (recipeData: FormData, token: string) => {
    const response = await fetch(apiUrl("/recipes"), {
        method: "POST",
        headers: authHeaders(token, false),
        body: recipeData,
    });

    if (!response.ok) await buildApiError(response);
    return await response.json();
};

export const deleteRecipe = async (id: number, token: string) => {
    const response = await fetch(apiUrl(`/recipes/${id}`), {
        method: "DELETE",
        headers: authHeaders(token, false),
    });

    if (!response.ok) await buildApiError(response);
    return await response.json();
};

export const updateRecipe = async (recipeData: FormData, id: number, token: string) => {
    const response = await fetch(apiUrl(`/recipes/${id}`), {
        method: "PATCH",
        headers: authHeaders(token, false),
        body: recipeData,
    });

    if (!response.ok) await buildApiError(response);
    return await response.json();
};
