import { Recipe } from "@/types/recipes.types";
import { useCheckedSteps } from "@/hooks/useCheckedSteps";

interface RecipeIngredientsListProps {
    recipes: Recipe;
}

export default function RecipeIngredientsList({ recipes }: RecipeIngredientsListProps) {
    const { checkedSteps, toggleStep } = useCheckedSteps();

    return (
        <div>
            <h2 className="recipe-section-title">Ingrédients</h2>
            <div className="ingredients-card">
            {recipes.recipe_ingredients.map((item, i) => (
                <div key={i} className={`ingredient-item ${checkedSteps.includes(i) ? "ingredient-item--done" : ""}`}>
                    <input
                        type="checkbox"
                        className="step-checkbox"
                        checked={checkedSteps.includes(i)}
                        onChange={() => toggleStep(i)}
                    />
                    <div className="ingredient-item__content">
                        <span className="ingredient-item__name">
                            {item.ingredient_name}
                        </span>
                        <span className="ingredient-item__macros">
                            {Math.round(Number(item.ingredient_calories))} kcal
                        </span>
                    </div>
                    <span className="ingredient-item__quantity">
                        {item.quantity}{item.unit}
                    </span>
                </div>
            ))}
            </div>
        </div>
    );
}