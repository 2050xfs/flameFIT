import { supabase } from '@/lib/supabase/client'
// Adapted path to types
import type { Database } from './supabase-types'

export const api = {
    exercises: {
        list: async () => {
            const { data, error } = await supabase
                .from('exercises')
                .select('*')
                .order('name')

            if (error) throw error
            return data
        },
        get: async (id: string) => {
            const { data, error } = await supabase
                .from('exercises')
                .select('*')
                .eq('id', id)
                .single()

            if (error) throw error
            return data
        }
    },
    nutrition: {
        listFoodItems: async () => {
            const { data, error } = await supabase
                .from('food_items')
                .select('*')
                .order('name')

            if (error) throw error
            return data
        },
        logMeal: async (userId: string, date: string, mealType: string, items: { foodItemId: string, quantity: number }[]) => {
            const { data: log, error: logError } = await supabase
                .from('nutrient_logs')
                .insert({ user_id: userId, date, meal_type: mealType })
                .select()
                .single()

            if (logError) throw logError

            const cleanItems = items.map(i => ({
                nutrient_log_id: log.id,
                food_item_id: i.foodItemId,
                quantity: i.quantity
            }))

            const { error: itemsError } = await supabase
                .from('nutrient_log_items')
                .insert(cleanItems)

            if (itemsError) throw itemsError
            return log
        },
        getDailyLog: async (userId: string, date: string) => {
            const { data, error } = await supabase
                .from('nutrient_logs')
                .select('*, nutrient_log_items(*, food_items(*))')
                .eq('user_id', userId)
                .eq('date', date)

            if (error) throw error
            return data
        }
    },
    user: {
        getProfile: async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return null

            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single()

            if (error) throw error
            return data
        }
    },
    workouts: {
        list: async (userId: string) => {
            const { data, error } = await supabase
                .from('workout_sessions')
                .select('*, set_logs(*, exercises(*))')
                .eq('user_id', userId)
                .order('date', { ascending: false })

            if (error) throw error
            return data
        }
    }
}
