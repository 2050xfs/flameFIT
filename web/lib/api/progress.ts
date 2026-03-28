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

    // 1. Fetch weight history from weight_logs (logWeightAction writes here)
    const { data: weightLogs, error: weightError } = await supabase
        .from('weight_logs')
        .select('date, weight_kg')
        .eq('user_id', user.id)
        .order('date', { ascending: true })
        .limit(30);

    handleSupabaseError(weightError);

    const weightChart = (weightLogs || []).map(log => ({
        date: new Date(log.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        value: Number(log.weight_kg)
    }));

    // 2. Fetch recent stats from weight_logs (most recent entry)
    const { data: latestStat } = await supabase
        .from('weight_logs')
        .select('weight_kg, date')
        .eq('user_id', user.id)
        .order('date', { ascending: false })
        .limit(1)
        .maybeSingle();

    // Also check body_stats for body fat %
    const { data: latestBodyStat } = await supabase
        .from('body_stats')
        .select('body_fat_pct, date')
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
    const currentWeight = latestStat?.weight_kg || 0;
    const bodyFat = latestBodyStat?.body_fat_pct || 0;

    // Count only sessions from this calendar month
    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);
    const sessionsThisMonth = (sessions || []).filter(s => new Date(s.date) >= monthStart).length;

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
            trend: bodyFat ? 'Measured via body scan' : 'Not yet measured',
            trendDir: 'up' as const
        },
        {
            label: 'Workouts',
            value: sessionsThisMonth.toString(),
            unit: 'this mo',
            trend: sessionsThisMonth > 0 ? 'Keep it up!' : 'Start your first session',
            trendDir: 'up' as const
        }
    ];

    // 5. Fetch progress photos
    const { data: photoRows } = await supabase
        .from('progress_photos')
        .select('id, public_url, photo_date')
        .eq('user_id', user.id)
        .order('photo_date', { ascending: false })
        .limit(20);

    const photos = (photoRows || []).map((p: any) => ({
        id: p.id,
        url: p.public_url || '',
        date: p.photo_date,
    }));

    return {
        charts: {
            weight: weightChart.length > 0 ? weightChart : [
                { date: 'Initial', value: currentWeight }
            ]
        },
        stats,
        photos,
        history
    };
};

