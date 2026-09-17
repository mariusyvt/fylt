"use client";

import { Check } from "lucide-react";

interface ConfirmButtonProps {
    onClick: () => void;
    label?: string;
    disabled?: boolean;
}

export default function ConfirmButton({
    onClick,
    label = "Confirmer la recette",
    disabled = false,
}: ConfirmButtonProps) {
    return (
        <div className="floating-action-container">
            <button className="btn-confirm" onClick={onClick} disabled={disabled}>
                <Check size={20} />
                <span>{label}</span>
            </button>
        </div>
    );
}

