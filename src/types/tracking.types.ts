import { LucideIcon } from "lucide-react";

export type MealSlot = "breakfast" | "lunch" | "snack" | "dinner";

export interface WeekDay {
    label: string;
    date: number;
    isToday: boolean;
    isFuture: boolean;
    fullDate: string;
    iso: string;
}

export interface MacroSummary {
    calories: number;
    proteins: number;
    carbs: number;
    lipids: number;
}

export interface FoodItem {
    id: number;
    name: string;
    calories: number;
    proteins: number;
    carbs: number;
    lipids: number;
}

export interface Meal {
    slot: MealSlot;
    label: string;
    icon: LucideIcon;
    items: FoodItem[];
}

// ── Réponses API ──
export interface ApiFoodLogItem {
    id: number;
    name: string;
    calories: number;
    proteins: number;
    carbs: number;
    lipids: number;
}

export interface ApiFoodLogMeal {
    slot: MealSlot;
    items: ApiFoodLogItem[];
}

export interface ApiFoodLogDay {
    date: string;
    consumed: MacroSummary;
    goals?: Partial<MacroSummary> | null;
    remaining?: Partial<MacroSummary> | null;
    meals: ApiFoodLogMeal[];
}

export interface ApiWeekConsumed {
    date: string;
    consumed: MacroSummary;
}

export interface ApiWeekResponse {
    goals?: Partial<MacroSummary> | null;
    days: ApiWeekConsumed[];
}

export interface NewFoodEntry {
    date: string;
    meal_slot: MealSlot;
    name: string;
    calories: number;
    proteins?: number;
    carbs?: number;
    lipids?: number;
}

export interface UpdateFoodEntry {
    meal_slot?: MealSlot;
    name?: string;
    calories?: number;
    proteins?: number;
    carbs?: number;
    lipids?: number;
}

export interface RecentFood {
    name: string;
    calories: number;
    proteins: number;
    carbs: number;
    lipids: number;
}

export interface WeightEntry {
    id: number;
    weight: number;
    date: string;
}

export interface MonthlyStats {
    month: string;
    days_logged: number;
    average: MacroSummary;
    goals: Partial<MacroSummary> | null;
    days_on_target: number | null;
}


