"use client";

import { useMemo, useState, useRef, useEffect } from "react";
import { Search, Plus, Check, X } from "lucide-react";
import { Recipe, RecipeCategory } from "@/types/recipes.types";
import { MealSlot, NewFoodEntry } from "@/types/tracking.types";

interface RecipeQuickAddProps {
    slot: MealSlot;
    recipes: Recipe[];
    recipeTypes: RecipeCategory[];
    onAdd: (slot: MealSlot, item: Omit<NewFoodEntry, "date" | "meal_slot">) => Promise<void>;
    open: boolean;
    onClose: () => void;
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

const getTotalWeight = (recipe: Recipe): number => {
    return recipe.total_weight || 0;
};

const perPortionCalories = (recipe: Recipe) => {
    const portions = recipe.servings > 0 ? recipe.servings : 1;
    return Math.round(Number(recipe.total_calories) / portions);
};

export default function RecipeQuickAdd({ slot, recipes, recipeTypes, onAdd, open, onClose }: RecipeQuickAddProps) {
    const [query, setQuery] = useState("");
    const [addingId, setAddingId] = useState<number | null>(null);
    const [addedId, setAddedId] = useState<number | null>(null);
    const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
    const [weight, setWeight] = useState("");
    const weightInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (selectedRecipe && weightInputRef.current) {
            weightInputRef.current.focus();
        }
    }, [selectedRecipe]);

    useEffect(() => {
        if (!open) {
            setQuery("");
            setSelectedRecipe(null);
            setWeight("");
        }
    }, [open]);

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

    const handleSelectRecipe = (recipe: Recipe) => {
        const totalWeight = getTotalWeight(recipe);
        const portions = recipe.servings > 0 ? recipe.servings : 1;
        const portionWeight = Math.round(totalWeight / portions);
        setSelectedRecipe(recipe);
        setWeight(portionWeight > 0 ? String(portionWeight) : "");
    };

    const handleCancelSelection = () => {
        setSelectedRecipe(null);
        setWeight("");
    };

    const handleConfirmAdd = async () => {
        if (!selectedRecipe || addingId !== null) return;
        const totalWeight = getTotalWeight(selectedRecipe);
        const eatenWeight = Number(weight);
        if (!eatenWeight || eatenWeight <= 0 || totalWeight <= 0) return;

        setAddingId(selectedRecipe.id);
        const ratio = eatenWeight / totalWeight;
        try {
            await onAdd(slot, {
                name: selectedRecipe.name,
                calories: Math.round(Number(selectedRecipe.total_calories) * ratio),
                proteins: Math.round(Number(selectedRecipe.total_proteins) * ratio),
                carbs: Math.round(Number(selectedRecipe.total_carbs) * ratio),
                lipids: Math.round(Number(selectedRecipe.total_lipids) * ratio),
            });
            setAddedId(selectedRecipe.id);
            setSelectedRecipe(null);
            setWeight("");
            setTimeout(() => {
                setAddedId(null);
                onClose();
            }, 600);
        } finally {
            setAddingId(null);
        }
    };

    if (!open) return null;

    return (
        <div className="recipe-fullscreen">
            <header className="recipe-fullscreen__header">
                <button className="recipe-fullscreen__close" onClick={onClose} aria-label="Fermer">
                    <X size={20} />
                </button>
                <span className="recipe-fullscreen__title">Ajouter — {SLOT_CATEGORY[slot]}</span>
            </header>

            <div className="recipe-fullscreen__body">
                <div className="recipe-picker__search">
                    <Search size={16} />
                    <input
                        type="text"
                        placeholder="Rechercher une recette…"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                </div>

                {selectedRecipe && (
                    <div className="recipe-picker__weight-form">
                        <div className="recipe-picker__weight-header">
                            <span className="recipe-picker__weight-name">{selectedRecipe.name}</span>
                            <button
                                type="button"
                                className="recipe-picker__weight-cancel"
                                onClick={handleCancelSelection}
                                aria-label="Annuler"
                            >
                                <X size={16} />
                            </button>
                        </div>
                        <div className="recipe-picker__weight-row">
                            <input
                                ref={weightInputRef}
                                type="number"
                                inputMode="numeric"
                                placeholder="Poids mangé"
                                value={weight}
                                onChange={(e) => setWeight(e.target.value)}
                                className="recipe-picker__weight-input"
                            />
                            <span className="recipe-picker__weight-unit">g</span>
                            <button
                                type="button"
                                className="recipe-picker__weight-confirm"
                                onClick={handleConfirmAdd}
                                disabled={!Number(weight) || Number(weight) <= 0 || addingId !== null}
                            >
                                <Check size={16} />
                            </button>
                        </div>
                        <span className="recipe-picker__weight-hint">
                            Poids total : {Math.round(getTotalWeight(selectedRecipe))} g
                            {Number(weight) > 0 && getTotalWeight(selectedRecipe) > 0 && (
                                <> — ≈ {Math.round(Number(selectedRecipe.total_calories) * Number(weight) / getTotalWeight(selectedRecipe))} kcal</>
                            )}
                        </span>
                    </div>
                )}

                {slotRecipes.length === 0 ? (
                    <p className="recipe-picker__none">Aucune recette « {SLOT_CATEGORY[slot]} »</p>
                ) : (
                    <ul className="recipe-picker__list recipe-picker__list--fullscreen no-scrollbar">
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
                                            onClick={() => handleSelectRecipe(recipe)}
                                            disabled={addingId !== null || selectedRecipe?.id === recipe.id}
                                        >
                                            <span className="recipe-picker__info">
                                                <span className="recipe-picker__name">{recipe.name}</span>
                                                <span className="recipe-picker__cal">
                                                    ≈ {perPortionCalories(recipe)} kcal / portion · {Math.round(getTotalWeight(recipe))} g total
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
                )}
            </div>
        </div>
    );
}
