"use client";

import { Check, X } from "lucide-react";

interface HeaderAddRecipeProps {
    onClose: () => void;
    isEditMode?: boolean;
    onAdd?: () => void;
    disabled?: boolean;
}

export default function HeaderAddRecipe({
    onClose,
    onAdd,
    isEditMode = false,
    disabled = false,
}: HeaderAddRecipeProps) {
    return (
        <header className="sticky-header">
            <button className="icon-btn-circle" onClick={onClose}>
                <X size={20} />
            </button>
            {isEditMode ?
                <>
                    <span className="header-subtitle">Modifier la recette</span>
                    <button className="icon-btn-circle" onClick={onAdd} disabled={disabled}>
                        <Check size={20} />
                    </button>

                </> :
                <>
                    <span className="header-subtitle">Nouvelle Recette</span>
                </>}


        </header>
    );
}

