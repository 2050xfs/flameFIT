import { createClient } from "@/lib/supabase/server";
import { KitchenProps, MealEntry } from "@/lib/types";
import { handleSupabaseError } from "./base";
import { getDefaultMacroTargets } from "./utils";

export async function getKitchenData(): Promise<Omit<KitchenProps, 'onLogFood' | 'onScanBarcode' | 'onAddWater' | 'onViewMeal'>> {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    // Default macro targets
    const defaultTargets = getDefaultMacroTargets();

    // Default empty state
    const defaultState = {
        macros: {
            calories: { current: 0, target: defaultTargets.calories },
            protein: { current: 0, target: defaultTargets.protein },
            carbs: { current: 0, target: defaultTargets.carbs },
            fats: { current: 0, target: defaultTargets.fats }
        },
        meals: [] as MealEntry[],
        waterIntake: 0,
        waterTarget: 8
    };

    if (authError || !user) {
        return defaultState;
    }

    const today = new Date().toISOString().split('T')[0];

    // Fetch daily log with items and food details
    const { data: logs, error: logsError } = await supabase
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

    handleSupabaseError(logsError);

    let totalCalories = 0;
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFats = 0;

    const meals: MealEntry[] = [];

    (logs || []).forEach((log: any) => {
        if (log.nutrient_log_items) {
            log.nutrient_log_items.forEach((item: any) => {
                const food = item.food_items;
                if (!food) return;

                const quantity = item.quantity || 1;

                const calories = (food.calories || 0) * quantity;
                const protein = (food.protein || 0) * quantity;
                const carbs = (food.carbs || 0) * quantity;
                const fats = (food.fats || 0) * quantity;

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

    // Fetch daily water intake
    const { data: waterLog } = await supabase
        .from('water_logs')
        .select('amount')
        .eq('user_id', user.id)
        .eq('date', today)
        .maybeSingle();

    // Fetch macro targets from profile
    const { data: profile } = await supabase
        .from('profiles')
        .select('weight')
        .eq('id', user.id)
        .maybeSingle();

    const macroTargets = getDefaultMacroTargets(profile?.weight || undefined);

    return {
        macros: {
            calories: { current: Math.round(totalCalories), target: macroTargets.calories },
            protein: { current: Math.round(totalProtein), target: macroTargets.protein },
            carbs: { current: Math.round(totalCarbs), target: macroTargets.carbs },
            fats: { current: Math.round(totalFats), target: macroTargets.fats }
        },
        meals,
        waterIntake: waterLog?.amount || 0,
        waterTarget: 8
    };
}
