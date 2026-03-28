import React from 'react';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { CalendarDays, TrendingUp, Trophy, ChevronRight } from 'lucide-react';

export default async function ManagePlanPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center">
                <p className="text-stone-500">Sign in to manage your plan.</p>
            </div>
        );
    }

    // Fetch active program subscriptions with program info
    const { data: subscriptions } = await supabase
        .from('program_subscriptions')
        .select(`
            id,
            current_week,
            created_at,
            status,
            program_id,
            pro_programs (
                id,
                title,
                duration_weeks,
                difficulty,
                thumbnail_url
            )
        `)
        .eq('user_id', user.id)
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(5);

    // Fetch recent completed sessions (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { data: recentSessions } = await supabase
        .from('workout_sessions')
        .select('id, name, date, duration, status')
        .eq('user_id', user.id)
        .eq('status', 'completed')
        .gte('date', thirtyDaysAgo.toISOString().split('T')[0])
        .order('date', { ascending: false })
        .limit(8);

    const totalCompleted = recentSessions?.length || 0;

    return (
        <div className="max-w-3xl mx-auto space-y-8 py-6 px-4">
            {/* Header */}
            <div>
                <Link href="/workouts" className="text-xs font-bold text-stone-500 uppercase tracking-wider hover:text-orange-500 transition-colors">
                    ← Back to Lab
                </Link>
                <h1 className="text-3xl font-bold font-heading mt-2">Manage Plan</h1>
                <p className="text-stone-500 mt-1">Your active programs and recent training history.</p>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-4">
                <div className="bg-stone-100 dark:bg-stone-900 rounded-2xl p-5">
                    <p className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-1">Sessions</p>
                    <p className="text-3xl font-bold">{totalCompleted}</p>
                    <p className="text-xs text-stone-400 mt-1">last 30 days</p>
                </div>
                <div className="bg-stone-100 dark:bg-stone-900 rounded-2xl p-5">
                    <p className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-1">Programs</p>
                    <p className="text-3xl font-bold">{subscriptions?.length || 0}</p>
                    <p className="text-xs text-stone-400 mt-1">active</p>
                </div>
                <div className="bg-orange-50 dark:bg-orange-950/20 rounded-2xl p-5">
                    <p className="text-xs font-bold text-orange-500 uppercase tracking-wider mb-1">Streak</p>
                    <p className="text-3xl font-bold text-orange-500">{totalCompleted > 0 ? '🔥' : '—'}</p>
                    <p className="text-xs text-stone-400 mt-1">keep going</p>
                </div>
            </div>

            {/* Active Programs */}
            <section>
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-orange-500" />
                    Active Programs
                </h2>
                {subscriptions && subscriptions.length > 0 ? (
                    <div className="space-y-3">
                        {subscriptions.map((sub: any) => {
                            const program = sub.pro_programs;
                            const totalWeeks = program?.duration_weeks || 8;
                            const progress = Math.min((sub.current_week / totalWeeks) * 100, 100);
                            return (
                                <Link
                                    key={sub.id}
                                    href={`/workouts/pro/${sub.program_id}`}
                                    className="flex items-center gap-4 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-4 hover:border-orange-300 dark:hover:border-orange-700 transition-all group"
                                >
                                    {program?.thumbnail_url && (
                                        <img src={program.thumbnail_url} alt={program.title} className="w-14 h-14 rounded-xl object-cover flex-shrink-0" />
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold truncate">{program?.title || 'Program'}</p>
                                        <p className="text-xs text-stone-500 mb-2">Week {sub.current_week} of {totalWeeks}</p>
                                        <div className="h-1.5 bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-orange-500 rounded-full transition-all"
                                                style={{ width: `${progress}%` }}
                                            />
                                        </div>
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-stone-400 group-hover:text-orange-500 flex-shrink-0 transition-colors" />
                                </Link>
                            );
                        })}
                    </div>
                ) : (
                    <div className="bg-stone-100 dark:bg-stone-900 rounded-2xl p-8 text-center">
                        <p className="text-stone-500 mb-4">No active programs. Browse the Pro Library to get started.</p>
                        <Link href="/workouts" className="px-5 py-2.5 bg-stone-900 dark:bg-white text-white dark:text-stone-900 rounded-xl font-bold text-sm transition-all hover:scale-105 inline-block">
                            Browse Programs
                        </Link>
                    </div>
                )}
            </section>

            {/* Recent Sessions */}
            <section>
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <CalendarDays className="w-5 h-5 text-teal-500" />
                    Recent Sessions
                </h2>
                {recentSessions && recentSessions.length > 0 ? (
                    <div className="space-y-2">
                        {recentSessions.map((session: any) => (
                            <div key={session.id} className="flex items-center justify-between bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl px-4 py-3">
                                <div>
                                    <p className="font-medium text-sm">{session.name || 'Strength Session'}</p>
                                    <p className="text-xs text-stone-400">{new Date(session.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</p>
                                </div>
                                <div className="text-right">
                                    <span className="text-xs font-bold text-teal-500 bg-teal-50 dark:bg-teal-950/30 px-2 py-1 rounded-lg">
                                        {session.duration ? `${session.duration} min` : 'Done'}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-stone-100 dark:bg-stone-900 rounded-2xl p-6 text-center">
                        <p className="text-stone-500 text-sm">No completed sessions in the last 30 days.</p>
                    </div>
                )}
            </section>
        </div>
    );
}
