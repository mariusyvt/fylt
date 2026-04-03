"use client";

import React from "react";

interface PickerButtonProps {
    label?: string;
    value: string;
    onClick: () => void;
    icon?: React.ReactNode;
    error?: string;
}

export default function PickerButton({
    label,
    value,
    onClick,
    icon,
    error,
}: PickerButtonProps) {
    return (
        <div>
            {label && <label className="field-label">{label}</label>}
            <button type="button" className="select-input" onClick={onClick}>
                <span>{value}</span>
                {icon}
            </button>
            {error && <p className="error-message">{error}</p>}
        </div>
    );
}

