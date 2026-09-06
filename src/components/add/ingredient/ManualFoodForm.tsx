"use client";

import { useState } from "react";
import TextInput from "@/components/ui/TextInput";
import { Nutrients } from "@/types/nutrition.types";
import { createFood, foodToNutrients } from "@/api/services/foods.service";
import { useAuth } from "@/hooks/useAuth";

interface ManualFoodFormProps {
    onSelectFood: (nutrients: Nutrients) => void;
    onBack: () => void;
}

const EMPTY_MANUAL = { name: "", calories: "", proteins: "", carbs: "", lipids: "" };

export default function ManualFoodForm({ onSelectFood, onBack }: ManualFoodFormProps) {
    const { isAuthenticated } = useAuth();
    const [manual, setManual] = useState(EMPTY_MANUAL);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const applyManual = async () => {
        if (!isAuthenticated || !manual.name.trim() || manual.calories === "" || Number(manual.calories) < 0) return;
        setSaving(true);
        setError(null);
        try {
            const created = await createFood({
                name: manual.name.trim(),
                calories_100g: Number(manual.calories),
                proteins_100g: Number(manual.proteins) || 0,
                carbs_100g: Number(manual.carbs) || 0,
                lipids_100g: Number(manual.lipids) || 0,
            });
            onSelectFood(foodToNutrients(created));
            setManual(EMPTY_MANUAL);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Impossible d'enregistrer l'aliment");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="ingredient-form">
            <TextInput
                label="Nom de l'aliment"
                value={manual.name}
                onChange={(v) => setManual((m) => ({ ...m, name: v }))}
                placeholder="Ex: Banane crue"
            />
            <p className="food-hint">Valeurs pour 100 g</p>
            <div className="manual-grid">
                <TextInput
                    label="Calories"
                    value={manual.calories}
                    onChange={(v) => setManual((m) => ({ ...m, calories: v }))}
                    placeholder="kcal"
                    type="number"
                />
                <TextInput
                    label="Protéines"
                    value={manual.proteins}
                    onChange={(v) => setManual((m) => ({ ...m, proteins: v }))}
                    placeholder="g"
                    type="number"
                />
                <TextInput
                    label="Glucides"
                    value={manual.carbs}
                    onChange={(v) => setManual((m) => ({ ...m, carbs: v }))}
                    placeholder="g"
                    type="number"
                />
                <TextInput
                    label="Lipides"
                    value={manual.lipids}
                    onChange={(v) => setManual((m) => ({ ...m, lipids: v }))}
                    placeholder="g"
                    type="number"
                />
            </div>
            {error && <p className="food-error">{error}</p>}
            <button type="button" className="btn-add-item" onClick={applyManual} disabled={saving}>
                {saving ? "Enregistrement…" : "Enregistrer cet aliment"}
            </button>
            <button type="button" className="link-btn" onClick={onBack}>
                ← Retour à la recherche
            </button>
        </div>
    );
}
