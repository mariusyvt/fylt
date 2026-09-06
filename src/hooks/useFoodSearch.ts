"use client";

import { useEffect, useState } from "react";
import { Food } from "@/types/foods.types";
import { searchFoods, deleteFood } from "@/api/services/foods.service";
import { useAuth } from "@/hooks/useAuth";

/** Recherche d'aliments avec debounce (350 ms) et suppression optimiste. */
export const useFoodSearch = (enabled: boolean) => {
    const { isAuthenticated } = useAuth();
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<Food[]>([]);
    const [searching, setSearching] = useState(false);

    useEffect(() => {
        if (!enabled || !isAuthenticated) {
            setResults([]);
            setSearching(false);
            return;
        }
        const q = query.trim();
        if (q.length < 2) {
            setResults([]);
            setSearching(false);
            return;
        }
        setSearching(true);
        const timer = setTimeout(async () => {
            try {
                setResults(await searchFoods(q));
            } catch {
                setResults([]);
            } finally {
                setSearching(false);
            }
        }, 350);
        return () => clearTimeout(timer);
    }, [query, enabled, isAuthenticated]);

    const removeResult = async (id: number) => {
        if (!isAuthenticated) return;
        setResults((prev) => prev.filter((f) => f.id !== id));
        try {
            await deleteFood(id);
        } catch {
            // ignore : l'item est déjà retiré localement
        }
    };

    return { query, setQuery, results, searching, removeResult };
};
