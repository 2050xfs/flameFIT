import { DashboardProps } from "@/lib/types";
import { createClient } from "@/lib/supabase/server";
import { handleSupabaseError } from "./base";

type DashboardData = Omit<DashboardProps, 'onStartWorkout' | 'onLogMeal' | 'onViewDetails'>;

// Default macro targets based on typical active male (will be overridden by user profile)
const getDefaultMacroTargets = (weight?: number) => {
    // If we have weight, use a simple formula: ~35 cal/kg, 2g protein/kg
    const baseWeight = weight || 75; // default 75kg
    return {
        calories: Math.round(baseWeight * 35),
        protein: Math.round(baseWeight * 2),
        carbs: Math.round(baseWeight * 4),
        fats: Math.round(baseWeight * 1)
    };
};

const getEmptyDashboard = (macroTargets: ReturnType<typeof getDefaultMacroTargets>): DashboardData => ({
    readiness: {
        score: 70,
        status: 'High Readiness',
        message: 'Log your meals and workouts to personalize today\'s readiness.'
    },
    macros: {
        calories: { current: 0, target: macroTargets.calories },
        protein: { current: 0, target: macroTargets.protein },
        carbs: { current: 0, target: macroTargets.carbs },
        fats: { current: 0, target: macroTargets.fats }
    },
    water: { current: 0, target: 8 },
    timeline: []
});

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
    const defaultTargets = getDefaultMacroTargets();

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        return getEmptyDashboard(defaultTargets);
    }

    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
        console.warn("No user found for dashboard, returning empty state");
        return getEmptyDashboard(defaultTargets);
    }

    const today = new Date().toISOString().split('T')[0];

    // Fetch user profile for weight and macro targets
    const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('weight, preferences')
        .eq('id', user.id)
        .single();

    if (profileError) {
        console.warn("Error fetching profile, using defaults:", profileError.message);
    }

    // Use profile weight for default calculation, or fall back to generic default
    const macroTargets = getDefaultMacroTargets(profile?.weight || undefined);

    // Fetch data with error handling
    const [logsResult, sessionsResult, waterResult] = await Promise.all([
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
            .eq('date', today),
        supabase
            .from('water_logs')
            .select('amount')
            .eq('user_id', user.id)
            .eq('date', today)
            .maybeSingle()
    ]);

    // Handle errors globally for the dashboard
    handleSupabaseError(logsResult.error);
    handleSupabaseError(sessionsResult.error);
    // waterResult.error is ignored if it's just 'not found' which maybeSingle handles

    const logs = (logsResult?.data || []) as any[];
    const sessions = (sessionsResult?.data || []) as any[];
    const waterLog = waterResult?.data as { amount: number } | null;

    const macroTotals = { calories: 0, protein: 0, carbs: 0, fats: 0 };
    const timelineEntries: Array<DashboardProps['timeline'][number] & { sortKey: string }> = [];

    if (logs) {
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
                    logCalories += (food.calories || 0) * quantity;
                    logProtein += (food.protein || 0) * quantity;
                    logCarbs += (food.carbs || 0) * quantity;
                    logFats += (food.fats || 0) * quantity;
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

    if (sessions) {
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

    // Generate Spark Insight
    let insight: DashboardData['insight'] = null;
    const completion = profile?.weight ? 100 : 75;

    if (completion < 100) {
        insight = {
            type: 'info',
            message: `Profile Progress: ${completion}%. Spark requires your weight and height to architect precision metabolic targets.`,
            actionLabel: 'Complete Profile'
        };
    } else if (workoutActive) {
        insight = {
            type: 'info',
            message: "Training session active. Intensity is looking high—stay focused on the eccentric phase.",
            actionLabel: 'Resume Session'
        };
    } else if (macroCompletion < 0.5 && new Date().getHours() > 18) {
        insight = {
            type: 'warning',
            message: "Anabolic window alert: You're lagging on fuel. Spark suggests a high-protein intake now.",
            actionLabel: 'Log Protein'
        };
    } else if (workoutCompleted) {
        insight = {
            type: 'success',
            message: "Session protocol executed. Volume tracked. Metrics indicate a localized recovery phase is optimal.",
            actionLabel: 'View Performance'
        };
    } else {
        insight = {
            type: 'info',
            message: "Operational readiness high. Program 'Apex Predator' session is loaded and primed.",
            actionLabel: 'Start Training'
        };
    }

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
        water: {
            current: waterLog?.amount || 0,
            target: 8
        },
        timeline: timelineEntries.map(({ sortKey, ...entry }) => entry),
        insight
    };
}
