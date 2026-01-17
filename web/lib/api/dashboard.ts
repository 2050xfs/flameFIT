import { DashboardProps } from "@/lib/types";
import { createClient } from "@/lib/supabase/server";

type DashboardData = Omit<DashboardProps, 'onStartWorkout' | 'onLogMeal' | 'onViewDetails'>;

const macroTargets = {
    calories: 2800,
    protein: 200,
    carbs: 300,
    fats: 90
};

const emptyDashboard: DashboardData = {
    readiness: {
        score: 70,
        status: 'High Readiness',
        message: 'Log your meals and workouts to personalize today’s readiness.'
    },
    macros: {
        calories: { current: 0, target: macroTargets.calories },
        protein: { current: 0, target: macroTargets.protein },
        carbs: { current: 0, target: macroTargets.carbs },
        fats: { current: 0, target: macroTargets.fats }
    },
    timeline: []
};

const clamp = (value: number, min = 0, max = 100) => Math.min(Math.max(value, min), max);

const toTitle = (value?: string | null) => {
    if (!value) return 'Meal';
    return value.charAt(0).toUpperCase() + value.slice(1);
};

const formatTime = (value?: string | null) => {
    if (!value) return 'Today';
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return 'Today';
    return parsed.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
};

const summarizeMeal = (foodNames: string[]) => {
    if (foodNames.length === 0) return 'Meal logged';
    if (foodNames.length === 1) return foodNames[0];
    return `${foodNames[0]} + ${foodNames.length - 1} more`;
};

export async function getDashboardData(): Promise<DashboardData> {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        return emptyDashboard;
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return emptyDashboard;
    }

    const today = new Date().toISOString().split('T')[0];

    const [{ data: logs, error: logsError }, { data: sessions, error: sessionsError }] = await Promise.all([
        supabase
            .from('nutrient_logs')
            .select(`
                id,
                meal_type,
                total_calories,
                total_protein,
                total_carbs,
                total_fats,
                created_at,
                nutrient_log_items (
                    id,
                    quantity,
                    food_items (
                        id,
                        name,
                        calories,
                        protein,
                        carbs,
                        fats
                    )
                )
            `)
            .eq('user_id', user.id)
            .eq('date', today),
        supabase
            .from('workout_sessions')
            .select('id, name, status, duration, date, created_at')
            .eq('user_id', user.id)
            .eq('date', today)
    ]);

    const macroTotals = { calories: 0, protein: 0, carbs: 0, fats: 0 };
    const timelineEntries: Array<DashboardProps['timeline'][number] & { sortKey: string }> = [];

    if (!logsError && logs) {
        logs.forEach((log: any) => {
            let logCalories = log.total_calories ?? 0;
            let logProtein = log.total_protein ?? 0;
            let logCarbs = log.total_carbs ?? 0;
            let logFats = log.total_fats ?? 0;
            const foodNames: string[] = [];

            if (log.nutrient_log_items) {
                log.nutrient_log_items.forEach((item: any) => {
                    const food = item.food_items;
                    if (!food) return;
                    const quantity = item.quantity ?? 1;
                    logCalories += food.calories * quantity;
                    logProtein += food.protein * quantity;
                    logCarbs += food.carbs * quantity;
                    logFats += food.fats * quantity;
                    foodNames.push(food.name);
                });
            }

            macroTotals.calories += logCalories;
            macroTotals.protein += logProtein;
            macroTotals.carbs += logCarbs;
            macroTotals.fats += logFats;

            timelineEntries.push({
                id: log.id,
                time: formatTime(log.created_at),
                title: summarizeMeal(foodNames) || toTitle(log.meal_type),
                type: 'meal',
                status: 'completed',
                details: `${Math.round(logCalories)} kcal · ${Math.round(logProtein)}g Protein`,
                sortKey: log.created_at || `${today}T12:00:00`
            });
        });
    }

    if (!sessionsError && sessions) {
        sessions.forEach((session: any) => {
            const status = session.status === 'completed' ? 'completed' : 'upcoming';
            const statusLabel = session.status === 'completed' ? 'Completed' : 'Scheduled';
            timelineEntries.push({
                id: session.id,
                time: formatTime(session.created_at || session.date),
                title: session.name || 'Workout Session',
                type: 'workout',
                status,
                details: session.duration ? `${statusLabel} · ${session.duration} min` : statusLabel,
                sortKey: session.created_at || `${session.date}T17:00:00`
            });
        });
    }

    const readinessBase = 70;
    const macroCompletion = macroTargets.calories > 0 ? macroTotals.calories / macroTargets.calories : 0;
    const workoutCompleted = sessions?.some((session: any) => session.status === 'completed');
    const workoutActive = sessions?.some((session: any) => session.status === 'active');

    let readinessScore = readinessBase;
    if (macroCompletion >= 0.75) readinessScore += 5;
    if (macroCompletion <= 0.4 && macroTotals.calories > 0) readinessScore -= 5;
    if (workoutCompleted) readinessScore += 8;
    if (workoutActive) readinessScore += 4;

    readinessScore = clamp(Math.round(readinessScore));

    const readinessStatus: DashboardProps['readiness']['status'] =
        readinessScore >= 85 ? 'Optimal' : readinessScore >= 70 ? 'High Readiness' : 'Low Recovery';

    const readinessMessage =
        readinessStatus === 'Optimal'
            ? 'Recovery looks strong. Great day to push your main lift.'
            : readinessStatus === 'High Readiness'
                ? 'You’re primed for a solid session. Stick to the plan.'
                : 'Dial it back and prioritize recovery work today.';

    timelineEntries.sort((a, b) => a.sortKey.localeCompare(b.sortKey));

    return {
        readiness: {
            score: readinessScore,
            status: readinessStatus,
            message: readinessMessage
        },
        macros: {
            calories: { current: Math.round(macroTotals.calories), target: macroTargets.calories },
            protein: { current: Math.round(macroTotals.protein), target: macroTargets.protein },
            carbs: { current: Math.round(macroTotals.carbs), target: macroTargets.carbs },
            fats: { current: Math.round(macroTotals.fats), target: macroTargets.fats }
        },
        timeline: timelineEntries.map(({ sortKey, ...entry }) => entry)
    };
}
