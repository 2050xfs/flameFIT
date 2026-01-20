import { createClient } from "@/lib/supabase/server";
import { WorkoutLabProps, WorkoutDetail, WeeklyDay, WorkoutExercise } from "@/lib/types";
import { handleSupabaseError } from "./base";

export async function getWorkoutLabData(): Promise<Omit<WorkoutLabProps, 'onStartWorkout' | 'onViewDetails'>> {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    // Default empty state
    const defaultState = {
        currentPlan: { name: "Flex Plan", week: 1 },
        weeklySchedule: [] as WeeklyDay[],
        todaysWorkout: null,
        upcomingWorkouts: [] as WorkoutDetail[]
    };

    if (authError || !user) return defaultState;

    // Calculate start and end of current week (Monday to Sunday)
    const now = new Date();
    const dayOfWeek = now.getDay(); // 0 is Sunday, 1 is Monday
    const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const monday = new Date(now);
    monday.setDate(now.getDate() + diffToMonday);
    monday.setHours(0, 0, 0, 0);

    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    sunday.setHours(23, 59, 59, 999);

    const todayStr = now.toISOString().split('T')[0];
    const startStr = monday.toISOString().split('T')[0];
    const endStr = sunday.toISOString().split('T')[0];

    // Fetch workout sessions for the week
    const { data: sessions, error: sessionsError } = await supabase
        .from('workout_sessions')
        .select(`
            *,
            set_logs (
                id,
                weight,
                reps,
                exercises (
                    name,
                    muscle_groups
                )
            )
        `)
        .eq('user_id', user.id)
        .gte('date', startStr)
        .lte('date', endStr)
        .order('date', { ascending: true });

    handleSupabaseError(sessionsError);

    // Map sessions to a map for easy lookup by date
    const sessionMap = new Map();
    sessions?.forEach(s => {
        // Handle both full ISO strings and YYYY-MM-DD
        const dateKey = s.date.includes('T') ? s.date.split('T')[0] : s.date;
        sessionMap.set(dateKey, s);
    });

    const schedule: WeeklyDay[] = [];
    let todaysWorkout: WorkoutDetail | null = null;
    const upcomingWorkouts: WorkoutDetail[] = [];

    // Helper to map DB session to UI WorkoutDetail
    const mapSessionToDetail = (s: any): WorkoutDetail => {
        const exerciseMap = new Map<string, WorkoutExercise>();

        if (s.set_logs) {
            s.set_logs.forEach((log: any) => {
                const exName = log.exercises?.name || 'Unknown Exercise';
                const exId = log.exercises?.id || 'unknown';
                if (!exerciseMap.has(exName)) {
                    exerciseMap.set(exName, { id: log.id, exerciseId: exId, name: exName, sets: 0, reps: '0' });
                }
                const ex = exerciseMap.get(exName)!;
                ex.sets += 1;
                // If we have reps in the log, update it
                if (log.reps) ex.reps = `${log.reps}`;
            });
        }

        const muscles = Array.from(new Set(
            s.set_logs?.flatMap((l: any) => l.exercises?.muscle_groups).filter(Boolean)
        )) as string[];

        return {
            id: s.id,
            title: s.name || 'Workout Session',
            intensity: 'Moderate',
            duration: `${s.duration || 60} min`,
            muscles: muscles.length > 0 ? muscles : ['Full Body'],
            exercises: Array.from(exerciseMap.values()),
            date: s.date,
            status: s.status as WorkoutDetail['status']
        };

    };

    // Generate full week schedule (Mon-Sun)
    for (let i = 0; i < 7; i++) {
        const d = new Date(monday);
        d.setDate(monday.getDate() + i);
        const dStr = d.toISOString().split('T')[0];
        const session = sessionMap.get(dStr);

        const isToday = dStr === todayStr;
        const status: WeeklyDay['status'] = isToday
            ? (session?.status === 'completed' ? 'completed' : 'active')
            : (session?.status === 'completed' ? 'completed' : 'upcoming');

        schedule.push({
            day: d.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase(),
            date: d.getDate().toString(),
            code: session ? (session.name?.split(' ')[0].toUpperCase() || 'WORK') : 'REST',
            status
        });

        if (session) {
            const detail = mapSessionToDetail(session);
            if (isToday) todaysWorkout = detail;
            else if (dStr > todayStr) upcomingWorkouts.push(detail);
        }
    }

    // Fetch pro programs from Supabase
    let proPrograms = [];
    const { data: proTemplates, error: templatesError } = await supabase
        .from('program_templates')
        .select('id, title, creator, description, difficulty, duration_weeks, thumbnail_url')
        .order('created_at', { ascending: false });

    handleSupabaseError(templatesError);

    // Fetch user's subscriptions to determine ownership
    const { data: subscriptions, error: subscriptionsError } = await supabase
        .from('program_subscriptions')
        .select('program_id')
        .eq('user_id', user.id);

    handleSupabaseError(subscriptionsError);

    const ownedProgramIds = new Set(subscriptions?.map(s => s.program_id) || []);

    proPrograms = (proTemplates || []).map((t: any) => ({
        id: t.id,
        title: t.title,
        creator: t.creator,
        description: t.description || "",
        difficulty: (t.difficulty as any) || "intermediate",
        durationWeeks: t.duration_weeks || 8,
        thumbnailUrl: t.thumbnail_url,
        isOwned: ownedProgramIds.has(t.id)
    }));

    // Fetch custom workouts (now using generated_workouts)
    const { data: generatedWorkouts, error: generatedError } = await supabase
        .from('generated_workouts')
        .select('id, title, created_at, exercises') // generated_workouts has 'exercises' not 'plan_data'
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

    if (generatedError) console.warn("Error fetching generated workouts:", generatedError.message);

    return {
        currentPlan: { name: "Flex Plan", week: 1 },
        weeklySchedule: schedule,
        todaysWorkout,
        upcomingWorkouts: upcomingWorkouts.slice(0, 3),
        proPrograms,
        customWorkouts: generatedWorkouts || []
    };
}

function getMockProPrograms() {
    return [
        {
            id: 'sadik-abs',
            title: "Abs Destruction",
            creator: "Sadik Hadzovic",
            description: "Carve a legendary core with Sadik's high-volume circuit training.",
            difficulty: 'advanced' as const,
            durationWeeks: 4,
            thumbnailUrl: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&auto=format&fit=crop&q=60"
        },
        {
            id: 'aj-formula',
            title: "The Secret Formula",
            creator: "AJ Ellison",
            description: "AJ Ellison's blueprint for a world-class physique focusing on symmetry.",
            difficulty: 'intermediate' as const,
            durationWeeks: 12,
            thumbnailUrl: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=800&auto=format&fit=crop&q=60"
        }
    ];
}

export async function getCustomWorkouts(): Promise<any[]> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return [];

    const { data: customWorkouts, error } = await supabase
        .from('generated_workouts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

    handleSupabaseError(error);

    return customWorkouts || [];
}

export async function getWorkoutDetails(id: string): Promise<WorkoutDetail | null> {
    const supabase = await createClient();

    const { data: session, error } = await supabase
        .from('workout_sessions')
        .select(`
            *,
            set_logs (
                id,
                weight,
                reps,
                rpe,
                exercises (
                    *
                )
            )
        `)
        .eq('id', id)
        .single();

    handleSupabaseError(error);
    if (!session) return null;

    // Properly map exercises with set information
    const exerciseMap = new Map<string, WorkoutExercise>();
    session.set_logs?.forEach((log: any) => {
        const exName = log.exercises?.name || 'Unknown';
        const exId = log.exercises?.id || 'unknown';
        if (!exerciseMap.has(exName)) {
            exerciseMap.set(exName, { id: log.id, exerciseId: exId, name: exName, sets: 0, reps: '0' });
        }
        const ex = exerciseMap.get(exName)!;
        ex.sets += 1;
        if (log.reps) ex.reps = `${log.reps}`;
    });

    const muscles = Array.from(new Set(
        session.set_logs?.flatMap((l: any) => l.exercises?.muscle_groups).filter(Boolean)
    )) as string[];

    return {
        id: session.id,
        title: session.name || 'Workout Session',
        intensity: 'Moderate',
        duration: `${session.duration || 60} min`,
        muscles: muscles.length > 0 ? muscles : ['Full Body'],
        exercises: Array.from(exerciseMap.values()),
        date: session.date,
        status: session.status as WorkoutDetail['status']
    };
}

export async function getProProgramDetails(id: string): Promise<any | null> {
    const supabase = await createClient();

    const { data: template } = await supabase
        .from('program_templates')
        .select('id, title, creator, description, difficulty, duration_weeks, thumbnail_url, curriculum')
        .eq('id', id)
        .maybeSingle();

    if (template) {
        return {
            id: template.id,
            title: template.title,
            creator: template.creator,
            description: template.description || "",
            difficulty: template.difficulty || "intermediate",
            durationWeeks: template.duration_weeks || 8,
            thumbnailUrl: template.thumbnail_url,
            stats: {
                volume: 'High',
                frequency: '5 days/week',
                focus: 'Hypertrophy & CNS Optimization'
            },
            curriculum: template.curriculum || []
        };
    }

    // Fallback for mock IDs
    const mockPrograms: Record<string, any> = {
        'sadik-abs': {
            id: 'sadik-abs',
            title: "Abs Destruction",
            creator: "Sadik Hadzovic",
            description: "Carve a legendary core with Sadik's high-volume circuit training.",
            difficulty: 'advanced',
            durationWeeks: 4,
            stats: { volume: 'Extreme', frequency: 'Daily (Add-on)', focus: 'Core Density' }
        },
        'aj-formula': {
            id: 'aj-formula',
            title: "The Secret Formula",
            creator: "AJ Ellison",
            description: "AJ Ellison's blueprint for a world-class physique focusing on symmetry.",
            difficulty: 'intermediate',
            durationWeeks: 12,
            stats: { volume: 'Moderate', frequency: '4 days/week', focus: 'Total Transformation' }
        }
    };

    return mockPrograms[id] || null;
}

// ============================================================================
// NEW API FUNCTIONS FOR PERSISTENCE
// ============================================================================

export async function getGeneratedWorkouts(): Promise<any[]> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return [];

    const { data: workouts, error } = await supabase
        .from('generated_workouts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

    handleSupabaseError(error);

    return workouts || [];
}

export async function saveGeneratedWorkout(workout: {
    title: string;
    description?: string;
    exercises: any[];
    stats: {
        duration?: number;
        volume?: number;
        intensity?: string;
        calories?: number;
    };
    prompt?: string;
    insight?: string;
    tags?: string[];
    muscleGroups?: string[];
}): Promise<string> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
        .from('generated_workouts')
        .insert({
            user_id: user.id,
            title: workout.title,
            description: workout.description,
            exercises: workout.exercises,
            estimated_duration: workout.stats.duration,
            total_volume: workout.stats.volume,
            cns_intensity: workout.stats.intensity,
            estimated_calories: workout.stats.calories,
            generation_prompt: workout.prompt,
            spark_insight: workout.insight,
            tags: workout.tags || [],
            muscle_groups: workout.muscleGroups || []
        })
        .select('id')
        .single();

    handleSupabaseError(error);

    if (!data) throw new Error('Failed to save generated workout');

    return data.id;
}

export async function getUserProgramSubscriptions(): Promise<string[]> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return [];

    const { data: subscriptions, error } = await supabase
        .from('program_subscriptions')
        .select('program_id')
        .eq('user_id', user.id);

    handleSupabaseError(error);

    return subscriptions?.map(s => s.program_id) || [];
}

export async function subscribeToProgram(programId: string): Promise<void> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error('User not authenticated');

    const { error } = await supabase
        .from('program_subscriptions')
        .insert({
            user_id: user.id,
            program_id: programId
        });

    handleSupabaseError(error);
}
