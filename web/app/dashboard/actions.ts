'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export interface ReadinessInput {
    sleepHours: number;
    sleepQuality: number; // 1-5
    mood: number;         // 1-5
    soreness: number;     // 1-5
    notes?: string;
}

export interface OnboardingInput {
    name: string;
    weight: string; // string from form input, parsed server-side
    height: string;
    goals: string[];
}

export async function logReadinessAction(input: ReadinessInput) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Unauthorized');

    const today = new Date().toISOString().split('T')[0];

    const { error } = await supabase
        .from('readiness_logs')
        .upsert(
            {
                user_id: user.id,
                date: today,
                sleep_hours: input.sleepHours,
                sleep_quality: input.sleepQuality,
                mood: input.mood,
                soreness: input.soreness,
                notes: input.notes || null,
            },
            { onConflict: 'user_id,date' }
        );

    if (error) {
        console.error('Readiness log error:', error);
        throw new Error('Failed to log readiness');
    }

    revalidatePath('/dashboard');
    return { success: true };
}

export async function getTodayReadinessAction(): Promise<ReadinessInput | null> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const today = new Date().toISOString().split('T')[0];
    const { data } = await supabase
        .from('readiness_logs')
        .select('sleep_hours, sleep_quality, mood, soreness, notes')
        .eq('user_id', user.id)
        .eq('date', today)
        .single();

    if (!data) return null;

    return {
        sleepHours: data.sleep_hours,
        sleepQuality: data.sleep_quality,
        mood: data.mood,
        soreness: data.soreness,
        notes: data.notes,
    };
}

export async function completeOnboardingAction(input: OnboardingInput) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Unauthorized');

    const weight = input.weight ? parseFloat(input.weight) : null;
    const height = input.height ? parseFloat(input.height) : null;

    const { error } = await supabase
        .from('profiles')
        .update({
            name: input.name.trim(),
            weight: weight && weight > 0 ? weight : null,
            height: height && height > 0 ? height : null,
            goals: input.goals,
            updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

    if (error) {
        console.error('Onboarding save error:', error);
        throw new Error('Failed to save profile');
    }

    revalidatePath('/dashboard');
    revalidatePath('/profile');
    return { success: true };
}
