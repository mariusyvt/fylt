"use client"

import { useCallback, useEffect, useState } from "react";
import { ActivityLevel, Gender, MacroTargets } from "@/utils/tdee.utils";
import { getProfile, updateGoal } from "@/api/services/profile.service";
import { useAuth } from "@/hooks/useAuth";
import { Profile } from "@/types/profile.types";

export interface CalorieGoal extends MacroTargets {
    gender: Gender;
    age: number;
    weight: number;
    height: number;
    activity: ActivityLevel;
}

const profileToGoal = (p: Profile): CalorieGoal | null => {
    if (
        p.daily_calories == null ||
        p.age == null ||
        p.weight == null ||
        p.height == null ||
        p.activity_level == null
    ) {
        return null;
    }
    return {
        calories: p.daily_calories,
        proteins: p.daily_proteins ?? 0,
        carbs: p.daily_carbs ?? 0,
        lipids: p.daily_lipids ?? 0,
        gender: (p.gender as Gender) ?? "male",
        age: p.age,
        weight: p.weight,
        height: p.height,
        activity: p.activity_level,
    };
};

export const useCalorieGoal = () => {
    const { token } = useAuth();
    const [goal, setGoal] = useState<CalorieGoal | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!token) {
            setLoading(false);
            return;
        }
        let active = true;
        (async () => {
            try {
                const result = await getProfile(token);
                if (active) setGoal(profileToGoal(result.data));
            } catch {
                if (active) setGoal(null);
            } finally {
                if (active) setLoading(false);
            }
        })();
        return () => {
            active = false;
        };
    }, [token]);

    const saveGoal = useCallback(
        async (newGoal: CalorieGoal) => {
            if (!token) return;
            await updateGoal(token, {
                gender: newGoal.gender,
                age: newGoal.age,
                weight: newGoal.weight,
                height: newGoal.height,
                activity_level: newGoal.activity,
                daily_calories: newGoal.calories,
                daily_proteins: newGoal.proteins,
                daily_carbs: newGoal.carbs,
                daily_lipids: newGoal.lipids,
            });
            setGoal(newGoal);
        },
        [token]
    );

    return {
        goal,
        hasGoal: goal !== null,
        loading,
        saveGoal,
    };
};
