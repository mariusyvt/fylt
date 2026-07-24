import { LucideIcon } from "lucide-react";

export interface WeekDay {
    label: string;
    date: number;
    isToday: boolean;
}

export interface MacroSummary {
    calories: number;
    proteins: number;
    carbs: number;
    lipids: number;
}

export interface MealItem {
    name: string;
    calories: number;
}

export interface Meal {
    id: number;
    slot: string;
    icon: LucideIcon;
    items: MealItem[];
}

