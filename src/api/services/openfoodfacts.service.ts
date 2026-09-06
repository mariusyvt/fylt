import { Nutrients } from "@/types/nutrition.types";
import { OpenFoodFacts } from "@openfoodfacts/openfoodfacts-nodejs";

const client = new OpenFoodFacts(fetch);

const logDev = (message: string, detail?: unknown) => {
    if (process.env.NODE_ENV !== "production") {
        console.error(message, detail);
    }
};

export const searchByBarcode = async (barcode: string): Promise<Nutrients | null> => {
    const {data, error} = await client.getProductV3(barcode);

    if (!data || data.status === "failure") {
        logDev("Error fetching product:", error);
        return null;
    }

    const product = data.product;

    const nutriments = product.nutriments as unknown as Record<string, number> | undefined;

    return {
        name: product.product_name || "",
        calories: nutriments?.["energy-kcal_100g"] || 0,
        proteins: nutriments?.["proteins_100g"] || 0,
        carbs: nutriments?.["carbohydrates_100g"] || 0,
        lipids: nutriments?.["fat_100g"] || 0,
    };
};
