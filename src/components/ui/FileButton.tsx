"use client";

import { PlusCircle } from "lucide-react";
import { useState } from "react";

interface FileButtonProps {
    value: File | null;
    onChange: (file: File | null) => void;
    placeholder?: string;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 Mo

export default function FileButton({
    value,
    onChange,
    placeholder = "Ajouter une photo",
}: FileButtonProps) {
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setError(null);
        const file = e.target.files?.[0] || null;

        if (!file) {
            onChange(null);
            return;
        }

        if (!file.type.startsWith("image/")) {
            setError("Le fichier doit être une image.");
            e.target.value = "";
            onChange(null);
            return;
        }

        if (file.size > MAX_FILE_SIZE) {
            setError("L'image ne doit pas dépasser 5 Mo.");
            e.target.value = "";
            onChange(null);
            return;
        }

        onChange(file);
    };

    return (
        <div className="file-button-wrapper">
            <label className="btn-dark">
                <input
                    type="file"
                    name="fichier"
                    accept="image/*"
                    onChange={handleChange}
                    style={{ display: "none" }}
                />
                <span>{value ? value.name : placeholder}</span>
                <PlusCircle size={20} />
            </label>
            {error && <p className="error-message">{error}</p>}
        </div>
    );
}

