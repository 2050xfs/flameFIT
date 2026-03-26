"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// Subscription management
export async function upgradeSubscriptionAction(tier: 'pro' | 'elite') {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    // In a real app this would integrate with Stripe/payment provider.
    // Here we set the tier directly — wire up payment webhooks to this same logic.
    const expiresAt = new Date();
    expiresAt.setFullYear(expiresAt.getFullYear() + 1); // 1-year subscription

    const { error } = await supabase
        .from('profiles')
        .update({
            subscription_tier: tier,
            subscription_started_at: new Date().toISOString(),
            subscription_expires_at: expiresAt.toISOString(),
            updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

    if (error) {
        console.error("Subscription upgrade error:", error);
        throw new Error("Failed to upgrade subscription");
    }

    revalidatePath('/profile');
    revalidatePath('/dashboard');
    return { success: true, tier };
}

export async function cancelSubscriptionAction() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    const { error } = await supabase
        .from('profiles')
        .update({
            subscription_tier: 'free',
            subscription_expires_at: new Date().toISOString(), // Expire immediately
            updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

    if (error) throw new Error("Failed to cancel subscription");

    revalidatePath('/profile');
    return { success: true };
}

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
