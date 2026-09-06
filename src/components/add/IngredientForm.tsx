"use client";

import { useState } from "react";
import { Nutrients } from "@/types/nutrition.types";
import { useBarcodeScanner } from "@/hooks/useBarcodeScanner";
import SelectedFood from "@/components/add/ingredient/SelectedFood";
import ManualFoodForm from "@/components/add/ingredient/ManualFoodForm";
import FoodSearchPanel from "@/components/add/ingredient/FoodSearchPanel";

interface IngredientFormProps {
    ingredientName: string;
    nutrients: Nutrients | null;
    quantity: string;
    setQuantity: (qty: string) => void;
    onSelectFood: (nutrients: Nutrients) => void;
    onClearFood: () => void;
}

/**
 * Orchestrateur : bascule entre l'aliment sélectionné, la saisie manuelle et
 * la recherche/scan. Le scanner (react-barcode-scanner) est encapsulé ici et
 * chargé à la demande via FoodSearchPanel.
 */
export default function IngredientForm({
    ingredientName,
    nutrients,
    quantity,
    setQuantity,
    onSelectFood,
    onClearFood,
}: IngredientFormProps) {
    const [mode, setMode] = useState<"search" | "manual">("search");
    const scanner = useBarcodeScanner(onSelectFood);

    if (nutrients) {
        return (
            <SelectedFood
                ingredientName={ingredientName}
                nutrients={nutrients}
                quantity={quantity}
                setQuantity={setQuantity}
                onClear={onClearFood}
            />
        );
    }

    if (mode === "manual") {
        return <ManualFoodForm onSelectFood={onSelectFood} onBack={() => setMode("search")} />;
    }

    return (
        <FoodSearchPanel
            onSelectFood={onSelectFood}
            onManual={() => setMode("manual")}
            scanning={scanner.scanning}
            isLoading={scanner.isLoading}
            error={scanner.error}
            onStartScanner={scanner.startScanner}
            onStopScanner={scanner.stopScanner}
            onCapture={scanner.handleCapture}
            onCameraError={scanner.handleCameraError}
        />
    );
}
