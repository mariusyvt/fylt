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
    weight: number; // kg
    height: number; // cm
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

// Mifflin-St Jeor equation (same as tdeecalculator.net)
export function calculateBMR({ gender, age, weight, height }: TdeeInput): number {
    const base = 10 * weight + 6.25 * height - 5 * age;
    return gender === "male" ? base + 5 : base - 161;
}

export function calculateTDEE(input: TdeeInput): number {
    const bmr = calculateBMR(input);
    return bmr * ACTIVITY_MULTIPLIERS[input.activity];
}

// Split calories into macros: 30% protein, 40% carbs, 30% fat
export function calculateMacros(input: TdeeInput): MacroTargets {
    const calories = Math.round(calculateTDEE(input));
    return {
        calories,
        proteins: Math.round((calories * 0.3) / 4),
        carbs: Math.round((calories * 0.4) / 4),
        lipids: Math.round((calories * 0.3) / 9),
    };
}
