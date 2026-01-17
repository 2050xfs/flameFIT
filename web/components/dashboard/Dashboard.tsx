import React from 'react'
import type { DashboardProps } from '@/lib/types'

export function Dashboard({
    readiness,
    macros,
    timeline,
    onStartWorkout,
    onLogMeal,
    onViewDetails
}: DashboardProps) {

    return (
        <div className="space-y-8 animate-in fade-in duration-500">

            {/* Header / Readiness */}
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <div className="w-32 h-32 rounded-full bg-orange-500 blur-2xl"></div>
                    </div>

                    <div className="flex flex-col items-center justify-center py-4">
                        {/* Readiness Ring */}
                        <div className="relative w-40 h-40">
                            <svg className="w-full h-full transform -rotate-90">
                                {/* Background Ring */}
                                <circle cx="80" cy="80" r="70" fill="none" stroke="currentColor" strokeWidth="12" className="text-stone-100 dark:text-stone-800" />
                                {/* Progress Ring */}
                                <circle
                                    cx="80"
                                    cy="80"
                                    r="70"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="12"
                                    className="text-orange-500"
                                    strokeDasharray={2 * Math.PI * 70}
                                    strokeDashoffset={2 * Math.PI * 70 * (1 - readiness.score / 100)}
                                    strokeLinecap="round"
                                />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-4xl font-bold font-heading text-stone-900 dark:text-white">{readiness.score}</span>
                                <span className="text-xs font-bold uppercase text-stone-400">Readiness</span>
                            </div>
                        </div>

                        <div className="mt-4 text-center">
                            <div className="inline-flex items-center px-3 py-1 rounded-full bg-orange-100 dark:bg-orange-500/20 text-orange-700 dark:text-orange-300 text-xs font-bold uppercase mb-2">
                                {readiness.status}
                            </div>
                            <p className="text-sm text-stone-600 dark:text-stone-400 max-w-[200px] leading-relaxed mx-auto">{readiness.message}</p>
                        </div>
                    </div>
                </div>

                {/* Action Grid */}
                <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button
                        onClick={() => onStartWorkout?.('next')}
                        className="relative h-full bg-gradient-to-br from-orange-500 to-rose-600 rounded-3xl p-8 text-left flex flex-col justify-end overflow-hidden group hover:shadow-xl hover:shadow-orange-500/25 transition-all transform hover:-translate-y-1"
                    >
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 blur-3xl rounded-full -mr-16 -mt-16 pointer-events-none" />
                        <div className="relative z-10">
                            <span className="inline-block p-3 bg-white/20 rounded-xl text-white mb-4 backdrop-blur-md">💪</span>
                            <span className="block text-white font-bold text-3xl font-heading mb-1">Start Workout</span>
                            <span className="block text-orange-100 text-sm font-medium">Push Day (Hypertrophy) • 60 min</span>
                        </div>
                    </button>

                    <button
                        onClick={() => onLogMeal?.()}
                        className="relative h-full bg-stone-100 dark:bg-stone-800 rounded-3xl p-8 text-left flex flex-col justify-end hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors group"
                    >
                        <div className="absolute top-0 right-0 w-48 h-48 bg-stone-300 dark:bg-stone-600 opacity-20 blur-3xl rounded-full -mr-10 -mt-10 pointer-events-none" />
                        <div className="relative z-10">
                            <span className="inline-block p-3 bg-white dark:bg-stone-700 rounded-xl text-stone-900 dark:text-white mb-4 shadow-sm">🥑</span>
                            <span className="block text-stone-900 dark:text-white font-bold text-3xl font-heading mb-1">Quick Add</span>
                            <span className="block text-stone-500 dark:text-stone-400 text-sm font-medium">Track meal or scan barcode</span>
                        </div>
                    </button>
                </div>
            </section>

            {/* Macro Rings */}
            <section>
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-stone-900 dark:text-white font-heading">Nutrition Target</h3>
                    <button
                        onClick={() => onLogMeal?.()}
                        className="text-sm text-orange-500 hover:text-orange-600 font-medium font-mono hover:underline"
                    >
                        View Details →
                    </button>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <MacroRing label="Calories" current={macros.calories.current} target={macros.calories.target} color="text-stone-500" unit="kcal" />
                    <MacroRing label="Protein" current={macros.protein.current} target={macros.protein.target} color="text-rose-500" unit="g" />
                    <MacroRing label="Carbs" current={macros.carbs.current} target={macros.carbs.target} color="text-amber-500" unit="g" />
                    <MacroRing label="Fats" current={macros.fats.current} target={macros.fats.target} color="text-teal-500" unit="g" />
                </div>
            </section>

            {/* Timeline */}
            <section>
                <h3 className="text-xl font-bold text-stone-900 dark:text-white font-heading mb-6">Today's Schedule</h3>
                <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-8">
                    {timeline.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="text-6xl mb-4">📅</div>
                            <h4 className="text-lg font-bold text-stone-900 dark:text-white mb-2">Nothing Scheduled</h4>
                            <p className="text-sm text-stone-500 dark:text-stone-400 mb-6">
                                Your day is wide open. Add a workout or meal to get started.
                            </p>
                            <div className="flex gap-3 justify-center">
                                <button
                                    onClick={() => onStartWorkout?.('next')}
                                    className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-medium transition-colors"
                                >
                                    Schedule Workout
                                </button>
                                <button
                                    onClick={() => onLogMeal?.()}
                                    className="px-4 py-2 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-900 dark:text-white rounded-lg text-sm font-medium transition-colors"
                                >
                                    Log Meal
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-8">
                            {timeline.map((item, index) => (
                            <div key={item.id} className="group flex gap-6 relative">
                                {/* Vertical Line */}
                                {index !== timeline.length - 1 && (
                                    <div className="absolute left-[19px] top-10 bottom-[-32px] w-0.5 bg-stone-100 dark:bg-stone-800 group-hover:bg-orange-100 dark:group-hover:bg-orange-900/30 transition-colors" />
                                )}

                                {/* Time Column */}
                                <div className="flex flex-col items-center min-w-[40px]">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all z-10 ${item.status === 'completed' ? 'bg-orange-500 border-orange-500 text-white' :
                                        item.status === 'upcoming' ? 'bg-white dark:bg-stone-900 border-orange-500 text-orange-500' :
                                            'bg-stone-100 dark:bg-stone-800 border-transparent text-stone-400'
                                        }`}>
                                        {item.type === 'workout' ? '⚡️' : '🍎'}
                                    </div>
                                </div>

                                {/* Content Card */}
                                <button
                                    onClick={() => onViewDetails?.(item.id)}
                                    className="flex-1 bg-stone-50 dark:bg-stone-800/50 rounded-2xl p-5 hover:bg-white dark:hover:bg-stone-800 border border-transparent hover:border-stone-200 dark:hover:border-stone-700 shadow-sm hover:shadow-md transition-all text-left cursor-pointer"
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="text-xs font-bold uppercase tracking-wider text-stone-400">{item.time}</span>
                                        <span className={`text-xs font-bold uppercase ${item.status === 'completed' ? 'text-teal-500' :
                                            item.status === 'upcoming' ? 'text-orange-500' : 'text-stone-400'
                                            }`}>{item.status}</span>
                                    </div>
                                    <h4 className="text-lg font-bold text-stone-900 dark:text-white mb-1">{item.title}</h4>
                                    <p className="text-sm text-stone-500 dark:text-stone-400">{item.details}</p>
                                </button>
                            </div>
                        ))}
                        </div>
                    )}
                </div>
            </section>
        </div>
    )
}

function MacroRing({ label, current, target, color, unit }: { label: string, current: number, target: number, color: string, unit: string }) {
    const hasTarget = target > 0
    const percentage = hasTarget ? Math.min((current / target) * 100, 100) : 0

    return (
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-5 flex flex-col items-center justify-center hover:border-orange-200 dark:hover:border-orange-900/30 transition-colors">
            <div className="relative w-24 h-24 mb-3">
                <svg className="w-full h-full transform -rotate-90">
                    <circle cx="48" cy="48" r="40" fill="none" stroke="currentColor" strokeWidth="8" className="text-stone-100 dark:text-stone-800" />
                    <circle
                        cx="48"
                        cy="48"
                        r="40"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="8"
                        className={color}
                        strokeDasharray={2 * Math.PI * 40}
                        strokeDashoffset={2 * Math.PI * 40 * (1 - percentage / 100)}
                        strokeLinecap="round"
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-xs font-medium text-stone-400">{label}</span>
                </div>
            </div>
            <div className="text-center">
                <span className="text-lg font-bold text-stone-900 dark:text-white font-heading block">{current}</span>
                {hasTarget ? (
                    <span className="text-xs text-stone-400">/ {target}{unit}</span>
                ) : (
                    <span className="text-xs font-semibold text-orange-500">Set goal</span>
                )}
            </div>
        </div>
    )
}
