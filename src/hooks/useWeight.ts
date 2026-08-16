"use client";

import { useCallback, useEffect, useState } from "react";
import { WeightEntry } from "@/types/tracking.types";
import { addWeight, getWeightHistory, deleteWeight } from "@/api/services/weight.service";
import { useAuth } from "@/hooks/useAuth";

export const useWeight = (months = 3) => {
    const { token } = useAuth();
    const [entries, setEntries] = useState<WeightEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const load = useCallback(async () => {
        if (!token) return;
        setLoading(true);
        try {
            const res = await getWeightHistory(token, months);
            setEntries(res.data ?? []);
        } catch {
            setEntries([]);
        } finally {
            setLoading(false);
        }
    }, [token, months]);

    useEffect(() => {
        load();
    }, [load]);

    const saveWeight = useCallback(
        async (weight: number, date: string) => {
            if (!token) return;
            setError(null);
            try {
                await addWeight(token, weight, date);
                await load();
            } catch (err) {
                setError(err instanceof Error ? err.message : "Impossible d'enregistrer le poids");
            }
        },
        [token, load]
    );

    const removeWeight = useCallback(
        async (id: number) => {
            if (!token) return;
            setEntries((prev) => prev.filter((e) => e.id !== id));
            try {
                await deleteWeight(token, id);
            } catch {
                await load();
            }
        },
        [token, load]
    );

    return { entries, loading, error, saveWeight, removeWeight };
};
