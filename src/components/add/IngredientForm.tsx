"use client";

import TextInput from "@/components/ui/TextInput";

interface IngredientFormProps {
    ingredientName: string;
    quantity: string;
    setQuantity: (qty: string) => void;
    scanning: boolean;
    isLoading: boolean;
    error: string | null;
    onStartScanner: () => void;
    onStopScanner: () => void;
}

export default function IngredientForm({
    ingredientName,
    quantity,
    setQuantity,
    scanning,
    isLoading,
    error,
    onStartScanner,
    onStopScanner,
}: IngredientFormProps) {

    return (
        <div className="ingredient-form">
            <div className="input-group">
                <label className="field-label">Nom</label>
                {ingredientName
                    ? <span className="ingredient-badge">{ingredientName}</span>
                    : <span className="ingredient-placeholder">Scanner un ingrédient</span>
                }
            </div>

            <TextInput
                label="Quantité"
                value={quantity}
                onChange={setQuantity}
                placeholder="Ex: 200g"
            />

            {isLoading && <p>Chargement des infos...</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}

            {!scanning ? (
                <button type="button" className="btn-add-item" onClick={onStartScanner}>
                    Scanner un code-barres
                </button>
            ) : (
                <button type="button" className="btn-add-item" onClick={onStopScanner}>
                    Arrêter le scan
                </button>
            )}

            <div id="reader" style={{ width: "100%", minHeight: scanning ? "250px" : "0" }}></div>
        </div>
    );
}
