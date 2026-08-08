"use client";

import { useEffect, useState } from "react";
import { Search, ScanBarcode, Trash2 } from "lucide-react";
import TextInput from "@/components/ui/TextInput";
import { Nutrients } from "@/types/nutrition.types";
import { Food } from "@/types/foods.types";
import { searchFoods, createFood, deleteFood, foodToNutrients } from "@/api/services/foods.service";
import { calculateProportionalNutrients } from "@/utils/nutrition.utils";
import { useAuth } from "@/hooks/useAuth";

interface IngredientFormProps {
    ingredientName: string;
    nutrients: Nutrients | null;
    quantity: string;
    setQuantity: (qty: string) => void;
    scanning: boolean;
    isLoading: boolean;
    error: string | null;
    onStartScanner: () => void;
    onStopScanner: () => void;
    onSelectFood: (nutrients: Nutrients) => void;
    onClearFood: () => void;
}

const EMPTY_MANUAL = { name: "", calories: "", proteins: "", carbs: "", lipids: "" };

export default function IngredientForm({
    ingredientName,
    nutrients,
    quantity,
    setQuantity,
    scanning,
    isLoading,
    error,
    onStartScanner,
    onStopScanner,
    onSelectFood,
    onClearFood,
}: IngredientFormProps) {
    const { token } = useAuth();
    const [mode, setMode] = useState<"search" | "manual">("search");
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<Food[]>([]);
    const [searching, setSearching] = useState(false);
    const [manual, setManual] = useState(EMPTY_MANUAL);
    const [manualSaving, setManualSaving] = useState(false);
    const [manualError, setManualError] = useState<string | null>(null);

    useEffect(() => {
        if (nutrients || mode !== "search" || !token) return;
        const q = query.trim();
        if (q.length < 2) {
            setResults([]);
            setSearching(false);
            return;
        }
        setSearching(true);
        const timer = setTimeout(async () => {
            try {
                const found = await searchFoods(token, q);
                setResults(found);
            } catch {
                setResults([]);
            } finally {
                setSearching(false);
            }
        }, 350);
        return () => clearTimeout(timer);
    }, [query, mode, nutrients, token]);

    const preview =
        nutrients && Number(quantity) > 0
            ? calculateProportionalNutrients(nutrients, Number(quantity))
            : null;

    const handleDelete = async (id: number) => {
        if (!token) return;
        setResults((prev) => prev.filter((f) => f.id !== id));
        try {
            await deleteFood(token, id);
        } catch {
            // ignore : l'item est déjà retiré localement
        }
    };

    const applyManual = async () => {
        if (!token || !manual.name.trim() || Number(manual.calories) < 0 || manual.calories === "") return;
        setManualSaving(true);
        setManualError(null);
        try {
            const created = await createFood(token, {
                name: manual.name.trim(),
                calories_100g: Number(manual.calories),
                proteins_100g: Number(manual.proteins) || 0,
                carbs_100g: Number(manual.carbs) || 0,
                lipids_100g: Number(manual.lipids) || 0,
            });
            onSelectFood(foodToNutrients(created));
            setManual(EMPTY_MANUAL);
            setMode("search");
        } catch (err) {
            setManualError(err instanceof Error ? err.message : "Impossible d'enregistrer l'aliment");
        } finally {
            setManualSaving(false);
        }
    };

    const handleClear = () => {
        onClearFood();
        setQuery("");
        setResults([]);
    };

    // -- Aliment sélectionné : quantité + aperçu --
    if (nutrients) {
        return (
            <div className="ingredient-form">
                <div className="food-selected">
                    <div className="food-selected__info">
                        <span className="food-selected__name">{ingredientName}</span>
                        <span className="food-selected__kcal">
                            {Math.round(nutrients.calories)} kcal / 100 g
                        </span>
                    </div>
                    <button type="button" className="food-selected__change" onClick={handleClear}>
                        Changer
                    </button>
                </div>

                <TextInput
                    label="Quantité (g)"
                    value={quantity}
                    onChange={setQuantity}
                    placeholder="Ex: 200"
                    type="number"
                />

                {preview && (
                    <div className="food-preview">
                        <span className="food-preview__cal">{preview.calories} kcal</span>
                        <span>P {preview.proteins} g</span>
                        <span>G {preview.carbs} g</span>
                        <span>L {preview.lipids} g</span>
                    </div>
                )}
            </div>
        );
    }

    // -- Saisie manuelle --
    if (mode === "manual") {
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
                {manualError && <p className="food-error">{manualError}</p>}
                <button
                    type="button"
                    className="btn-add-item"
                    onClick={applyManual}
                    disabled={manualSaving}
                >
                    {manualSaving ? "Enregistrement…" : "Enregistrer cet aliment"}
                </button>
                <button type="button" className="link-btn" onClick={() => setMode("search")}>
                    ← Retour à la recherche
                </button>
            </div>
        );
    }

    // -- Recherche par nom + scan --
    return (
        <div className="ingredient-form">
            <div className="food-search">
                <Search className="food-search__icon" size={18} />
                <input
                    className="food-search__input"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Rechercher un aliment…"
                />
                <button
                    type="button"
                    className="food-search__scan"
                    onClick={onStartScanner}
                    aria-label="Scanner un code-barres"
                >
                    <ScanBarcode size={18} />
                </button>
            </div>

            {scanning && (
                <button type="button" className="btn-scan-stop" onClick={onStopScanner}>
                    Arrêter le scan
                </button>
            )}
            <div id="reader" style={{ width: "100%", minHeight: scanning ? "220px" : "0" }}></div>

            {isLoading && <p className="food-hint">Recherche du produit…</p>}
            {error && <p className="food-error">{error}</p>}
            {searching && <p className="food-hint">Recherche…</p>}

            {results.length > 0 && (
                <div className="food-results">
                    {results.map((food) => (
                        <div className="food-result" key={food.id}>
                            <button
                                type="button"
                                className="food-result__main"
                                onClick={() => onSelectFood(foodToNutrients(food))}
                            >
                                <span className="food-result__name">{food.name}</span>
                                {food.user_id !== null && (
                                    <span className="food-result__badge">Perso</span>
                                )}
                            </button>
                            <span className="food-result__kcal">
                                {Math.round(food.calories_100g)} kcal
                            </span>
                            {food.user_id !== null && (
                                <button
                                    type="button"
                                    className="food-result__delete"
                                    onClick={() => handleDelete(food.id)}
                                    aria-label="Supprimer cet aliment"
                                >
                                    <Trash2 size={16} />
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {query.trim().length >= 2 && !searching && results.length === 0 && (
                <p className="food-hint">Aucun résultat</p>
            )}

            <button type="button" className="link-btn" onClick={() => setMode("manual")}>
                Saisir manuellement
            </button>
        </div>
    );
}
