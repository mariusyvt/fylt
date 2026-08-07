export type ActivityLevel =
    | "sedentary"
    | "light"
    | "moderate"
    | "heavy"
    | "athlete";

export interface Profile {
    email: string;
    firstName: string;
    lastName: string;
    gender: string;
    photo_url: string;
    age: number | null;
    weight: number | null;
    height: number | null;
    activity_level: ActivityLevel | null;
    daily_calories: number | null;
    daily_proteins: number | null;
    daily_carbs: number | null;
    daily_lipids: number | null;
}