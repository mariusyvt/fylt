"use client"

import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { Recipe } from "@/types/recipes.types";
import HeaderRecipes from "@/components/recipes/list/HeaderRecipes";
import { RecipeCard } from "@/components/recipes/list/RecipeCard";
import { getProfile } from "@/api/services/profile.service";
import { Profile } from "@/types/profile.types";
import { UtensilsCrossed } from "lucide-react";
import Loader from "@/components/Loader";
import { useRecipes } from "@/hooks/useRecipes";

export default function RecipesPage () {
    const { isAuthenticated } = useAuth();
    const { recipes, recipeTypes, loading } = useRecipes();
    const [profile, setProfile] = useState<Profile | null>(null)
    const [activeFilter, setActiveFilter] = useState<number | null>(null);

    useEffect(() => {
        if (!isAuthenticated) return;
        getProfile()
            .then((res) => setProfile(res.data))
            .catch(() => setProfile(null));
    }, [isAuthenticated]);

    if (loading) {
        return <Loader />;
    }

    const filteredRecipes: Recipe[] = activeFilter
        ? recipes.filter((r) => r.recipe_type_id === activeFilter)
        : recipes;

    return (
        <>
            <div className="page-shell">
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
                            <main className="card-list">
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
            </div>
        </>
    )
}
