"use client";

import { ArrowLeft, MoreHorizontal } from "lucide-react";
import { useState } from "react";
import RecipeOptionsMenu from "@/components/recipes/detail/RecipeOptionsMenu";

interface RecipeDetailHeaderProps {
    onBack: () => void;
    onEdit: () => void;
    onDelete: () => void;
}

export default function RecipeDetailHeader({ onBack, onEdit, onDelete }: RecipeDetailHeaderProps) {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <>
            <header className="main-header">
                <button className="icon-btn-ghost" onClick={onBack}>
                    <ArrowLeft />
                </button>
                <button className="icon-btn-ghost" onClick={() => setMenuOpen(true)}>
                    <MoreHorizontal />
                </button>
            </header>

            <RecipeOptionsMenu
                isOpen={menuOpen}
                onClose={() => setMenuOpen(false)}
                onEdit={() => {
                    setMenuOpen(false);
                    onEdit();
                }}
                onDelete={() => {
                    setMenuOpen(false);
                    onDelete();
                }}
            />
        </>
    );
}
