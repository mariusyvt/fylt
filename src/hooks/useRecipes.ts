"use client";

import { useCallback, useEffect, useState } from "react";
import { getRecipes, getRecipeTypes } from "@/api/services/recipes.service";
import { Recipe, RecipeCategory } from "@/types/recipes.types";
import { useAuth } from "@/hooks/useAuth";

interface RecipesData {
    recipes: Recipe[];
    recipeTypes: RecipeCategory[];
}

// Cache module-level partage entre toutes les pages : evite de refetcher les
// recettes a chaque navigation (home, tracking, recipes) et deduplique les
// requetes declenchees simultanement.
let cache: RecipesData | null = null;
let inflight: Promise<RecipesData> | null = null;

const fetchRecipesData = (): Promise<RecipesData> => {
    if (cache) return Promise.resolve(cache);
    if (inflight) return inflight;

    inflight = Promise.all([
        getRecipes().catch(() => ({ data: [] as Recipe[] })),
        getRecipeTypes().catch(() => ({ data: [] as RecipeCategory[] })),
    ])
        .then(([r, t]) => {
            cache = { recipes: r.data ?? [], recipeTypes: t.data ?? [] };
            inflight = null;
            return cache;
        })
        .catch((err) => {
            inflight = null;
            throw err;
        });

    return inflight;
};

/** Invalide le cache des recettes (a appeler apres creation/edition/suppression). */
export const invalidateRecipesCache = () => {
    cache = null;
    inflight = null;
};

export const useRecipes = () => {
    const { isAuthenticated } = useAuth();
    const [recipes, setRecipes] = useState<Recipe[]>(cache?.recipes ?? []);
    const [recipeTypes, setRecipeTypes] = useState<RecipeCategory[]>(cache?.recipeTypes ?? []);
    const [loading, setLoading] = useState(!cache);
    const [error, setError] = useState<string | null>(null);

    const load = useCallback(
        async (force = false) => {
            if (!isAuthenticated) return;
            if (force) invalidateRecipesCache();
            setLoading(!cache);
            setError(null);
            try {
                const data = await fetchRecipesData();
                setRecipes(data.recipes);
                setRecipeTypes(data.recipeTypes);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Impossible de charger les recettes.");
            } finally {
                setLoading(false);
            }
        },
        [isAuthenticated]
    );

    useEffect(() => {
        load();
    }, [load]);

    return { recipes, recipeTypes, loading, error, refresh: () => load(true) };
};
