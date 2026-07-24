import { Recipe } from "@/types/recipes.types";
import { Clock, Users, Bookmark, ChevronRight } from "lucide-react";
import Link from "next/link";

type CardProps = {
    recipe: Recipe;
    recipeTypes: string;
}

export default function Card({ recipe, recipeTypes }: CardProps) {
    return (
        <Link href={`/recipes/${recipe.id}`} className={"card"}>
            <img
                className="card__thumbnail"
                src={recipe.photo_url}
                alt={recipe.name}
            />
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
                        <Bookmark size={14} /> {recipeTypes}
                    </span>
                </div>
            </div>
            <ChevronRight className="card__arrow" size={20} />
        </Link>
    );
}
