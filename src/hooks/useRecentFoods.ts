"use client";

import { useState, useEffect, useCallback } from "react";
import { Food } from "@/types/foods.types";

const STORAGE_KEY = "fylt_recent_foods";
const MAX_RECENT = 10;

export const useRecentFoods = () => {
    const [recentFoods, setRecentFoods] = useState<Food[]>([]);

    useEffect(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) setRecentFoods(JSON.parse(stored));
        } catch {
            // ignore
        }
    }, []);

    const addRecent = useCallback((food: Food) => {
        setRecentFoods((prev) => {
            const filtered = prev.filter((f) => f.id !== food.id);
            const updated = [food, ...filtered].slice(0, MAX_RECENT);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
            return updated;
        });
    }, []);

    const removeRecent = useCallback((foodId: number) => {
        setRecentFoods((prev) => {
            const updated = prev.filter((f) => f.id !== foodId);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
            return updated;
        });
    }, []);

    return { recentFoods, addRecent, removeRecent };
};
