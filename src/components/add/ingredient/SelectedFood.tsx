"use client";

import TextInput from "@/components/ui/TextInput";
import { Nutrients } from "@/types/nutrition.types";
import { calculateProportionalNutrients } from "@/utils/nutrition.utils";

interface SelectedFoodProps {
    ingredientName: string;
    nutrients: Nutrients;
    quantity: string;
    setQuantity: (qty: string) => void;
    onClear: () => void;
}

export default function SelectedFood({
    ingredientName,
    nutrients,
    quantity,
    setQuantity,
    onClear,
}: SelectedFoodProps) {
    const preview =
        Number(quantity) > 0 ? calculateProportionalNutrients(nutrients, Number(quantity)) : null;

    return (
        <div className="ingredient-form">
            <div className="food-selected">
                <div className="food-selected__info">
                    <span className="food-selected__name">{ingredientName}</span>
                    <span className="food-selected__kcal">
                        {Math.round(nutrients.calories)} kcal / 100 g
                    </span>
                </div>
                <button type="button" className="food-selected__change" onClick={onClear}>
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
