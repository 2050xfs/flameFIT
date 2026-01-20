import { createClient } from '@/lib/supabase/server';
import { WorkoutSession, NutrientLog } from '@/lib/types';
import { handleSupabaseError } from './base';

export const getSparkContext = async (userId: string) => {
    const supabase = await createClient();

    // Fetch user profile
    const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('name, weight, height, goals, preferences, bio')
        .eq('id', userId)
        .maybeSingle();

    handleSupabaseError(profileError);

    // Fetch recent workouts (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const { data: workouts, error: workoutsError } = await supabase
        .from('workout_sessions')
        .select('date, name, status')
        .eq('user_id', userId)
        .gte('date', sevenDaysAgo.toISOString())
        .order('date', { ascending: false });

    handleSupabaseError(workoutsError);

    // Fetch recent nutrition (last 3 days)
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

    const { data: nutrition, error: nutritionError } = await supabase
        .from('nutrient_logs')
        .select('date, meal_type, total_calories, total_protein, total_carbs, total_fats')
        .eq('user_id', userId)
        .gte('date', threeDaysAgo.toISOString())
        .order('date', { ascending: false });

    handleSupabaseError(nutritionError);

    return {
        profile,
        recentWorkouts: workouts as any[] || [],
        recentNutrition: nutrition as any[] || [],
        profileCompletion: calculateProfileCompletion(profile)
    };
};

export const calculateProfileCompletion = (profile: any) => {
    if (!profile) return 0;
    const fields = ['name', 'weight', 'height', 'goals'];
    const completed = fields.filter(f => {
        if (f === 'goals') return profile.goals && Array.isArray(profile.goals) && profile.goals.length > 0;
        return !!profile[f];
    });
    return Math.round((completed.length / fields.length) * 100);
};

export const formatContextForPrompt = (context: any) => {
    const { profile, recentWorkouts, recentNutrition } = context;

    let prompt = "USER PROFILE:\n";
    if (profile) {
        prompt += `- Name: ${profile.name}\n`;
        prompt += `- Goals: ${profile.goals?.join(', ')}\n`;
        prompt += `- Bio: ${profile.bio}\n`;
        prompt += `- Stats: ${profile.weight}kg, ${profile.height}cm\n`;
    }

    prompt += "\nRECENT WORKOUTS (Last 7 Days):\n";
    if (recentWorkouts.length > 0) {
        recentWorkouts.forEach((w: any) => {
            prompt += `- ${w.date}: ${w.name} (${w.status})\n`;
        });
    } else {
        prompt += "- None recorded.\n";
    }

    prompt += "\nRECENT NUTRITION (Last 3 Days):\n";
    if (recentNutrition.length > 0) {
        recentNutrition.forEach((n: any) => {
            prompt += `- ${n.date}: ${n.total_calories}kcal (P: ${n.total_protein}g, C: ${n.total_carbs}g, F: ${n.total_fats}g)\n`;
        });
    } else {
        prompt += "- None recorded.\n";
    }

    return prompt;
};
