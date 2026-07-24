"use client"

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getRecipes, getRecipeTypes } from "@/api/services/recipes.service";
import { getProfile } from "@/api/services/profile.service";
import { Recipe, RecipeCategory } from "@/types/recipes.types";
import { Profile } from "@/types/profile.types";
import HomeCard from "@/components/home/HomeCard";
import HeaderHome  from "@/components/home/HeaderHome";
import Link from "next/link";
import { UtensilsCrossed } from "lucide-react";
import Loader from "@/components/Loader";

export default function Home () {
    const {isAuthenticated, token} = useAuth();
    const router = useRouter();
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [recipeTypes, setRecipeTypes] = useState<RecipeCategory[]>([]);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState<string | null>(null);

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/signin');
            return;
        }

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
            } catch (err) {
                setLoadError((err as Error).message || "Impossible de charger vos données.");
            } finally {
                setLoading(false);
            }
        };

        fetchRecipes();
    }, [isAuthenticated, router, token]);

    if (loading) {
        return <Loader />;
    }

    if (!isAuthenticated) {
        return null;
    }

    if (loadError) {
        return (
            <div className="mobile-container">
                <div className="bg-gradient-decor"></div>
                <div className="empty-state">
                    <UtensilsCrossed size={48} />
                    <h2>Oups…</h2>
                    <p>{loadError}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="mobile-container">
            <div className="bg-gradient-decor"></div>
            <HeaderHome profile={profile} />
            <section className="section-container list-section">
                <div className="section-header">
                    <h2 className="section-title">Recettes</h2>
                    <Link href="/recipes" className="view-all">Voir tout</Link>
                </div>
                <div className="card-list">
                    {recipes.length > 0 ? (
                        recipes.map((recipe) => (
                            <HomeCard
                                key={recipe.id}
                                recipe={recipe}
                                recipeTypes={recipeTypes.find((t) => t.id === recipe.recipe_type_id)?.name ?? ""}
                            />
                        ))
                    ) : (
                        <div className="empty-state">
                            <UtensilsCrossed size={48} />
                            <h2>Aucune recette</h2>
                            <p>Commence par ajouter ta première recette !</p>
                        </div>
                    )}
                </div>
            </section>
        </div>
    )
}

