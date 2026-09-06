"use client";

import { Wheat, X, Plus } from "lucide-react";
import { RecipeIngredient } from "@/types/recipes.types";

interface IngredientsSectionProps {
    ingredients: RecipeIngredient[];
    onRemove: (index: number) => void;
    onAdd: () => void;
    onEdit?: (index: number) => void;
}

export default function IngredientsSection({
    ingredients,
    onRemove,
    onAdd,
    onEdit
}: IngredientsSectionProps) {

    return (
        <section>
            <h2 className="recipe-section-title">Ingrédients</h2>
            <div className="item-stack">
                {ingredients.map((ing, index) => (
                    <div key={index} className="ingredient-pill">
                        <button
                            type="button"
                            className={`pill-left ${onEdit ? "pill-left--clickable" : ""}`}
                            onClick={onEdit ? () => onEdit(index) : undefined}
                            disabled={!onEdit}
                        >
                            <Wheat size={16} />
                            <span className="pill-text">{ing.ingredient_name}</span>
                        </button>
                        <button className="remove-btn" onClick={() => onRemove(index)}>
                            <X size={16} />
                        </button>
                    </div>
                ))}
                <button className="btn-add-item" onClick={onAdd}>
                    <span>Ajouter un ingrédient</span>
                    <div className="plus-icon"><Plus size={16} /></div>
                </button>
            </div>
        </section>
    );
}

