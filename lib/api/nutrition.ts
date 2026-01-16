import { FoodItem } from "@/lib/types";

// Types matching CalorieNinjas response
interface CNItem {
    name: string;
    calories: number;
    serving_size_g: number;
    fat_total_g: number;
    fat_saturated_g: number;
    protein_g: number;
    sodium_mg: number;
    potassium_mg: number;
    cholesterol_mg: number;
    carbohydrates_total_g: number;
    fiber_g: number;
    sugar_g: number;
}

export async function searchNutrition(query: string): Promise<FoodItem[]> {
    // In production, this would call:
    // const res = await fetch(`https://api.calorieninjas.com/v1/nutrition?query=${query}`, { headers: { 'X-Api-Key': env.CALORIE_NINJAS_KEY } })

    // Low-fi Mock for Prototype
    await new Promise(r => setTimeout(r, 600)); // Simulate network

    const mockDb: Record<string, FoodItem> = {
        "apple": {
            id: "m-1",
            name: "Apple",
            calories: 95,
            protein: 0.5,
            carbs: 25,
            fats: 0.3,
            servingSize: "1 medium",
        },
        "chicken": {
            id: "m-2",
            name: "Chicken Breast",
            calories: 165,
            protein: 31,
            carbs: 0,
            fats: 3.6,
            servingSize: "100g",
        },
        "egg": {
            id: "m-3",
            name: "Egg",
            calories: 78,
            protein: 6,
            carbs: 0.6,
            fats: 5,
            servingSize: "1 large",
        }
    };

    // Simple keyword match
    const lowerQuery = query.toLowerCase();
    const results = Object.values(mockDb).filter(item => lowerQuery.includes(item.name.toLowerCase()));

    if (results.length === 0 && query.length > 2) {
        // Fallback for "unknown" items to show the UI works
        return [{
            id: `m-${Math.random()}`,
            name: query,
            calories: 100, // guess
            protein: 5,
            carbs: 10,
            fats: 2,
            servingSize: "1 serving",
        }];
    }

    return results;
}
