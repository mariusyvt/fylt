import { useMemo, useState } from "react";
import { Coffee, UtensilsCrossed, Apple, Moon } from "lucide-react";
import { getWeekDays } from "@/utils/format.utils";
import { MacroSummary, Meal } from "@/types/tracking.types";

// ── Données de démonstration (à remplacer par l'API plus tard) ──
const DAILY_GOAL: MacroSummary = { calories: 2200, proteins: 150, carbs: 280, lipids: 75 };
const CONSUMED: MacroSummary = { calories: 1450, proteins: 95, carbs: 180, lipids: 42 };

const MEALS: Meal[] = [
    {
        id: 1, slot: "Petit-déjeuner", icon: Coffee, items: [
            { name: "Porridge protéiné", calories: 350 },
            { name: "Banane", calories: 90 },
        ]
    },
    {
        id: 2, slot: "Déjeuner", icon: UtensilsCrossed, items: [
            { name: "Poulet grillé & riz", calories: 520 },
            { name: "Salade verte", calories: 45 },
        ]
    },
    {
        id: 3, slot: "Collation", icon: Apple, items: [
            { name: "Yaourt grec", calories: 120 },
        ]
    },
    {
        id: 4, slot: "Dîner", icon: Moon, items: [
            { name: "Saumon & légumes", calories: 325 },
        ]
    },
];

export const useTracking = () => {
    const weekDays = useMemo(() => getWeekDays(), []);
    const todayIndex = weekDays.findIndex((d) => d.isToday);

    const [selectedDay, setSelectedDay] = useState(todayIndex);
    const [expandedMeal, setExpandedMeal] = useState<number | null>(null);

    const toggleMeal = (id: number) =>
        setExpandedMeal((current) => (current === id ? null : id));

    return {
        dailyGoal: DAILY_GOAL,
        consumed: CONSUMED,
        meals: MEALS,
        weekDays,
        selectedDay,
        setSelectedDay,
        expandedMeal,
        toggleMeal,
    };
};

