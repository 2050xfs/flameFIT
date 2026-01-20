"use server";

import { saveGeneratedWorkout } from "@/lib/api/workout";
import { revalidatePath } from "next/cache";

export async function saveGeneratedWorkoutAction(workout: any) {
    try {
        const id = await saveGeneratedWorkout(workout);
        revalidatePath('/workouts');
        revalidatePath('/dashboard');
        return { success: true, id };
    } catch (error: any) {
        console.error("Failed to save workout:", error);
        return { success: false, error: error.message };
    }
}
