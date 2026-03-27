"use server";

import { saveGeneratedWorkout } from "@/lib/api/workout";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

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

export async function advanceProgramWeekAction(programId: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Unauthorized');

    const { data: sub, error: fetchError } = await supabase
        .from('program_subscriptions')
        .select('id, current_week')
        .eq('user_id', user.id)
        .eq('program_id', programId)
        .eq('status', 'active')
        .maybeSingle();

    if (fetchError || !sub) throw new Error('Subscription not found');

    const { error } = await supabase
        .from('program_subscriptions')
        .update({ current_week: sub.current_week + 1 })
        .eq('id', sub.id);

    if (error) throw new Error('Failed to advance week');

    revalidatePath(`/workouts/pro/${programId}`);
    return { success: true, newWeek: sub.current_week + 1 };
}

export async function getProgramSubscriptionAction(programId: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data } = await supabase
        .from('program_subscriptions')
        .select('id, current_week, created_at, status')
        .eq('user_id', user.id)
        .eq('program_id', programId)
        .eq('status', 'active')
        .maybeSingle();

    return data;
}
