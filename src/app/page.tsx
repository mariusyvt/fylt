"use client"

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getRecipes, getRecipesTypes } from "@/api/services/recipes.service";
import { getProfiles } from "@/api/services/profile.service";
import { RecipeType, RecipeCategory } from "@/types/recipes.types";
import { Profiles } from "@/types/profiles.types";
import Card  from "@/components/home/Card";
import HeaderHome  from "@/components/home/HeaderHome";
import Link from "next/link";
import { UtensilsCrossed } from "lucide-react";
import Loader from "@/components/Loader";

export default function Home () {
    const {isAuthenticated, token} = useAuth();
    const router = useRouter();
    const [recipes, setRecipes] = useState<RecipeType[]>([]);
    const [recipeTypes, setRecipeTypes] = useState<RecipeCategory[]>([]);
    const [profile, setProfile] = useState<Profiles | null>(null);
    const [loading, setLoading] = useState(true);

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
                        getRecipesTypes(token),
                        getProfiles(token),
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
    }, [isAuthenticated, router, token]);

    if (loading) {
        return <Loader />;
    }

    if (!isAuthenticated) {
        return null;
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
                            <Card
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

