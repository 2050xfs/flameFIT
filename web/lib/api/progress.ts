import { ProgressData } from "../types";
import { createClient } from "../supabase/server";
import { handleSupabaseError } from "./base";

export const getProgressData = async (): Promise<ProgressData> => {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
        return {
            charts: { weight: [] },
            stats: [],
            photos: [],
            history: []
        };
    }

    // 1. Fetch weight history
    const { data: weightLogs, error: weightError } = await supabase
        .from('body_stats')
        .select('date, weight')
        .eq('user_id', user.id)
        .order('date', { ascending: true })
        .limit(30);

    handleSupabaseError(weightError);

    const weightChart = (weightLogs || []).map(log => ({
        date: new Date(log.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        value: Number(log.weight)
    }));

    // 2. Fetch recent stats (latest weight, latest bf)
    const { data: latestStat } = await supabase
        .from('body_stats')
        .select('weight, body_fat_pct, date')
        .eq('user_id', user.id)
        .order('date', { ascending: false })
        .limit(1)
        .maybeSingle();

    // 3. Fetch workout history and volume
    const { data: sessions, error: sessionsError } = await supabase
        .from('workout_sessions')
        .select(`
            id,
            date,
            name,
            duration,
            set_logs (
                id,
                weight,
                reps
            )
        `)
        .eq('user_id', user.id)
        .eq('status', 'completed')
        .order('date', { ascending: false })
        .limit(10);

    handleSupabaseError(sessionsError);

    const history = (sessions || []).map(session => {
        const volume = session.set_logs?.reduce((acc: number, set: any) => acc + (set.weight * set.reps), 0) || 0;
        return {
            id: session.id,
            date: new Date(session.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            title: session.name || 'Strength Session',
            volume: `${volume.toLocaleString()} lbs`,
            records: 0 // Mocked for now
        };
    });

    // 4. Calculate stats items
    const currentWeight = latestStat?.weight || 0;
    const bodyFat = latestStat?.body_fat_pct || 0;

    const stats = [
        {
            label: 'Current Weight',
            value: currentWeight.toString(),
            unit: 'lbs',
            trend: 'Last logged ' + (latestStat ? new Date(latestStat.date).toLocaleDateString() : 'never'),
            trendDir: 'up' as const
        },
        {
            label: 'Body Fat',
            value: bodyFat ? bodyFat.toString() : '--',
            unit: '%',
            trend: 'Measured via body scan',
            trendDir: 'up' as const
        },
        {
            label: 'Workouts',
            value: (sessions?.length || 0).toString(),
            unit: 'this mo',
            trend: 'Keep it up!',
            trendDir: 'up' as const
        }
    ];

    return {
        charts: {
            weight: weightChart.length > 0 ? weightChart : [
                { date: 'Initial', value: currentWeight }
            ]
        },
        stats,
        photos: [], // Still mocked as we don't have storage logic yet
        history
    };
};

