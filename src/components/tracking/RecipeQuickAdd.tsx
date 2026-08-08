"use client";

import { useMemo, useState } from "react";
import { Search, Plus, Check } from "lucide-react";
import { Recipe, RecipeCategory } from "@/types/recipes.types";
import { MealSlot, NewFoodEntry } from "@/types/tracking.types";

interface RecipeQuickAddProps {
    slot: MealSlot;
    recipes: Recipe[];
    recipeTypes: RecipeCategory[];
    onAdd: (slot: MealSlot, item: Omit<NewFoodEntry, "date" | "meal_slot">) => Promise<void>;
}

const SLOT_CATEGORY: Record<MealSlot, string> = {
    breakfast: "Petit-déjeuner",
    lunch: "Déjeuner",
    snack: "Collation",
    dinner: "Dîner",
};

const normalize = (s: string) =>
    s
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim()
        .toLowerCase();

const perPortionCalories = (recipe: Recipe) => {
    const portions = recipe.servings > 0 ? recipe.servings : 1;
    return Math.round(Number(recipe.total_calories) / portions);
};

export default function RecipeQuickAdd({ slot, recipes, recipeTypes, onAdd }: RecipeQuickAddProps) {
    const [query, setQuery] = useState("");
    const [addingId, setAddingId] = useState<number | null>(null);
    const [addedId, setAddedId] = useState<number | null>(null);

    const slotRecipes = useMemo(() => {
        const target = normalize(SLOT_CATEGORY[slot]);
        const typeIds = recipeTypes
            .filter((t) => normalize(t.name) === target)
            .map((t) => t.id);
        return recipes.filter(
            (r) =>
                typeIds.includes(r.recipe_type_id) ||
                normalize(r.recipe_types?.name ?? "") === target
        );
    }, [slot, recipes, recipeTypes]);

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return slotRecipes;
        return slotRecipes.filter((r) => r.name.toLowerCase().includes(q));
    }, [query, slotRecipes]);

    const handleAdd = async (recipe: Recipe) => {
        if (addingId !== null) return;
        setAddingId(recipe.id);
        const portions = recipe.servings > 0 ? recipe.servings : 1;
        try {
            await onAdd(slot, {
                name: recipe.name,
                calories: Math.round(Number(recipe.total_calories) / portions),
                proteins: Math.round(Number(recipe.total_proteins) / portions),
                carbs: Math.round(Number(recipe.total_carbs) / portions),
                lipids: Math.round(Number(recipe.total_lipids) / portions),
            });
            setAddedId(recipe.id);
            setTimeout(() => setAddedId(null), 1500);
        } finally {
            setAddingId(null);
        }
    };

    if (slotRecipes.length === 0) {
        return (
            <div className="recipe-picker recipe-picker--empty">
                <p>Aucune recette « {SLOT_CATEGORY[slot]} ».</p>
            </div>
        );
    }

    return (
        <div className="recipe-picker">
            <div className="recipe-picker__search">
                <Search size={16} />
                <input
                    type="text"
                    placeholder="Rechercher une recette…"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
            </div>

            <ul className="recipe-picker__list no-scrollbar">
                {filtered.length === 0 ? (
                    <li className="recipe-picker__none">Aucun résultat</li>
                ) : (
                    filtered.map((recipe) => {
                        const added = addedId === recipe.id;
                        const adding = addingId === recipe.id;
                        return (
                            <li key={recipe.id}>
                                <button
                                    className="recipe-picker__item"
                                    onClick={() => handleAdd(recipe)}
                                    disabled={addingId !== null}
                                >
                                    <span className="recipe-picker__info">
                                        <span className="recipe-picker__name">{recipe.name}</span>
                                        <span className="recipe-picker__cal">
                                            ≈ {perPortionCalories(recipe)} kcal / portion
                                        </span>
                                    </span>
                                    <span className={`recipe-picker__add ${added ? "added" : ""}`}>
                                        {added ? <Check size={16} /> : <Plus size={16} />}
                                    </span>
                                    {adding && <span className="recipe-picker__adding" />}
                                </button>
                            </li>
                        );
                    })
                )}
            </ul>
        </div>
    );
}
