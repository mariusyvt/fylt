import { Bookmark, Clock, Users } from "lucide-react";
import { Recipe } from "@/types/recipes.types";

interface RecipeHeroProps {
    recipe: Recipe;
}

export default function RecipeHero({ recipe }: RecipeHeroProps) {
    return (
        <>
            <section className="title-container">
                <h1 className="recipe-main-title">{recipe.name}</h1>
                <div className="title-underline"></div>
            </section>

            <section className="hero-section">
                <div className="image-box">
                    <div className="image-glow"></div>
                    <img src={recipe.photo_url} alt={recipe.name} />
                </div>

                <div className="hero-stats">
                    <div className="meta-row">
                        <div className="meta-item">
                            <Clock />
                            <span>{recipe.preparation_time_minutes}min</span>
                        </div>
                        <div className="meta-item">
                            <Users />
                            <span>{recipe.servings} portions</span>
                        </div>
                        <div className="meta-item">
                            <Bookmark />
                            <span>{recipe.recipe_types.name}</span>
                        </div>
                    </div>

                    <div className="nutrition-card">
                        <div className="nutri-item">
                            <strong>{recipe.total_calories}</strong>
                            <span>Kcal</span>
                        </div>
                        <div className="nutri-divider"></div>
                        <div className="nutri-item">
                            <strong>{recipe.total_proteins}g</strong>
                            <span>Prot</span>
                        </div>
                        <div className="nutri-divider"></div>
                        <div className="nutri-item">
                            <strong>{recipe.total_carbs}g</strong>
                            <span>Gluc</span>
                        </div>
                        <div className="nutri-divider"></div>
                        <div className="nutri-item">
                            <strong>{recipe.total_lipids}g</strong>
                            <span>Lip</span>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
