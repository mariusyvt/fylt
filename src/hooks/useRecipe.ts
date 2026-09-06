import { useEffect, useState } from "react";
import { getRecipeById, deleteRecipe } from "@/api/services/recipes.service";
import { useAuth } from "@/hooks/useAuth";
import { invalidateRecipesCache } from "@/hooks/useRecipes";
import { Recipe } from "@/types/recipes.types";
import { useParams, useRouter } from "next/navigation";

export const useRecipe = () => {
    const {isAuthenticated} = useAuth();
    const router = useRouter();
    const params = useParams();

    const [recipes, setRecipes] = useState<Recipe | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const id = params.id as string;

    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                if (isAuthenticated) {
                    const result = await getRecipeById(Number(id));
                    setRecipes(result.data);
                }
            } catch (err) {
                setError((err as Error).message || "Impossible de charger la recette.");
            } finally {
                setLoading(false);
            }
        };

        fetchRecipes();
    }, [router, isAuthenticated, id]);

    const removeRecipe = async () => {
        if (!isAuthenticated) return;
        await deleteRecipe(Number(id));
        invalidateRecipesCache();
        router.push("/recipes");
    };

    return {
        recipes,
        loading,
        error,
        id,
        removeRecipe,
    };
}
