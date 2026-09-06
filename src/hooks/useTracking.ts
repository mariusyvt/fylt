import { useCallback, useEffect, useMemo, useState } from "react";
import { Coffee, UtensilsCrossed, Apple, Moon, LucideIcon } from "lucide-react";
import { getWeekDays } from "@/utils/format.utils";
import {
    ApiFoodLogDay,
    ApiWeekConsumed,
    ApiWeekResponse,
    MacroSummary,
    Meal,
    MealSlot,
    NewFoodEntry,
    UpdateFoodEntry,
} from "@/types/tracking.types";
import { CalorieGoal } from "@/hooks/useCalorieGoal";
import { useAuth } from "@/hooks/useAuth";
import {
    addFoodLogEntry,
    deleteFoodLogEntry,
    getFoodLog,
    getFoodLogWeek,
    updateFoodLogEntry,
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
    const { isAuthenticated } = useAuth();
    const [weekOffset, setWeekOffset] = useState(0);
    const weekDays = useMemo(() => getWeekDays(weekOffset), [weekOffset]);
    const todayIndex = getWeekDays(0).findIndex((d) => d.isToday);

    const [selectedDay, setSelectedDay] = useState(todayIndex);
    const [expandedMeal, setExpandedMeal] = useState<MealSlot | null>(null);

    const [meals, setMeals] = useState<Meal[]>(emptyMeals);
    const [consumed, setConsumed] = useState<MacroSummary>(EMPTY_CONSUMED);
    const [apiGoals, setApiGoals] = useState<Partial<MacroSummary> | null>(null);
    const [remaining, setRemaining] = useState<Partial<MacroSummary> | null>(null);
    const [weekConsumed, setWeekConsumed] = useState<Record<string, MacroSummary>>({});
    const [loadingDay, setLoadingDay] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const selectedWeekDay = weekDays[selectedDay];
    const selectedIso = selectedWeekDay?.iso;
    const weekStart = weekDays[0]?.iso;

    const loadDay = useCallback(
        async (iso: string) => {
            if (!isAuthenticated) return;
            setLoadingDay(true);
            setError(null);
            try {
                const res = await getFoodLog(iso);
                const day = res.data as ApiFoodLogDay;
                setMeals(buildMeals(day));
                setConsumed(day.consumed ?? EMPTY_CONSUMED);
                setApiGoals(day.goals ?? null);
                setRemaining(day.remaining ?? null);
            } catch (err) {
                setMeals(emptyMeals());
                setConsumed(EMPTY_CONSUMED);
                setApiGoals(null);
                setRemaining(null);
                setError(err instanceof Error ? err.message : "Erreur de chargement");
            } finally {
                setLoadingDay(false);
            }
        },
        [isAuthenticated]
    );

    // Charge le jour sélectionné
    useEffect(() => {
        if (selectedIso) loadDay(selectedIso);
    }, [selectedIso, loadDay]);

    // Charge les totaux de la semaine (indicateurs du sélecteur de jours)
    useEffect(() => {
        if (!isAuthenticated || !weekStart) return;
        let active = true;
        (async () => {
            try {
                const res = await getFoodLogWeek(weekStart);
                if (!active) return;
                const payload = res.data as ApiWeekResponse | ApiWeekConsumed[];
                const days: ApiWeekConsumed[] = Array.isArray(payload)
                    ? payload
                    : payload.days ?? [];
                const map: Record<string, MacroSummary> = {};
                days.forEach((d) => {
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
    }, [isAuthenticated, weekStart]);

    const dailyGoal: MacroSummary = goal
        ? {
            calories: goal.calories,
            proteins: goal.proteins,
            carbs: goal.carbs,
            lipids: goal.lipids,
        }
        : {
            calories: apiGoals?.calories ?? DEFAULT_GOAL.calories,
            proteins: apiGoals?.proteins ?? DEFAULT_GOAL.proteins,
            carbs: apiGoals?.carbs ?? DEFAULT_GOAL.carbs,
            lipids: apiGoals?.lipids ?? DEFAULT_GOAL.lipids,
        };

    const toggleMeal = (slot: MealSlot) =>
        setExpandedMeal((current) => (current === slot ? null : slot));

    const selectDay = (index: number) => {
        setSelectedDay(index);
        setExpandedMeal(null);
    };

    const goToWeek = (delta: number) => {
        setWeekOffset((o) => o + delta);
        setExpandedMeal(null);
    };

    const goToToday = () => {
        setWeekOffset(0);
        setSelectedDay(todayIndex);
        setExpandedMeal(null);
    };

    const refresh = useCallback(() => {
        if (selectedIso) loadDay(selectedIso);
    }, [selectedIso, loadDay]);

    const addItem = useCallback(
        async (slot: MealSlot, item: Omit<NewFoodEntry, "date" | "meal_slot">) => {
            if (!isAuthenticated || !selectedIso) return;
            await addFoodLogEntry({ ...item, date: selectedIso, meal_slot: slot });
            await loadDay(selectedIso);
        },
        [isAuthenticated, selectedIso, loadDay]
    );

    const removeItem = useCallback(
        async (id: number) => {
            if (!isAuthenticated || !selectedIso) return;
            await deleteFoodLogEntry(id);
            await loadDay(selectedIso);
        },
        [isAuthenticated, selectedIso, loadDay]
    );

    const editItem = useCallback(
        async (id: number, changes: UpdateFoodEntry) => {
            if (!isAuthenticated || !selectedIso) return;
            await updateFoodLogEntry(id, changes);
            await loadDay(selectedIso);
        },
        [isAuthenticated, selectedIso, loadDay]
    );

    const hasData = meals.some((m) => m.items.length > 0);

    return {
        dailyGoal,
        consumed,
        remaining,
        meals,
        weekDays,
        weekConsumed,
        weekOffset,
        goToWeek,
        goToToday,
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
        editItem,
        refresh,
    };
};
