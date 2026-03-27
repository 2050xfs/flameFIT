import React from 'react';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { BarChart2, Zap, MessageSquare, Dumbbell } from 'lucide-react';

// OpenAI pricing per 1M tokens (approximate, April 2025)
const COST_PER_TOKEN: Record<string, number> = {
    chat: 5 / 1_000_000,           // gpt-4o input ~$5/1M
    generate_workout: 5 / 1_000_000,
    embed: 0.02 / 1_000_000,       // text-embedding-3-small
};

const MONTHLY_BUDGET = 50; // USD

interface UsageRow {
    endpoint: string;
    tokens_used: number;
    month: string;
}

export default async function ApiUsagePage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect('/login');

    const currentMonth = new Date().toISOString().slice(0, 7);

    const { data: rows } = await supabase
        .from('api_usage')
        .select('endpoint, tokens_used, month')
        .eq('user_id', user.id)
        .order('month', { ascending: false })
        .limit(30) as { data: UsageRow[] | null };

    const thisMonth = (rows || []).filter(r => r.month === currentMonth);

    const endpointIcons: Record<string, React.ReactNode> = {
        chat: <MessageSquare className="w-4 h-4" />,
        generate_workout: <Dumbbell className="w-4 h-4" />,
        embed: <Zap className="w-4 h-4" />,
    };

    const totalTokens = thisMonth.reduce((s, r) => s + r.tokens_used, 0);
    const totalCost = thisMonth.reduce((s, r) => s + r.tokens_used * (COST_PER_TOKEN[r.endpoint] ?? 5 / 1_000_000), 0);
    const budgetPct = Math.min((totalCost / MONTHLY_BUDGET) * 100, 100);

    // Group by month for history
    const byMonth = (rows || []).reduce<Record<string, UsageRow[]>>((acc, r) => {
        acc[r.month] = acc[r.month] || [];
        acc[r.month].push(r);
        return acc;
    }, {});

    return (
        <div className="max-w-2xl mx-auto py-8 px-4 space-y-8">
            <div>
                <h1 className="text-3xl font-heading font-bold text-stone-900 dark:text-white mb-1">API Usage</h1>
                <p className="text-stone-500 dark:text-stone-400">Your Spark AI token consumption for {currentMonth}.</p>
            </div>

            {/* Budget meter */}
            <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <BarChart2 className="w-5 h-5 text-orange-500" />
                        <span className="font-bold text-stone-900 dark:text-white">Monthly Budget</span>
                    </div>
                    <span className="font-mono text-sm text-stone-500">
                        ${totalCost.toFixed(2)} / ${MONTHLY_BUDGET}
                    </span>
                </div>
                <div className="w-full bg-stone-100 dark:bg-stone-800 rounded-full h-3">
                    <div
                        className={`h-3 rounded-full transition-all ${budgetPct >= 80 ? 'bg-red-500' : budgetPct >= 50 ? 'bg-yellow-500' : 'bg-orange-500'}`}
                        style={{ width: `${budgetPct}%` }}
                    />
                </div>
                <div className="flex justify-between text-xs text-stone-400">
                    <span>{totalTokens.toLocaleString()} tokens used</span>
                    <span>{budgetPct.toFixed(1)}% of budget</span>
                </div>
            </div>

            {/* This month breakdown */}
            <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl overflow-hidden">
                <div className="px-6 py-4 border-b border-stone-100 dark:border-stone-800">
                    <h2 className="font-bold text-stone-900 dark:text-white">This Month</h2>
                </div>
                {thisMonth.length === 0 ? (
                    <div className="px-6 py-10 text-center text-stone-400 text-sm">No usage logged yet this month.</div>
                ) : (
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-stone-100 dark:border-stone-800">
                                <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-stone-400">Endpoint</th>
                                <th className="px-6 py-3 text-right text-xs font-bold uppercase tracking-wider text-stone-400">Tokens</th>
                                <th className="px-6 py-3 text-right text-xs font-bold uppercase tracking-wider text-stone-400">Est. Cost</th>
                            </tr>
                        </thead>
                        <tbody>
                            {thisMonth.map(r => (
                                <tr key={r.endpoint} className="border-b border-stone-50 dark:border-stone-800/50 last:border-0">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-stone-700 dark:text-stone-300 font-medium">
                                            <span className="text-orange-500">{endpointIcons[r.endpoint] || <Zap className="w-4 h-4" />}</span>
                                            {r.endpoint}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right font-mono text-stone-600 dark:text-stone-400">
                                        {r.tokens_used.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 text-right font-mono text-stone-600 dark:text-stone-400">
                                        ${(r.tokens_used * (COST_PER_TOKEN[r.endpoint] ?? 5 / 1_000_000)).toFixed(4)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* History */}
            {Object.keys(byMonth).length > 1 && (
                <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl overflow-hidden">
                    <div className="px-6 py-4 border-b border-stone-100 dark:border-stone-800">
                        <h2 className="font-bold text-stone-900 dark:text-white">History</h2>
                    </div>
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-stone-100 dark:border-stone-800">
                                <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-stone-400">Month</th>
                                <th className="px-6 py-3 text-right text-xs font-bold uppercase tracking-wider text-stone-400">Total Tokens</th>
                                <th className="px-6 py-3 text-right text-xs font-bold uppercase tracking-wider text-stone-400">Est. Cost</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.entries(byMonth).sort(([a], [b]) => b.localeCompare(a)).map(([month, monthRows]) => {
                                const tokens = monthRows.reduce((s, r) => s + r.tokens_used, 0);
                                const cost = monthRows.reduce((s, r) => s + r.tokens_used * (COST_PER_TOKEN[r.endpoint] ?? 5 / 1_000_000), 0);
                                return (
                                    <tr key={month} className="border-b border-stone-50 dark:border-stone-800/50 last:border-0">
                                        <td className="px-6 py-4 font-mono text-stone-700 dark:text-stone-300">{month}</td>
                                        <td className="px-6 py-4 text-right font-mono text-stone-600 dark:text-stone-400">{tokens.toLocaleString()}</td>
                                        <td className="px-6 py-4 text-right font-mono text-stone-600 dark:text-stone-400">${cost.toFixed(4)}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
