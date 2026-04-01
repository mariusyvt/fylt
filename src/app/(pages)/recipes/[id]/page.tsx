"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { deleteRecipe } from "@/api/services/recipes.service";
import StepsSection from "@/components/add/StepsSection";
import RecipeDetailHeader from "@/components/recipes/detail/RecipeDetailHeader";
import RecipeHero from "@/components/recipes/detail/RecipeHero";
import Loader from "@/components/Loader";
import RecipeIngredientsList from "@/components/recipes/detail/RecipeIngredientsList";
import { useRecipe } from "@/hooks/useRecipe";

export default function RecipeId () {
    const {token} = useAuth();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('ingredients');

    const {recipes,loading, id } = useRecipe()

    if (loading) return <Loader />;
    if (!recipes) return <p>Recette non trouvée</p>;

    return (
        <>
            <div className="bg-gradient-decor"></div>
            <div className="mobile-wrapper">
                <RecipeDetailHeader
                    onBack={() => router.back()}
                    onEdit={() => router.push(`/recipes/${id}/edit`)}
                    onDelete={async () => {
                        await deleteRecipe(Number(id), token!);
                        router.push("/recipes");
                    }}
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
                            <h2 className="section-title-tab">Préparation</h2>
                            <StepsSection
                                steps={recipes.preparation_steps}
                                onRemove={() => {}}
                                onAdd={() => {}}
                                readOnly={true}
                            />
                        </div>
                    ) : (
                        <div>
                            <h2 className="section-title-tab">Ingrédients</h2>
                            <RecipeIngredientsList recipes={recipes} />
                        </div>
                    )}
                </main>
            </div>
        </>
    )
        ;
}
