"use client"

import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { getRecipes, getRecipeTypes } from "@/api/services/recipes.service";
import { Recipe, RecipeCategory } from "@/types/recipes.types";
import HeaderRecipes from "@/components/recipes/list/HeaderRecipes";
import { RecipeCard } from "@/components/recipes/list/RecipeCard";
import { getProfile } from "@/api/services/profile.service";
import { Profile } from "@/types/profile.types";
import { UtensilsCrossed } from "lucide-react";
import Loader from "@/components/Loader";

export default function RecipesPage () {
    const { token } = useAuth();
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [recipeTypes, setRecipeTypes] = useState<RecipeCategory[]>([]);
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState<Profile | null>(null)
    const [activeFilter, setActiveFilter] = useState<number | null>(null);

    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                if (token) {
                    const [resultRecipe, resultRecipeTypes, resultProfile] = await Promise.all([
                        getRecipes(token).catch(() => ({ data: [] })),
                        getRecipeTypes(token),
                        getProfile(token),
                    ]);
                    setRecipes(resultRecipe.data)
                    setRecipeTypes(resultRecipeTypes.data)
                    setProfile(resultProfile.data)
                }
            } finally {
                setLoading(false);
            }
        };

        fetchRecipes();
    }, [token]);

    if (loading) {
        return <Loader />;
    }

    const filteredRecipes = activeFilter
        ? recipes.filter((r) => r.recipe_type_id === activeFilter)
        : recipes;

    return (
        <>
            <div className="bg-gradient-decor"></div>
            {profile && (
                <HeaderRecipes
                    profile={profile}
                    recipeTypes={recipeTypes}
                    activeFilter={activeFilter}
                    onFilterChange={setActiveFilter}
                />
            )}
                <section className="section-container list-section">
                    {filteredRecipes.length > 0 ? (
                        <main className="recipe-grid">
                            {filteredRecipes.map((recipe) => (
                                <RecipeCard
                                    key={recipe.id}
                                    recipe={recipe}
                                    recipeType={recipeTypes.find((t) => t.id === recipe.recipe_type_id)?.name ?? ""}
                                />
                            ))}
                        </main>
                    ) : (
                        <div className="empty-state">
                            <UtensilsCrossed size={48} />
                            <h2>Aucune recette</h2>
                            <p>{activeFilter ? "Aucune recette dans cette catégorie." : "Commence par ajouter ta première recette !"}</p>
                        </div>
                    )}
                </section>

        </>
    )
}
