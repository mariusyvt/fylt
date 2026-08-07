"use client"

import { useState } from "react";
import { Plus, X } from "lucide-react";
import { MealSlot, NewFoodEntry } from "@/types/tracking.types";

interface MealAddFormProps {
    slot: MealSlot;
    onAdd: (slot: MealSlot, item: Omit<NewFoodEntry, "date" | "meal_slot">) => Promise<void>;
}

export default function MealAddForm({ slot, onAdd }: MealAddFormProps) {
    const [open, setOpen] = useState(false);
    const [name, setName] = useState("");
    const [calories, setCalories] = useState("");
    const [proteins, setProteins] = useState("");
    const [carbs, setCarbs] = useState("");
    const [lipids, setLipids] = useState("");
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const reset = () => {
        setName("");
        setCalories("");
        setProteins("");
        setCarbs("");
        setLipids("");
        setError(null);
    };

    const isValid = name.trim().length > 0 && Number(calories) >= 0 && calories !== "";

    const handleSubmit = async () => {
        if (!isValid) return;
        setSaving(true);
        setError(null);
        try {
            await onAdd(slot, {
                name: name.trim(),
                calories: Number(calories),
                proteins: proteins ? Number(proteins) : 0,
                carbs: carbs ? Number(carbs) : 0,
                lipids: lipids ? Number(lipids) : 0,
            });
            reset();
            setOpen(false);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Erreur lors de l'ajout");
        } finally {
            setSaving(false);
        }
    };

    if (!open) {
        return (
            <button className="meal-add-btn" onClick={() => setOpen(true)}>
                <Plus size={14} /> Ajouter
            </button>
        );
    }

    return (
        <div className="meal-add-form">
            <input
                className="meal-add-form__input"
                placeholder="Nom de l'aliment"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
            />
            <div className="meal-add-form__row">
                <input
                    className="meal-add-form__input meal-add-form__input--sm"
                    type="number"
                    inputMode="numeric"
                    placeholder="Cal"
                    value={calories}
                    onChange={(e) => setCalories(e.target.value)}
                />
                <input
                    className="meal-add-form__input meal-add-form__input--sm"
                    type="number"
                    inputMode="decimal"
                    placeholder="P (g)"
                    value={proteins}
                    onChange={(e) => setProteins(e.target.value)}
                />
                <input
                    className="meal-add-form__input meal-add-form__input--sm"
                    type="number"
                    inputMode="decimal"
                    placeholder="G (g)"
                    value={carbs}
                    onChange={(e) => setCarbs(e.target.value)}
                />
                <input
                    className="meal-add-form__input meal-add-form__input--sm"
                    type="number"
                    inputMode="decimal"
                    placeholder="L (g)"
                    value={lipids}
                    onChange={(e) => setLipids(e.target.value)}
                />
            </div>
            {error && <p className="meal-add-form__error">{error}</p>}
            <div className="meal-add-form__actions">
                <button
                    className="meal-add-form__cancel"
                    onClick={() => {
                        reset();
                        setOpen(false);
                    }}
                    disabled={saving}
                >
                    <X size={14} /> Annuler
                </button>
                <button
                    className="meal-add-form__confirm"
                    onClick={handleSubmit}
                    disabled={!isValid || saving}
                >
                    {saving ? "Ajout..." : "Ajouter"}
                </button>
            </div>
        </div>
    );
}
