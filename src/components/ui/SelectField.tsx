"use client";

import { ChevronsUpDown } from "lucide-react";

interface SelectOption {
    value: string | number;
    label: string;
}

interface SelectFieldProps {
    label?: string;
    value: string;
    onChange: (value: string) => void;
    options: SelectOption[];
    placeholder?: string;
    error?: string;
}

export default function SelectField({
    label,
    value,
    onChange,
    options,
    placeholder = "Choisir",
    error,
}: SelectFieldProps) {
    return (
        <div>
            {label && <label className="field-label">{label}</label>}
            <div className="select-wrapper">
                <select
                    className="text-input select-native"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                >
                    <option value="" disabled hidden>{placeholder}</option>
                    {options.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                </select>
                <ChevronsUpDown size={16} className="select-icon" />
            </div>
            {error && <p className="error-message">{error}</p>}
        </div>
    );
}

