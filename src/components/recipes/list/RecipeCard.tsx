import { Recipe } from "@/types/recipes.types";
import { Clock, Users, Bookmark, ChevronRight, ImageIcon } from "lucide-react";
import Link from "next/link";

interface RecipeItemProps {
    recipe: Recipe;
    recipeType: string;
}

export function RecipeCard({ recipe, recipeType }: RecipeItemProps) {
    return (
        <Link href={`/recipes/${recipe.id}`} className="card">
            {recipe.photo_url ? (
                <img
                    className="card__thumbnail"
                    src={recipe.photo_url}
                    alt={recipe.name}
                />
            ) : (
                <div className="card__thumbnail card__thumbnail--placeholder">
                    <ImageIcon size={28} />
                </div>
            )}
            <div className="card__info">
                <div className="card__header">
                    <h3 className="card__title">{recipe.name}</h3>
                    <span className="card__calories">{recipe.total_calories} kcal</span>
                </div>
                <div className="card__details">
                    <span className="card__detail">
                        <Clock size={14} /> {recipe.preparation_time_minutes} min
                    </span>
                    <span className="card__detail">
                        <Users size={14} /> {recipe.servings} pers.
                    </span>
                    <span className="card__detail card__detail--full">
                        <Bookmark size={14} /> {recipeType}
                    </span>
                </div>
            </div>
            <ChevronRight className="card__arrow" size={20} />
        </Link>
    );
}
