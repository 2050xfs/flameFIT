import { createClient } from "@/lib/supabase/server";
import { KitchenProps, MealEntry } from "@/lib/types";

export async function getKitchenData(): Promise<Omit<KitchenProps, 'onLogFood' | 'onScanBarcode' | 'onAddWater' | 'onViewMeal'>> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Default empty state
    const defaultState = {
        macros: {
            calories: { current: 0, target: 2800 },
            protein: { current: 0, target: 200 },
            carbs: { current: 0, target: 300 },
            fats: { current: 0, target: 90 }
        },
        meals: [] as MealEntry[],
        waterIntake: 0,
        waterTarget: 8
    };

    if (!user) {
        return defaultState;
    }

    const today = new Date().toISOString().split('T')[0];

    // Fetch daily log with items and food details
    const { data: logs, error } = await supabase
        .from('nutrient_logs')
        .select(`
            *,
            nutrient_log_items (
                id,
                quantity,
                food_items (
                    id,
                    name,
                    calories,
                    protein,
                    carbs,
                    fats,
                    serving_size
                )
            )
        `)
        .eq('user_id', user.id)
        .eq('date', today);

    if (error || !logs || logs.length === 0) {
        return defaultState;
    }

    // Flatten logs into a single list of meal entries
    // Note: Our schema has one 'nutrient_log' per day/meal_type combination or one per day?
    // Based on previous code, it seems designed as one log per day/meal_type entry, or a master log.
    // The previous implementation plan implied `nutrient_logs` is daily or per-entry. 
    // Let's assume the query returns multiple rows if there are multiple logs (e.g. one per meal event)
    // or one row if it's a daily summary. 
    // Wait, the schema in `api.ts` inserts with `meal_type` into `nutrient_logs`. 
    // So there could be multiple `nutrient_logs` rows for a single day (one per meal type?).
    // Let's aggregate them.

    let totalCalories = 0;
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFats = 0;

    const meals: MealEntry[] = [];

    logs.forEach((log: any) => {
        if (log.nutrient_log_items) {
            log.nutrient_log_items.forEach((item: any) => {
                const food = item.food_items;
                if (!food) return;

                const quantity = item.quantity || 1;

                const calories = food.calories * quantity;
                const protein = food.protein * quantity;
                const carbs = food.carbs * quantity;
                const fats = food.fats * quantity;

                totalCalories += calories;
                totalProtein += protein;
                totalCarbs += carbs;
                totalFats += fats;

                meals.push({
                    id: item.id,
                    time: "Today", // We don't have exact time in this schema, just date
                    mealType: log.meal_type || 'snack',
                    foodName: food.name,
                    calories: Math.round(calories),
                    protein: Math.round(protein),
                    carbs: Math.round(carbs),
                    fats: Math.round(fats),
                    servingSize: `${quantity} x ${food.serving_size || 'serving'}`
                });
            });
        }
    });

    return {
        macros: {
            calories: { current: Math.round(totalCalories), target: 2800 },
            protein: { current: Math.round(totalProtein), target: 200 },
            carbs: { current: Math.round(totalCarbs), target: 300 },
            fats: { current: Math.round(totalFats), target: 90 }
        },
        meals,
        waterIntake: 3, // Mocked for now as we don't have water logging explicit in this schema yet
        waterTarget: 8
    };
}
