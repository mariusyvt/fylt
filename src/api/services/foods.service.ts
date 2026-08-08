import { apiUrl, authHeaders, buildApiError } from "@/api/config/api.config";
import { Food, NewFood } from "@/types/foods.types";
import { Nutrients } from "@/types/nutrition.types";

export const foodToNutrients = (food: Food): Nutrients => ({
    name: food.name,
    calories: food.calories_100g,
    proteins: food.proteins_100g,
    carbs: food.carbs_100g,
    lipids: food.lipids_100g,
});

export const searchFoods = async (
    token: string,
    query: string,
    limit = 20
): Promise<Food[]> => {
    const q = query.trim();
    if (q.length < 2) return [];

    const response = await fetch(
        apiUrl(`/foods/search?q=${encodeURIComponent(q)}&limit=${limit}`),
        {
            method: "GET",
            headers: authHeaders(token),
        }
    );

    if (!response.ok) await buildApiError(response);
    const data = await response.json();
    return Array.isArray(data.data) ? data.data : [];
};

export const getFoodByBarcode = async (
    token: string,
    code: string
): Promise<Food | null> => {
    const response = await fetch(apiUrl(`/foods/barcode/${encodeURIComponent(code)}`), {
        method: "GET",
        headers: authHeaders(token),
    });

    if (response.status === 404) return null;
    if (!response.ok) await buildApiError(response);
    const data = await response.json();
    return data.data ?? null;
};

export const createFood = async (token: string, food: NewFood): Promise<Food> => {
    const response = await fetch(apiUrl("/foods"), {
        method: "POST",
        headers: authHeaders(token),
        body: JSON.stringify(food),
    });

    if (!response.ok) await buildApiError(response);
    const data = await response.json();
    return data.data;
};

// 404 = déjà supprimé côté serveur : on considère l'opération réussie.
export const deleteFood = async (token: string, id: number): Promise<void> => {
    const response = await fetch(apiUrl(`/foods/${id}`), {
        method: "DELETE",
        headers: authHeaders(token, false),
    });

    if (response.status === 404) return;
    if (!response.ok) await buildApiError(response);
};
