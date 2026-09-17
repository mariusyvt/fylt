"use client";

import { Loader2, PlusCircle, X } from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import { isAcceptedImage } from "@/utils/prepareImage";

interface FileButtonProps {
    fileName?: string | null;
    previewUrl?: string | null;
    uploading?: boolean;
    uploadError?: string | null;
    onSelect: (file: File | null) => void;
    onClear?: () => void;
    placeholder?: string;
}

const MAX_FILE_SIZE = 15 * 1024 * 1024; // 15 Mo

export default function FileButton({
    fileName,
    previewUrl,
    uploading = false,
    uploadError,
    onSelect,
    onClear,
    placeholder = "Ajouter une photo",
}: FileButtonProps) {
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setError(null);
        const file = e.target.files?.[0] || null;
        e.target.value = "";

        if (!file) return;

        if (!isAcceptedImage(file)) {
            setError("Le fichier doit être une image.");
            return;
        }

        if (file.size > MAX_FILE_SIZE) {
            setError("L'image ne doit pas dépasser 15 Mo.");
            return;
        }

        onSelect(file);
    };

    const handleClear = () => {
        setError(null);
        onClear?.();
    };

    const hasPreview = Boolean(previewUrl);
    const displayName = uploading ? "Envoi de l'image…" : fileName || placeholder;

    return (
        <div className="file-button-wrapper">
            <label className="btn-dark" aria-busy={uploading}>
                <input
                    type="file"
                    name="fichier"
                    accept="image/*"
                    onChange={handleChange}
                    disabled={uploading}
                    style={{ display: "none" }}
                />
                {hasPreview && (
                    <span className="file-button-preview">
                        <Image
                            src={previewUrl as string}
                            alt="Aperçu"
                            fill
                            sizes="40px"
                            unoptimized
                        />
                    </span>
                )}
                <span className="file-button-label">{displayName}</span>
                {uploading ? (
                    <Loader2 size={20} className="spin" />
                ) : (
                    <PlusCircle size={20} />
                )}
            </label>

            {hasPreview && !uploading && onClear && (
                <button
                    type="button"
                    className="file-button-clear"
                    onClick={handleClear}
                    aria-label="Retirer la photo"
                >
                    <X size={16} />
                    <span>Retirer la photo</span>
                </button>
            )}

            {error && <p className="error-message">{error}</p>}
            {uploadError && <p className="error-message">{uploadError}</p>}
        </div>
    );
}
