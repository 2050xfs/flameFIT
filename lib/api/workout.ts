import { createClient } from "@/lib/supabase/server";
import { WorkoutLabProps, WorkoutDetail, WeeklyDay, WorkoutExercise } from "@/lib/types";

export async function getWorkoutLabData(): Promise<Omit<WorkoutLabProps, 'onStartWorkout' | 'onViewDetails'>> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Default empty state
    const defaultState = {
        currentPlan: { name: "Active Plan", week: 1 },
        weeklySchedule: [] as WeeklyDay[],
        todaysWorkout: null,
        upcomingWorkouts: [] as WorkoutDetail[]
    };

    if (!user) {
        // If no user, show default
        return defaultState;
    }

    // Fetch workout sessions (limit 10 for now)
    const { data: sessions, error } = await supabase
        .from('workout_sessions')
        .select(`
            *,
            set_logs (
                id,
                weight,
                reps,
                exercises (
                    name,
                    muscle_group
                )
            )
        `)
        .eq('user_id', user.id)
        .order('date', { ascending: false })
        .limit(10);

    if (error || !sessions) {
        return defaultState;
    }

    const today = new Date().toISOString().split('T')[0];
    let todaysWorkout: WorkoutDetail | null = null;
    const upcomingWorkouts: WorkoutDetail[] = [];
    const schedule: WeeklyDay[] = [];

    // Helper to map DB session to UI WorkoutDetail
    const mapSessionToDetail = (s: any): WorkoutDetail => {
        // Aggregate exercises
        const exerciseMap = new Map<string, WorkoutExercise>();

        if (s.set_logs) {
            s.set_logs.forEach((log: any) => {
                const exName = log.exercises?.name || 'Unknown Exercise';
                if (!exerciseMap.has(exName)) {
                    exerciseMap.set(exName, {
                        name: exName,
                        sets: 0,
                        reps: '0'
                    });
                }
                const ex = exerciseMap.get(exName)!;
                ex.sets += 1;
                // Just showing first set reps or range would be better logic, keeping simple
                ex.reps = `${log.reps}`;
            });
        }

        const uniqueMuscles = Array.from(new Set(
            s.set_logs?.map((l: any) => l.exercises?.muscle_group).filter(Boolean)
        )) as string[];

        return {
            id: s.id,
            title: s.name || 'Workout Session',
            intensity: 'Moderate', // Placeholder
            duration: `${s.duration || 60} min`,
            muscles: uniqueMuscles.length > 0 ? uniqueMuscles : ['Full Body'],
            exercises: Array.from(exerciseMap.values()),
            date: s.date
        };
    };

    sessions.forEach(s => {
        const detail = mapSessionToDetail(s);
        const sessionDate = new Date(s.date).toISOString().split('T')[0];

        if (sessionDate === today) {
            todaysWorkout = detail;
        } else if (sessionDate > today) {
            upcomingWorkouts.push(detail);
        }

        schedule.push({
            day: new Date(s.date).toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase(),
            date: new Date(s.date).getDate().toString(),
            code: 'WORK', // Just a placeholder code
            status: s.status === 'completed' ? 'completed' : 'upcoming'
        });
    });

    return {
        currentPlan: { name: "Flex Plan", week: 1 }, // Mock for now
        weeklySchedule: schedule.reverse().slice(-7), // Show last 7
        todaysWorkout,
        upcomingWorkouts
    };
}
