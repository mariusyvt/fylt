import { useEffect, useState } from "react";
import { getRecipeById } from "@/api/services/recipes.service";
import { useAuth } from "@/context/AuthContext";
import { RecipeType } from "@/types/recipes.types";
import { useParams, useRouter } from "next/navigation";

export const useRecipe = () => {
    const {token} = useAuth();
    const router = useRouter();
    const params = useParams();

    const [recipes, setRecipes] = useState<RecipeType | null>(null);
    const [loading, setLoading] = useState(true);
    const id = params.id as string;

    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                if (token) {
                    const result = await getRecipeById(Number(id), token);
                    setRecipes(result.data);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchRecipes();
    }, [router, token, id]);

    return {
        recipes,
        loading,
        id
    };
}

export const useRecipeTypes = () => {

}