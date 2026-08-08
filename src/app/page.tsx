"use client"

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getRecipes, getRecipeTypes } from "@/api/services/recipes.service";
import { getProfile } from "@/api/services/profile.service";
import { getFoodLog } from "@/api/services/foodlog.service";
import { Recipe, RecipeCategory } from "@/types/recipes.types";
import { Profile } from "@/types/profile.types";
import { MacroSummary } from "@/types/tracking.types";
import { toISODate } from "@/utils/format.utils";
import HomeCard from "@/components/home/HomeCard";
import HeaderHome from "@/components/home/HeaderHome";
import TodaySummary from "@/components/home/TodaySummary";
import Link from "next/link";
import { UtensilsCrossed } from "lucide-react";
import Loader from "@/components/Loader";

const EMPTY_CONSUMED: MacroSummary = { calories: 0, proteins: 0, carbs: 0, lipids: 0 };
const MAX_RECIPES = 3;

const profileToGoal = (p: Profile | null): MacroSummary | null => {
    if (!p || p.daily_calories == null) return null;
    return {
        calories: p.daily_calories,
        proteins: p.daily_proteins ?? 0,
        carbs: p.daily_carbs ?? 0,
        lipids: p.daily_lipids ?? 0,
    };
};

export default function Home () {
    const {isAuthenticated, token} = useAuth();
    const router = useRouter();
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [recipeTypes, setRecipeTypes] = useState<RecipeCategory[]>([]);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [consumed, setConsumed] = useState<MacroSummary>(EMPTY_CONSUMED);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState<string | null>(null);

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/signin');
            return;
        }

        const fetchData = async () => {
            try {
                if (token) {
                    const [resultRecipe, resultRecipeTypes, resultProfile, resultFoodLog] = await Promise.all([
                        getRecipes(token).catch(() => ({ data: [] })),
                        getRecipeTypes(token),
                        getProfile(token),
                        getFoodLog(token, toISODate(new Date())).catch(() => null),
                    ]);
                    setRecipes(resultRecipe.data)
                    setRecipeTypes(resultRecipeTypes.data)
                    setProfile(resultProfile.data)
                    if (resultFoodLog?.data?.consumed) {
                        setConsumed(resultFoodLog.data.consumed);
                    }
                }
            } catch (err) {
                setLoadError((err as Error).message || "Impossible de charger vos données.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [isAuthenticated, router, token]);

    if (loading) {
        return <Loader />;
    }

    if (!isAuthenticated) {
        return null;
    }

    if (loadError) {
        return (
            <div className="page-shell">
                <div className="bg-gradient-decor"></div>
                <div className="empty-state">
                    <UtensilsCrossed size={48} />
                    <h2>Oups…</h2>
                    <p>{loadError}</p>
                </div>
            </div>
        );
    }

    const goal = profileToGoal(profile);
    const topRecipes = recipes.slice(0, MAX_RECIPES);

    return (
        <div className="page-shell">
            <div className="bg-gradient-decor"></div>
            <HeaderHome profile={profile} />

            <TodaySummary goal={goal} consumed={consumed} />

            <section className="section-container list-section">
                <div className="section-header">
                    <h2 className="section-title">Recettes</h2>
                    <Link href="/recipes" className="view-all">Voir tout</Link>
                </div>
                <div className="card-list">
                    {topRecipes.length > 0 ? (
                        topRecipes.map((recipe) => (
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
