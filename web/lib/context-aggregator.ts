import { SupabaseClient } from '@supabase/supabase-js'
import { Database } from '@/lib/api/supabase-types'

export async function getAgentContext(supabase: SupabaseClient<Database>, userId: string) {
    const [profileResult, workoutsResult, nutritionResult] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', userId).single(),
        supabase.from('workout_sessions').select('*, set_logs(*, exercises(*))').eq('user_id', userId).order('date', { ascending: false }).limit(3),
        supabase.from('nutrient_logs').select('*, nutrient_log_items(*, food_items(*))').eq('user_id', userId).eq('date', new Date().toISOString().split('T')[0]).single()
    ])

    const profile = profileResult.data
    const workouts = workoutsResult.data || []
    const nutrition = nutritionResult.data

    // Filter to last 3 workouts to keep context small
    const recentWorkouts = workouts

    return {
        userProfile: profile,
        recentWorkouts: recentWorkouts.map(w => ({
            date: w.date,
            name: w.name,
            exercises: w.set_logs.map((s: any) => ({
                exercise: s.exercises?.name,
                sets: s.sets,
                reps: s.reps,
                weight: s.weight
            }))
        })),
        todaysNutrition: nutrition ? {
            calories: nutrition.total_calories,
            protein: nutrition.total_protein,
            carbs: nutrition.total_carbs,
            fats: nutrition.total_fats,
            meals: nutrition.nutrient_log_items.map((i: any) => ({
                food: i.food_items?.name,
                quantity: i.quantity,
                calories: i.food_items?.calories * i.quantity
            }))
        } : null
    }
}
