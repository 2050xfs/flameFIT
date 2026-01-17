"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { calorieNinjas } from "@/lib/api/calorie-ninjas";

const LogMealSchema = z.object({
    name: z.string().min(1),
    calories: z.number(),
    protein: z.number(),
    carbs: z.number(),
    fats: z.number(),
    serving_size: z.string().optional(),
    meal_type: z.enum(['breakfast', 'lunch', 'dinner', 'snack']),
});

export async function searchFoodAction(formData: FormData) {
    const query = formData.get("query") as string;
    if (!query) return [];

    try {
        const results = await calorieNinjas.nutrition.search(query);

        return results.map(item => ({
            name: item.name,
            calories: Math.round(item.calories),
            protein: Math.round(item.protein_g),
            carbs: Math.round(item.carbohydrates_total_g),
            fats: Math.round(item.fat_total_g),
            servingSize: `${item.serving_size_g}g`
        }));
    } catch (error) {
        console.error("CalorieNinjas Search Failed:", error);
        return [];
    }
}

export async function logMealAction(mealData: z.infer<typeof LogMealSchema>) {
    const supabase = await createClient();

    // 1. Auth Check
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        throw new Error("Unauthorized");
    }

    // 2. Validation
    const validated = LogMealSchema.parse(mealData);

    const today = new Date().toISOString().split('T')[0];

    // 3. Database operations
    // Ideally this should be a transaction or RPC, but doing sequential for MVP

    // A. Insert Food Item
    const { data: foodItem, error: foodError } = await supabase
        .from('food_items')
        .insert({
            name: validated.name,
            calories: validated.calories,
            protein: validated.protein,
            carbs: validated.carbs,
            fats: validated.fats,
            serving_size: validated.serving_size || '1 serving'
        })
        .select()
        .single();

    if (foodError) {
        console.error("Food Item Error:", foodError);
        throw new Error("Failed to create food item");
    }

    // B. Find or Create Daily Log for this Meal Type
    // We try to find one first
    let { data: nutrientLog } = await supabase
        .from('nutrient_logs')
        .select('*')
        .eq('user_id', user.id)
        .eq('date', today)
        .eq('meal_type', validated.meal_type)
        .single();

    if (!nutrientLog) {
        // Create new log
        const { data: newLog, error: logError } = await supabase
            .from('nutrient_logs')
            .insert({
                user_id: user.id,
                date: today,
                meal_type: validated.meal_type
            })
            .select()
            .single();

        if (logError) {
            console.error("Nutrient Log Error:", logError);
            throw new Error("Failed to create nutrient log");
        }
        nutrientLog = newLog;
    }

    // C. Add Entry
    const { error: entryError } = await supabase
        .from('nutrient_log_items')
        .insert({
            nutrient_log_id: nutrientLog.id,
            food_item_id: foodItem.id,
            quantity: 1 // Default to 1 for now
        });

    if (entryError) {
        console.error("Entry Error:", entryError);
        throw new Error("Failed to log entry");
    }

    // 4. Revalidate
    revalidatePath('/kitchen');
    return { success: true };
}
