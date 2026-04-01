"use client";

interface IngredientFormProps {
    ingredientName: string;
    setIngredientName: (name: string) => void;
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
    setIngredientName,
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
            <div className="input-group">
                <label className="field-label">Quantité</label>
                <input
                    type="text"
                    className="text-input"
                    placeholder="Ex: 200g"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                />
            </div>

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

