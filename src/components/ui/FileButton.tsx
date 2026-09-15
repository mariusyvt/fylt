"use client";

import { Loader2, PlusCircle } from "lucide-react";
import { useState } from "react";
import { prepareImage, isAcceptedImage } from "@/utils/prepareImage";

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
    const [optimizing, setOptimizing] = useState(false);

    const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        setError(null);
        const file = e.target.files?.[0] || null;

        if (!file) {
            onChange(null);
            return;
        }

        if (!isAcceptedImage(file)) {
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

        setOptimizing(true);
        try {
            const prepared = await prepareImage(file);
            onChange(prepared);
        } catch {
            setError("Échec de l'optimisation de l'image. Réessayez.");
            onChange(null);
        } finally {
            setOptimizing(false);
            e.target.value = "";
        }
    };

    return (
        <div className="file-button-wrapper">
            <label className="btn-dark" aria-busy={optimizing}>
                <input
                    type="file"
                    name="fichier"
                    accept="image/*"
                    onChange={handleChange}
                    disabled={optimizing}
                    style={{ display: "none" }}
                />
                <span>{optimizing ? "Optimisation…" : value ? value.name : placeholder}</span>
                {optimizing ? (
                    <Loader2 size={20} className="spin" />
                ) : (
                    <PlusCircle size={20} />
                )}
            </label>
            {error && <p className="error-message">{error}</p>}
        </div>
    );
}

