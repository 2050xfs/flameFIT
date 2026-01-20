"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const ProfileSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    height: z.number().min(50, "Height must be at least 50cm").optional(),
    weight: z.number().min(20, "Weight must be at least 20kg").optional(),
    goals: z.array(z.string()).optional(),
    preferences: z.object({
        theme: z.enum(['light', 'dark', 'system']),
        units: z.enum(['metric', 'imperial']),
    }).optional(),
});

export type ProfileData = z.infer<typeof ProfileSchema>;

export async function updateProfileAction(data: ProfileData) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        throw new Error("Unauthorized");
    }

    const validated = ProfileSchema.parse(data);

    const { error } = await supabase
        .from('profiles')
        .update({
            name: validated.name,
            height: validated.height,
            weight: validated.weight,
            goals: validated.goals,
            preferences: validated.preferences,
            updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

    if (error) {
        console.error("Profile Update Error:", error);
        throw new Error("Failed to update profile");
    }

    revalidatePath('/profile');
    revalidatePath('/dashboard');
    revalidatePath('/kitchen');

    return { success: true };
}
