import { useCallback, useEffect, useMemo, useState } from "react";
import { Coffee, UtensilsCrossed, Apple, Moon, LucideIcon } from "lucide-react";
import { getWeekDays } from "@/utils/format.utils";
import {
    ApiFoodLogDay,
    ApiWeekConsumed,
    MacroSummary,
    Meal,
    MealSlot,
    NewFoodEntry,
} from "@/types/tracking.types";
import { CalorieGoal } from "@/hooks/useCalorieGoal";
import { useAuth } from "@/hooks/useAuth";
import {
    addFoodLogEntry,
    deleteFoodLogEntry,
    getFoodLog,
    getFoodLogWeek,
} from "@/api/services/foodlog.service";

const DEFAULT_GOAL: MacroSummary = { calories: 2200, proteins: 150, carbs: 280, lipids: 75 };
const EMPTY_CONSUMED: MacroSummary = { calories: 0, proteins: 0, carbs: 0, lipids: 0 };

const SLOT_ORDER: MealSlot[] = ["breakfast", "lunch", "snack", "dinner"];

const SLOT_META: Record<MealSlot, { label: string; icon: LucideIcon }> = {
    breakfast: { label: "Petit-déjeuner", icon: Coffee },
    lunch: { label: "Déjeuner", icon: UtensilsCrossed },
    snack: { label: "Collation", icon: Apple },
    dinner: { label: "Dîner", icon: Moon },
};

const emptyMeals = (): Meal[] =>
    SLOT_ORDER.map((slot) => ({
        slot,
        label: SLOT_META[slot].label,
        icon: SLOT_META[slot].icon,
        items: [],
    }));

const buildMeals = (day: ApiFoodLogDay): Meal[] =>
    SLOT_ORDER.map((slot) => {
        const apiMeal = day.meals.find((m) => m.slot === slot);
        return {
            slot,
            label: SLOT_META[slot].label,
            icon: SLOT_META[slot].icon,
            items: apiMeal?.items ?? [],
        };
    });

export const useTracking = (goal?: CalorieGoal | null) => {
    const { token } = useAuth();
    const weekDays = useMemo(() => getWeekDays(), []);
    const todayIndex = weekDays.findIndex((d) => d.isToday);

    const [selectedDay, setSelectedDay] = useState(todayIndex);
    const [expandedMeal, setExpandedMeal] = useState<MealSlot | null>(null);

    const [meals, setMeals] = useState<Meal[]>(emptyMeals);
    const [consumed, setConsumed] = useState<MacroSummary>(EMPTY_CONSUMED);
    const [weekConsumed, setWeekConsumed] = useState<Record<string, MacroSummary>>({});
    const [loadingDay, setLoadingDay] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const selectedWeekDay = weekDays[selectedDay];
    const selectedIso = selectedWeekDay?.iso;
    const weekStart = weekDays[0]?.iso;

    const loadDay = useCallback(
        async (iso: string) => {
            if (!token) return;
            setLoadingDay(true);
            setError(null);
            try {
                const res = await getFoodLog(token, iso);
                const day = res.data as ApiFoodLogDay;
                setMeals(buildMeals(day));
                setConsumed(day.consumed ?? EMPTY_CONSUMED);
            } catch (err) {
                setMeals(emptyMeals());
                setConsumed(EMPTY_CONSUMED);
                setError(err instanceof Error ? err.message : "Erreur de chargement");
            } finally {
                setLoadingDay(false);
            }
        },
        [token]
    );

    // Charge le jour sélectionné
    useEffect(() => {
        if (selectedIso) loadDay(selectedIso);
    }, [selectedIso, loadDay]);

    // Charge les totaux de la semaine (indicateurs du sélecteur de jours)
    useEffect(() => {
        if (!token || !weekStart) return;
        let active = true;
        (async () => {
            try {
                const res = await getFoodLogWeek(token, weekStart);
                if (!active) return;
                const map: Record<string, MacroSummary> = {};
                (res.data as ApiWeekConsumed[]).forEach((d) => {
                    map[d.date] = d.consumed;
                });
                setWeekConsumed(map);
            } catch {
                if (active) setWeekConsumed({});
            }
        })();
        return () => {
            active = false;
        };
    }, [token, weekStart]);

    const dailyGoal: MacroSummary = goal
        ? {
            calories: goal.calories,
            proteins: goal.proteins,
            carbs: goal.carbs,
            lipids: goal.lipids,
        }
        : DEFAULT_GOAL;

    const toggleMeal = (slot: MealSlot) =>
        setExpandedMeal((current) => (current === slot ? null : slot));

    const selectDay = (index: number) => {
        setSelectedDay(index);
        setExpandedMeal(null);
    };

    const refresh = useCallback(() => {
        if (selectedIso) loadDay(selectedIso);
    }, [selectedIso, loadDay]);

    const addItem = useCallback(
        async (slot: MealSlot, item: Omit<NewFoodEntry, "date" | "meal_slot">) => {
            if (!token || !selectedIso) return;
            await addFoodLogEntry(token, { ...item, date: selectedIso, meal_slot: slot });
            await loadDay(selectedIso);
        },
        [token, selectedIso, loadDay]
    );

    const removeItem = useCallback(
        async (id: number) => {
            if (!token || !selectedIso) return;
            await deleteFoodLogEntry(token, id);
            await loadDay(selectedIso);
        },
        [token, selectedIso, loadDay]
    );

    const hasData = meals.some((m) => m.items.length > 0);

    return {
        dailyGoal,
        consumed,
        meals,
        weekDays,
        weekConsumed,
        selectedDay,
        selectedWeekDay,
        setSelectedDay: selectDay,
        expandedMeal,
        toggleMeal,
        hasData,
        loadingDay,
        error,
        addItem,
        removeItem,
        refresh,
    };
};
