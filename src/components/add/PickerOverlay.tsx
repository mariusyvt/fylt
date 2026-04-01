"use client";

import { Check } from "lucide-react";
import { ReactNode } from "react";

type PickerType = "time" | "persons" | "ingredient" | "step" | null;

interface PickerOverlayProps {
    activePicker: PickerType;
    onClose: () => void;
    onConfirm: () => void;
    children: ReactNode;
}

const PICKER_TITLES: Record<NonNullable<PickerType>, string> = {
    time: "Temps de préparation",
    persons: "Nombre de personnes",
    ingredient: "Nouvel ingrédient",
    step: "Nouvelle étape",
};

export default function PickerOverlay({
    activePicker,
    onClose,
    onConfirm,
    children,
}: PickerOverlayProps) {
    if (!activePicker) return null;

    return (
        <div className="picker-overlay" onClick={onClose}>
            <div className="picker-sheet" onClick={(e) => e.stopPropagation()}>
                <div className="picker-header">
                    <span>{PICKER_TITLES[activePicker]}</span>
                    <button onClick={onConfirm}>
                        <Check size={20} />
                    </button>
                </div>
                {children}
            </div>
        </div>
    );
}

