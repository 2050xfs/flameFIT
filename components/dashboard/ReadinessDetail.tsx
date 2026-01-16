import React from 'react'
import type { ReadinessData } from '@/../product/sections/dashboard/types'

interface ReadinessDetailProps {
    readiness: ReadinessData
    onBack: () => void
}

export function ReadinessDetail({ readiness, onBack }: ReadinessDetailProps) {
    // Mock data for the chart, in a real app this would likely be passed in
    const weeklyTrends = [65, 70, 72, 85, 82, 85, 85]
    const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right duration-500">
            <button
                onClick={onBack}
                className="flex items-center text-sm font-medium text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
            >
                ← Back to Dashboard
            </button>

            <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-8 text-center relative overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-orange-500 blur-[80px] opacity-20 pointer-events-none" />

                <h2 className="relative text-sm font-bold uppercase tracking-widest text-stone-500 mb-4">Recovery Score</h2>
                <div className="relative inline-flex items-center justify-center">
                    <svg className="w-48 h-48 transform -rotate-90">
                        <circle cx="96" cy="96" r="88" fill="none" stroke="currentColor" strokeWidth="12" className="text-stone-100 dark:text-stone-800" />
                        <circle cx="96" cy="96" r="88" fill="none" stroke="currentColor" strokeWidth="12" className="text-orange-500 drop-shadow-lg" strokeDasharray={2 * Math.PI * 88} strokeDashoffset={2 * Math.PI * 88 * (1 - readiness.score / 100)} strokeLinecap="round" />
                    </svg>
                    <span className="absolute text-5xl font-bold font-heading text-stone-900 dark:text-white">{readiness.score}</span>
                </div>

                <div className="relative mt-6 max-w-md mx-auto">
                    <h3 className="text-xl font-bold text-stone-900 dark:text-white mb-2">{readiness.status}</h3>
                    <p className="text-stone-600 dark:text-stone-400 leading-relaxed">{readiness.message}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-6">
                    <h3 className="font-bold text-stone-900 dark:text-white mb-4">Breaking Down Your Score</h3>
                    <div className="space-y-4">
                        <MetricRow label="Sleep Quality" score="92%" status="Excellent" />
                        <MetricRow label="HRV Status" score="42ms" status="Balanced" />
                        <MetricRow label="Resting HR" score="54bpm" status="Good" />
                        <MetricRow label="Training Load" score="High" status="Warning" />
                    </div>
                </div>

                <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-6">
                    <h3 className="font-bold text-stone-900 dark:text-white mb-4">Weekly Trend</h3>
                    <div className="flex items-end justify-between h-48 pt-4">
                        {weeklyTrends.map((val, i) => (
                            <div key={i} className="flex flex-col items-center gap-2">
                                <div className="w-8 bg-orange-100 dark:bg-orange-900/20 rounded-t-lg relative group">
                                    <div
                                        style={{ height: `${val}%` }}
                                        className="w-full bg-orange-500 rounded-t-lg transition-all duration-1000 group-hover:bg-orange-400"
                                    />
                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-stone-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                        {val}
                                    </div>
                                </div>
                                <span className="text-xs font-bold text-stone-400">{days[i]}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

function MetricRow({ label, score, status }: { label: string, score: string, status: string }) {
    const getColor = (s: string) => {
        if (s === 'Excellent' || s === 'Good') return 'text-teal-500'
        if (s === 'Warning') return 'text-amber-500'
        return 'text-stone-500'
    }

    return (
        <div className="flex items-center justify-between p-3 bg-stone-50 dark:bg-stone-800/50 rounded-xl">
            <span className="text-sm font-medium text-stone-600 dark:text-stone-300">{label}</span>
            <div className="text-right">
                <div className="text-sm font-bold text-stone-900 dark:text-white">{score}</div>
                <div className={`text-[10px] font-bold uppercase ${getColor(status)}`}>{status}</div>
            </div>
        </div>
    )
}
