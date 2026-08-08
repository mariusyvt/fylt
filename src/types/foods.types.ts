export type FoodSource = "ciqual" | "off" | "custom";

export interface Food {
    id: number;
    name: string;
    source: FoodSource;
    category: string | null;
    barcode: string | null;
    user_id: string | null;
    calories_100g: number;
    proteins_100g: number;
    carbs_100g: number;
    lipids_100g: number;
}

export interface NewFood {
    name: string;
    calories_100g: number;
    proteins_100g?: number;
    carbs_100g?: number;
    lipids_100g?: number;
}
