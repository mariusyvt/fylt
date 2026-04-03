"use client";

import { PlusCircle } from "lucide-react";

interface FileButtonProps {
    value: File | null;
    onChange: (file: File | null) => void;
    placeholder?: string;
}

export default function FileButton({
    value,
    onChange,
    placeholder = "Ajouter une photo",
}: FileButtonProps) {
    return (
        <label className="btn-dark">
            <input
                type="file"
                name="fichier"
                accept="image/*"
                onChange={(e) => onChange(e.target.files?.[0] || null)}
                style={{ display: "none" }}
            />
            <span>{value ? value.name : placeholder}</span>
            <PlusCircle size={20} />
        </label>
    );
}

