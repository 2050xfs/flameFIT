"use server";

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function updateProfile(data: Record<string, any>) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error("Unauthorized");

    const { error } = await supabase
        .from('profiles')
        .update(data)
        .eq('id', user.id);

    if (error) throw error;

    revalidatePath('/dashboard');
    revalidatePath('/profile');
    return { success: true };
}

export async function submitQuickLog(data: Record<string, string>) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error("Unauthorized");

    const activity = data['activity']?.toLowerCase() || "";
    const amount = data['amount'] || "";

    // Simple heuristic for MVP Routing
    const isNutrition = activity.includes('ate') || activity.includes('food') || activity.includes('calorie') || activity.includes('drink') || activity.includes('water');

    if (isNutrition) {
        // Log to nutrient_logs (Simplified: Just log a 'snack' with estimate)
        // In V2, we would parse macros. For now, we mock valid entry.
        const { error } = await supabase.from('nutrient_logs').insert({
            user_id: user.id,
            date: new Date().toISOString().split('T')[0],
            meal_type: 'snack',
            total_calories: 250, // Placeholder
            total_protein: 10,
            total_carbs: 30,
            total_fats: 5
        });
        if (error) console.error("Nutrient Log Error", error);
    } else {
        // Log to workout_sessions
        // We create a completed session for the "Running" or "Lifting"
        const { error } = await supabase.from('workout_sessions').insert({
            user_id: user.id,
            date: new Date().toISOString(),
            name: activity || "Quick Activity",
            duration: parseInt(amount) || 30,
            status: 'completed'
        });
        if (error) console.error("Workout Log Error", error);
    }

    revalidatePath('/dashboard');
    return { success: true };
}

export async function saveCustomWorkout(data: {
    name: string;
    goal?: string;
    muscles?: string[];
    difficulty?: string;
    equipment?: string[];
    protocol: Array<{ name: string; sets: string; reps: string; notes?: string }>;
}) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error("Unauthorized");

    // Map the custom workout format to generated_workouts schema
    const exercises = data.protocol.map(p => ({
        name: p.name,
        sets: parseInt(p.sets) || 3,
        reps: p.reps,
        notes: p.notes
    }));

    // Combine metadata into description or tags
    const description = `Custom workout for ${data.goal || 'general fitness'}. Difficulty: ${data.difficulty || 'Intermediate'}. Equipment: ${data.equipment?.join(', ') || 'Standard'}.`;

    const { error } = await supabase
        .from('generated_workouts')
        .insert({
            user_id: user.id,
            title: data.name,
            description: description,
            exercises: exercises,
            estimated_duration: 60, // Default estimate
            muscle_groups: data.muscles || [],
            tags: ['custom', data.difficulty || 'intermediate', ...(data.equipment || [])]
        });

    if (error) {
        console.error("Save Workout Error", error);
        throw error;
    }

    revalidatePath('/workouts');
    revalidatePath('/workouts/create');
    return { success: true };
}
