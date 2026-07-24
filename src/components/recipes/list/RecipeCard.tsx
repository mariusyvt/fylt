import { Recipe } from "@/types/recipes.types";
import { Users, Clock, Bookmark } from "lucide-react";
import Link from "next/link";

interface RecipeItemProps {
    recipe: Recipe;
    recipeType: string;
}

export function RecipeCard ({recipe, recipeType}: RecipeItemProps) {
    return (
        <>
            <Link href={`/recipes/${recipe.id}`} className="recipe-card">
                <article>
                    <div className="card-media">
                        <img src={recipe.photo_url} alt={recipe.name} />
                    </div>
                    <div className="card-body">
                        <h3>{recipe.name}</h3>
                        <div className="meta-list">
                            <div className="meta-item">
                                <Users /> {recipe.servings} portions
                            </div>
                            <div className="meta-item">
                                <Clock /> {recipe.preparation_time_minutes} min
                            </div>
                            <div className="meta-item category">
                                <Bookmark /> {recipeType}
                            </div>
                        </div>
                    </div>
                </article>
            </Link>
        </>
    )
}