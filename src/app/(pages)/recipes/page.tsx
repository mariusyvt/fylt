"use client"

import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { getRecipes, getRecipesTypes } from "@/api/services/recipes.service";
import { RecipeType, RecipeCategory } from "@/types/recipes.types";
import HeaderRecipes from "@/components/recipes/list/HeaderRecipes";
import { RecipeCard } from "@/components/recipes/list/RecipeCard";
import { getProfiles } from "@/api/services/profile.service";
import { Profiles } from "@/types/profiles.types";
import Loader from "@/components/Loader";

export default function Recipe () {
    const { token } = useAuth();
    const [recipes, setRecipes] = useState<RecipeType[]>([]);
    const [recipeTypes, setRecipeTypes] = useState<RecipeCategory[]>([]);
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState<Profiles | null>(null)
    const [activeFilter, setActiveFilter] = useState<number | null>(null);

    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                if (token) {
                    const resultRecipe = await getRecipes(token);
                    const resultRecipeTypes = await getRecipesTypes(token);
                    const resultProfile = await getProfiles(token);
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
                    <main className="recipe-grid">
                        {filteredRecipes.map((recipe) => (
                            <RecipeCard
                                key={recipe.id}
                                recipe={recipe}
                                recipeType={recipeTypes.find((t) => t.id === recipe.recipe_type_id)?.name ?? ""}
                            />
                        ))}
                    </main>
                </section>

        </>
    )
}
