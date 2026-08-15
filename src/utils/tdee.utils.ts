export type Gender = "male" | "female";

export type ActivityLevel =
    | "sedentary"
    | "light"
    | "moderate"
    | "heavy"
    | "athlete";

export interface TdeeInput {
    gender: Gender;
    age: number;
    weight: number;
    height: number;
    activity: ActivityLevel;
}

export interface MacroTargets {
    calories: number;
    proteins: number;
    carbs: number;
    lipids: number;
}

export const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    heavy: 1.725,
    athlete: 1.9,
};

export function calculateBMR({ gender, age, weight, height }: TdeeInput): number {
    const base = 10 * weight + 6.25 * height - 5 * age;
    return gender === "male" ? base + 5 : base - 161;
}

export function calculateTDEE(input: TdeeInput): number {
    const bmr = calculateBMR(input);
    return bmr * ACTIVITY_MULTIPLIERS[input.activity];
}

export function splitMacros(calories: number): Omit<MacroTargets, "calories"> {
    return {
        proteins: Math.round((calories * 0.3) / 4),
        carbs: Math.round((calories * 0.4) / 4),
        lipids: Math.round((calories * 0.3) / 9),
    };
}

export function calculateMacros(input: TdeeInput): MacroTargets {
    const calories = Math.round(calculateTDEE(input));
    return { calories, ...splitMacros(calories) };
}

export type CalorieObjective =
    | "maintain"
    | "cut_moderate"
    | "cut_intense"
    | "bulk_moderate"
    | "bulk_intense";

export const OBJECTIVE_ADJUSTMENTS: Record<CalorieObjective, number> = {
    maintain: 0,
    cut_moderate: -0.15,
    cut_intense: -0.25,
    bulk_moderate: 0.1,
    bulk_intense: 0.2,
};

export function applyObjective(
    base: MacroTargets,
    objective: CalorieObjective
): MacroTargets {
    const calories = Math.round(base.calories * (1 + OBJECTIVE_ADJUSTMENTS[objective]));
    return { calories, ...splitMacros(calories) };
}
