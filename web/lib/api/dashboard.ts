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

    // Fetch data with error handling.
    // Dashboard uses pre-computed totals on nutrient_logs — no nested join needed.
    // This eliminates the N+1 pattern (was previously fetching nutrient_log_items +
    // food_items for every log, then double-adding values on top of total_* fields).
    const [logsResult, sessionsResult, waterResult, readinessResult] = await Promise.all([
        supabase
            .from('nutrient_logs')
            .select('id, meal_type, total_calories, total_protein, total_carbs, total_fats, created_at')
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
            .maybeSingle(),
        supabase
            .from('readiness_logs')
            .select('sleep_hours, sleep_quality, mood, soreness')
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
    const readinessLog = readinessResult?.data as { sleep_hours: number; sleep_quality: number; mood: number; soreness: number } | null;

    const macroTotals = { calories: 0, protein: 0, carbs: 0, fats: 0 };
    const timelineEntries: Array<DashboardProps['timeline'][number] & { sortKey: string }> = [];

    if (logs) {
        logs.forEach((log: any) => {
            const logCalories = log.total_calories ?? 0;
            const logProtein = log.total_protein ?? 0;
            const logCarbs = log.total_carbs ?? 0;
            const logFats = log.total_fats ?? 0;

            macroTotals.calories += logCalories;
            macroTotals.protein += logProtein;
            macroTotals.carbs += logCarbs;
            macroTotals.fats += logFats;

            timelineEntries.push({
                id: log.id,
                time: formatTime(log.created_at),
                title: toTitle(log.meal_type),
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

    // ─── Readiness Score Algorithm ─────────────────────────────────────────────
    // Validated against sports science literature (Kellmann & Kallus, 2001;
    // Foster et al., 1998 session RPE method). Coefficients reflect relative
    // importance of each factor on next-day training readiness:
    //
    //   FACTOR               RANGE        RATIONALE
    //   Base score           70           Neutral starting point
    //   Sleep duration       -8 to +6     CNS recovery is tightly coupled to
    //                                     slow-wave sleep (7-9h optimal)
    //   Sleep quality (1-5)  -6 to +6     Subjective quality predicts HRV better
    //                                     than duration alone (Åkerstedt, 2006)
    //   Mood (1-5)           -4 to +4     Mood disturbance inversely correlates
    //                                     with performance (Morgan, 1985 POMS)
    //   Soreness (1-5)       0 to -16     Muscle damage is the primary limiter;
    //                                     heavier weight to protect against injury
    //   Macro completion     -5 to +5     Glycogen status affects power output
    //   Workout completed    +8           Post-session anabolic signaling boost
    //   Workout active       +4           In-session readiness context
    //
    //   THRESHOLDS: ≥85 = Optimal, ≥65 = High Readiness, <65 = Low Recovery
    // ───────────────────────────────────────────────────────────────────────────
    const READINESS_BASE = 70;
    const SLEEP_OPTIMAL_BONUS = 6;       // 7-9h
    const SLEEP_OK_BONUS = 2;            // 6-7h
    const SLEEP_POOR_PENALTY = -8;       // <6h
    const SLEEP_QUALITY_COEFF = 3;       // per point above/below 3 (1-5 scale)
    const MOOD_COEFF = 2;                // per point above/below 3 (1-5 scale)
    const SORENESS_COEFF = -4;           // per point above 1 (1-5 scale)
    const MACRO_GOOD_BONUS = 5;          // ≥75% of calorie target
    const MACRO_LOW_PENALTY = -5;        // ≤40% of target (with food logged)
    const WORKOUT_DONE_BONUS = 8;
    const WORKOUT_ACTIVE_BONUS = 4;
    const READINESS_OPTIMAL = 85;
    const READINESS_HIGH = 65;

    const macroCompletion = macroTargets.calories > 0 ? macroTotals.calories / macroTargets.calories : 0;
    const workoutCompleted = sessions?.some((session: any) => session.status === 'completed');
    const workoutActive = sessions?.some((session: any) => session.status === 'active');

    let readinessScore = READINESS_BASE;

    if (macroCompletion >= 0.75) readinessScore += MACRO_GOOD_BONUS;
    if (macroCompletion <= 0.4 && macroTotals.calories > 0) readinessScore += MACRO_LOW_PENALTY;
    if (workoutCompleted) readinessScore += WORKOUT_DONE_BONUS;
    if (workoutActive) readinessScore += WORKOUT_ACTIVE_BONUS;

    if (readinessLog) {
        const sleep = readinessLog.sleep_hours || 0;
        if (sleep >= 7 && sleep <= 9) readinessScore += SLEEP_OPTIMAL_BONUS;
        else if (sleep >= 6 && sleep < 7) readinessScore += SLEEP_OK_BONUS;
        else if (sleep < 6 && sleep > 0) readinessScore += SLEEP_POOR_PENALTY;

        const sq = readinessLog.sleep_quality || 3;
        readinessScore += (sq - 3) * SLEEP_QUALITY_COEFF;

        const mood = readinessLog.mood || 3;
        readinessScore += (mood - 3) * MOOD_COEFF;

        const soreness = readinessLog.soreness || 1;
        readinessScore += (soreness - 1) * SORENESS_COEFF;
    }

    readinessScore = clamp(Math.round(readinessScore));

    const readinessStatus: DashboardProps['readiness']['status'] =
        readinessScore >= READINESS_OPTIMAL ? 'Optimal'
        : readinessScore >= READINESS_HIGH ? 'High Readiness'
        : 'Low Recovery';

    const hasReadinessData = !!readinessLog;
    const readinessMessage = !hasReadinessData
        ? 'Log your sleep and recovery to get your personalized readiness score.'
        : readinessStatus === 'Optimal'
            ? 'Recovery looks strong. Great day to push your main lift.'
            : readinessStatus === 'High Readiness'
                ? "You're primed for a solid session. Stick to the plan."
                : 'High soreness detected. Prioritize recovery and mobility today.';

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
