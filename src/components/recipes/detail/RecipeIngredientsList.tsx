import { Recipe } from "@/types/recipes.types";
import { useCheckedSteps } from "@/hooks/useCheckedSteps";

interface RecipeIngredientsListProps {
    recipes: Recipe;
}

export default function RecipeIngredientsList({ recipes }: RecipeIngredientsListProps) {
    const { checkedSteps, toggleStep } = useCheckedSteps();

    return (
        <div>
            <div className="ingredients-card">
                {recipes.recipe_ingredients.map((item, i) => (
                    <div key={i} className="ingredient-item">
                        <input
                            type="checkbox"
                            className="step-checkbox"
                            checked={checkedSteps.includes(i)}
                            onChange={() => toggleStep(i)}
                        />
                        <span className={`ingredient-name ${checkedSteps.includes(i) ? "step-done" : ""}`}>
                            {item.ingredient_name}
                        </span>
                        <span className="ingredient-quantity">
                            {item.quantity}{item.unit}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    )
}