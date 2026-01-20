"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function logWeightAction(weight: number, bodyFat?: number) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    const today = new Date().toISOString().split('T')[0];

    const { error } = await supabase
        .from('body_stats')
        .upsert({
            user_id: user.id,
            date: today,
            weight,
            body_fat_pct: bodyFat
        }, { onConflict: 'user_id,date' });

    if (error) {
        console.error("Log Weight Error:", error);
        throw new Error("Failed to log weight");
    }

    // Also update current weight in profile
    await supabase
        .from('profiles')
        .update({ weight })
        .eq('id', user.id);

    revalidatePath('/progress');
    revalidatePath('/'); // Dashboard likely uses weight for macros
    return { success: true };
}
