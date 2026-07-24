import { useEffect, useState } from "react";
import { getRecipeById, deleteRecipe } from "@/api/services/recipes.service";
import { useAuth } from "@/hooks/useAuth";
import { Recipe } from "@/types/recipes.types";
import { useParams, useRouter } from "next/navigation";

export const useRecipe = () => {
    const {token} = useAuth();
    const router = useRouter();
    const params = useParams();

    const [recipes, setRecipes] = useState<Recipe | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const id = params.id as string;

    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                if (token) {
                    const result = await getRecipeById(Number(id), token);
                    setRecipes(result.data);
                }
            } catch (err) {
                setError((err as Error).message || "Impossible de charger la recette.");
            } finally {
                setLoading(false);
            }
        };

        fetchRecipes();
    }, [router, token, id]);

    const removeRecipe = async () => {
        if (!token) return;
        await deleteRecipe(Number(id), token);
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
