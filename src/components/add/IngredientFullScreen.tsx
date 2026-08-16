"use client";

import { X, Check } from "lucide-react";
import IngredientForm from "@/components/add/IngredientForm";
import { Nutrients } from "@/types/nutrition.types";
import type { DetectedBarcode } from "react-barcode-scanner";

interface IngredientFullScreenProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    ingredientName: string;
    nutrients: Nutrients | null;
    quantity: string;
    isEdit?: boolean;
    setQuantity: (qty: string) => void;
    scanning: boolean;
    isLoading: boolean;
    error: string | null;
    onCapture: (barcodes: DetectedBarcode[]) => void;
    onCameraError: (error: Error) => void;
    onStartScanner: () => void;
    onStopScanner: () => void;
    onSelectFood: (nutrients: Nutrients) => void;
    onClearFood: () => void;
}

export default function IngredientFullScreen({
    open,
    onClose,
    onConfirm,
    nutrients,
    quantity,
    isEdit,
    ...formProps
}: IngredientFullScreenProps) {
    if (!open) return null;

    const canConfirm = nutrients !== null && Number(quantity) > 0;

    return (
        <div className="ingredient-fullscreen">
            <header className="sticky-header">
                <button className="icon-btn-circle" onClick={onClose} aria-label="Fermer">
                    <X size={20} />
                </button>
                <span className="header-subtitle">{isEdit ? "Modifier l'aliment" : "Ajouter un aliment"}</span>
                <button
                    className="icon-btn-circle icon-btn-circle--confirm"
                    onClick={onConfirm}
                    disabled={!canConfirm}
                    aria-label="Valider"
                >
                    <Check size={20} />
                </button>
            </header>

            <div className="ingredient-fullscreen__body">
                <IngredientForm
                    nutrients={nutrients}
                    quantity={quantity}
                    {...formProps}
                />
            </div>
        </div>
    );
}
