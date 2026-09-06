"use client";

import { useCallback, useEffect, useState } from "react";
import { WeightEntry } from "@/types/tracking.types";
import { addWeight, getWeightHistory, deleteWeight } from "@/api/services/weight.service";
import { useAuth } from "@/hooks/useAuth";

export const useWeight = (months = 3) => {
    const { isAuthenticated } = useAuth();
    const [entries, setEntries] = useState<WeightEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const load = useCallback(async () => {
        if (!isAuthenticated) return;
        setLoading(true);
        try {
            const res = await getWeightHistory(months);
            setEntries(res.data ?? []);
        } catch {
            setEntries([]);
        } finally {
            setLoading(false);
        }
    }, [isAuthenticated, months]);

    useEffect(() => {
        load();
    }, [load]);

    const saveWeight = useCallback(
        async (weight: number, date: string) => {
            if (!isAuthenticated) return;
            setError(null);
            try {
                await addWeight(weight, date);
                await load();
            } catch (err) {
                setError(err instanceof Error ? err.message : "Impossible d'enregistrer le poids");
            }
        },
        [isAuthenticated, load]
    );

    const removeWeight = useCallback(
        async (id: number) => {
            if (!isAuthenticated) return;
            setEntries((prev) => prev.filter((e) => e.id !== id));
            try {
                await deleteWeight(id);
            } catch {
                await load();
            }
        },
        [isAuthenticated, load]
    );

    return { entries, loading, error, saveWeight, removeWeight };
};
