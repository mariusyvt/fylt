"use client";

import { Pencil, Trash2, X, AlertTriangle } from "lucide-react";
import { useState } from "react";

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
    const [showConfirm, setShowConfirm] = useState(false);

    if (!isOpen) return null;

    const handleDeleteClick = () => {
        setShowConfirm(true);
    };

    const onConfirmDelete = () => {
        setShowConfirm(false);
        onClose();
        onDelete();
    };

    return (
        <>
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

                        <button className="options-item options-item--delete" onClick={handleDeleteClick}>
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

            {showConfirm && (
                <div className="confirm-overlay" onClick={() => setShowConfirm(false)}>
                    <div className="confirm-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="confirm-icon">
                            <AlertTriangle />
                        </div>
                        <h2 className="confirm-title">Supprimer la recette</h2>
                        <p className="confirm-text">
                            Cette action est irréversible. La recette et toutes ses données seront définitivement supprimées.
                        </p>
                        <div className="confirm-actions">
                            <button className="btn-cancel" onClick={() => setShowConfirm(false)}>
                                Annuler
                            </button>
                            <button className="btn-confirm-delete" onClick={onConfirmDelete}>
                                Supprimer
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
