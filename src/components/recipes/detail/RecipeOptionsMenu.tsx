"use client";

import { Pencil, Trash2, X } from "lucide-react";

interface RecipeOptionsMenuProps {
    isOpen: boolean;
    onClose: () => void;
    onEdit: () => void;
    onDelete: () => void;
}

export default function RecipeOptionsMenu({
    isOpen,
    onClose,
    onEdit,
    onDelete,
}: RecipeOptionsMenuProps) {
    if (!isOpen) return null;

    return (
        <div className="options-overlay" onClick={onClose}>
            <div className="options-sheet" onClick={(e) => e.stopPropagation()}>
                <div className="options-handle" />

                <div className="options-list">
                    <button className="options-item options-item--edit" onClick={onEdit}>
                        <div className="options-item__icon">
                            <Pencil size={18} />
                        </div>
                        <span>Modifier la recette</span>
                    </button>

                    <div className="options-divider" />

                    <button className="options-item options-item--delete" onClick={onDelete}>
                        <div className="options-item__icon">
                            <Trash2 size={18} />
                        </div>
                        <span>Supprimer la recette</span>
                    </button>
                </div>

                <button className="options-cancel" onClick={onClose}>
                    <X size={16} />
                    Annuler
                </button>
            </div>
        </div>
    );
}
