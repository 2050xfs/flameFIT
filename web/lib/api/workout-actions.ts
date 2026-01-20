'use server'

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { subscribeToProgram } from "./workout"; // Import the logic

export async function subscribeToProgramAction(programId: string) {
    try {
        await subscribeToProgram(programId);
        revalidatePath('/workouts');
        return { success: true };
    } catch (error: any) {
        console.error("Subscription error:", error);
        return { success: false, error: error.message };
    }
}

export async function getGeneratedWorkoutsAction() {
    try {
        const { getGeneratedWorkouts } = await import("./workout");
        const workouts = await getGeneratedWorkouts();
        return { success: true, data: workouts };
    } catch (error: any) {
        console.error("Fetch generated workouts error:", error);
        return { success: false, error: error.message };
    }
}


export async function startWorkoutSession(id: string) {
    const supabase = await createClient();

    const { error } = await supabase
        .from('workout_sessions')
        .update({ status: 'active' })
        .eq('id', id);

    if (error) {
        console.error("Error starting workout:", error);
        return { success: false, error: error.message };
    }

    revalidatePath('/dashboard');
    revalidatePath('/workouts');
    revalidatePath(`/workouts/session/${id}`);

    return { success: true };
}

export async function completeWorkoutSession(id: string, duration?: number) {
    const supabase = await createClient();

    const { error } = await supabase
        .from('workout_sessions')
        .update({
            status: 'completed',
            duration: duration || 60,
            created_at: new Date().toISOString() // Mark as finished now
        })
        .eq('id', id);

    if (error) {
        console.error("Error completing workout:", error);
        return { success: false, error: error.message };
    }

    revalidatePath('/dashboard');
    revalidatePath('/workouts');

    return { success: true };
}

export async function logSet(workoutSessionId: string, exerciseId: string, weight: number, reps: number, rpe?: number) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('set_logs')
        .insert({
            workout_session_id: workoutSessionId,
            exercise_id: exerciseId,
            weight,
            reps,
            rpe,
            completed_at: new Date().toISOString()
        })
        .select()
        .single();

    if (error) {
        console.error("Error logging set:", error);
        return { success: false, error: error.message };
    }

    revalidatePath(`/workouts/session/${workoutSessionId}`);

    return { success: true, data };
}
