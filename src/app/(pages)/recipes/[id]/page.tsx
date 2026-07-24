"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import StepsSection from "@/components/add/StepsSection";
import RecipeDetailHeader from "@/components/recipes/detail/RecipeDetailHeader";
import RecipeHero from "@/components/recipes/detail/RecipeHero";
import Loader from "@/components/Loader";
import RecipeIngredientsList from "@/components/recipes/detail/RecipeIngredientsList";
import { useRecipe } from "@/hooks/useRecipe";

export default function RecipeId () {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('preparation');

    const {recipes, loading, id, removeRecipe, error } = useRecipe()

    if (loading) return <Loader />;
    if (error) return <p className="error-message">{error}</p>;
    if (!recipes) return <p>Recette non trouvée</p>;

    return (
        <>
            <div className="bg-gradient-decor"></div>
            <div className="mobile-wrapper">
                <RecipeDetailHeader
                    onBack={() => router.push("/recipes")}
                    onEdit={() => router.push(`/recipes/${id}/edit`)}
                    onDelete={removeRecipe}
                />
                <main className="main-content">
                    <RecipeHero recipe={recipes} />
                    <div className="tab-switcher">
                        <button
                            className={activeTab === 'preparation' ? "tab-btn active" : "tab-btn"}
                            onClick={() => setActiveTab('preparation')}>
                            Préparation
                        </button>
                        <button
                            className={activeTab === 'ingredients' ? "tab-btn active" : "tab-btn"}
                            onClick={() => setActiveTab('ingredients')}>
                            Ingrédients
                        </button>
                    </div>
                    {activeTab === 'preparation' ? (
                        <div className="add-recipe-page">
                            <StepsSection
                                steps={recipes.preparation_steps}
                                onRemove={() => {}}
                                onAdd={() => {}}
                                readOnly={true}
                            />
                        </div>
                    ) : (
                        <div>
                            <RecipeIngredientsList recipes={recipes} />
                        </div>
                    )}
                </main>
            </div>
        </>
    )
        ;
}
