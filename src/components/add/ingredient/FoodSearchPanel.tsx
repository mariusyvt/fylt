"use client";

import dynamic from "next/dynamic";
import { Search, ScanBarcode, Trash2, Clock, X } from "lucide-react";
import { Nutrients } from "@/types/nutrition.types";
import { Food } from "@/types/foods.types";
import { foodToNutrients, logFoodSelection } from "@/api/services/foods.service";
import { useFoodSearch } from "@/hooks/useFoodSearch";
import { useRecentFoods } from "@/hooks/useRecentFoods";
import type { DetectedBarcode } from "react-barcode-scanner";

const ScannerOverlay = dynamic(() => import("@/components/add/ingredient/ScannerOverlay"), {
    ssr: false,
});

interface FoodSearchPanelProps {
    onSelectFood: (nutrients: Nutrients) => void;
    onManual: () => void;
    scanning: boolean;
    isLoading: boolean;
    error: string | null;
    onStartScanner: () => void;
    onStopScanner: () => void;
    onCapture: (barcodes: DetectedBarcode[]) => void;
    onCameraError: (error: Error) => void;
}

export default function FoodSearchPanel({
    onSelectFood,
    onManual,
    scanning,
    isLoading,
    error,
    onStartScanner,
    onStopScanner,
    onCapture,
    onCameraError,
}: FoodSearchPanelProps) {
    const { query, setQuery, results, searching, removeResult } = useFoodSearch(true);
    const { recentFoods, addRecent, removeRecent } = useRecentFoods();

    const handleSelectFood = (food: Food) => {
        addRecent(food);
        onSelectFood(foodToNutrients(food));
    };

    const handleSelectSearchResult = (food: Food) => {
        logFoodSelection(query, food.id);
        handleSelectFood(food);
    };

    const showRecents = query.trim().length < 2 && results.length === 0 && recentFoods.length > 0;

    return (
        <div className="ingredient-form">
            <div className="food-search">
                <Search className="food-search__icon" size={18} />
                <input
                    className="food-search__input"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Rechercher un aliment…"
                    autoFocus
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
                <ScannerOverlay
                    onCapture={onCapture}
                    onCameraError={onCameraError}
                    onClose={onStopScanner}
                />
            )}

            {isLoading && <p className="food-hint">Recherche du produit…</p>}
            {error && <p className="food-error">{error}</p>}
            {searching && <p className="food-hint">Recherche…</p>}

            {results.length > 0 && (
                <div className="food-results">
                    {results.map((food) => (
                        <div className="food-result" key={food.id}>
                            <button
                                type="button"
                                className="food-result__select"
                                onClick={() => handleSelectSearchResult(food)}
                            >
                                <div className="food-result__left">
                                    <span className="food-result__name">{food.name}</span>
                                    {food.brand_label && (
                                        <span className="food-result__meta">
                                            <span className="food-result__brand">{food.brand_label}</span>
                                        </span>
                                    )}
                                </div>
                                <div className="food-result__right">
                                    <span className="food-result__kcal">{Math.round(food.calories_100g)}</span>
                                    <span className="food-result__unit">kcal</span>
                                </div>
                            </button>
                            {food.user_id !== null && (
                                <button
                                    type="button"
                                    className="food-result__delete"
                                    onClick={() => removeResult(food.id)}
                                    aria-label="Supprimer cet aliment"
                                >
                                    <Trash2 size={14} />
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {query.trim().length >= 2 && !searching && results.length === 0 && (
                <p className="food-hint">Aucun résultat</p>
            )}

            {showRecents && (
                <div className="food-recents">
                    <div className="food-recents__header">
                        <Clock size={14} />
                        <span>Récents</span>
                    </div>
                    <div className="food-recents__list">
                        {recentFoods.map((food) => (
                            <div className="food-recent" key={food.id}>
                                <button
                                    type="button"
                                    className="food-recent__main"
                                    onClick={() => handleSelectFood(food)}
                                >
                                    <span className="food-recent__name">{food.name}</span>
                                </button>
                                <button
                                    type="button"
                                    className="food-recent__remove"
                                    onClick={() => removeRecent(food.id)}
                                    aria-label="Retirer des récents"
                                >
                                    <X size={14} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <button type="button" className="link-btn" onClick={onManual}>
                Saisir manuellement
            </button>
        </div>
    );
}
