import { apiFetch, apiFetchJson } from "@/api/config/api.config";
import { Food, NewFood } from "@/types/foods.types";
import { Nutrients } from "@/types/nutrition.types";

export const foodToNutrients = (food: Food): Nutrients => ({
    name: food.name,
    calories: food.calories_100g,
    proteins: food.proteins_100g,
    carbs: food.carbs_100g,
    lipids: food.lipids_100g,
});

export const searchFoods = async (query: string, limit = 20): Promise<Food[]> => {
    const q = query.trim();
    if (q.length < 2) return [];

    const data = await apiFetchJson<{ data?: Food[] }>(
        `/foods/search?q=${encodeURIComponent(q)}&limit=${limit}`,
        { method: "GET" }
    );
    return Array.isArray(data.data) ? data.data : [];
};

export const getFoodByBarcode = async (code: string): Promise<Food | null> => {
    try {
        const data = await apiFetchJson<{ data?: Food }>(
            `/foods/barcode/${encodeURIComponent(code)}`,
            { method: "GET" }
        );
        return data.data ?? null;
    } catch (err) {
        if ((err as { status?: number }).status === 404) return null;
        throw err;
    }
};

export const createFood = async (food: NewFood): Promise<Food> => {
    const data = await apiFetchJson<{ data: Food }>("/foods", { method: "POST", json: food });
    return data.data;
};

// 404 = deja supprime cote serveur : on considere l'operation reussie.
export const deleteFood = async (id: number): Promise<void> => {
    try {
        await apiFetch(`/foods/${id}`, { method: "DELETE" });
    } catch (err) {
        if ((err as { status?: number }).status === 404) return;
        throw err;
    }
};
