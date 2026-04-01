"use client";

import { Check } from "lucide-react";

interface ConfirmButtonProps {
    onClick: () => void;
    label?: string;
}

export default function ConfirmButton({
    onClick,
    label = "Confirmer la recette"
}: ConfirmButtonProps) {
    return (
        <div className="floating-action-container">
            <button className="btn-confirm" onClick={onClick}>
                <Check size={20} />
                <span>{label}</span>
            </button>
        </div>
    );
}

