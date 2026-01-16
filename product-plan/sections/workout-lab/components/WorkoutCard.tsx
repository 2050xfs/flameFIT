import React from 'react'
import type { WorkoutDetail } from '@/../product/sections/workout-lab/types'

interface WorkoutCardProps {
    workout: WorkoutDetail
    isActive?: boolean
    onStart?: () => void
    onView?: () => void
}

export function WorkoutCard({ workout, isActive, onStart, onView }: WorkoutCardProps) {
    return (
        <div className={`relative overflow-hidden rounded-3xl p-6 md:p-8 transition-all ${isActive
            ? 'bg-stone-900 dark:bg-white text-white dark:text-stone-900 shadow-xl'
            : 'bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800'
            }`}>
            {/* Background Decoration */}
            {isActive && (
                <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-gradient-to-br from-orange-500 to-rose-600 rounded-full blur-3xl opacity-20 dark:opacity-30 pointer-events-none" />
            )}

            <div className="relative z-10 flex flex-col md:flex-row gap-8 justify-between">
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                        <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${isActive ? 'bg-orange-500 text-white' : 'bg-stone-100 text-stone-600'
                            }`}>
                            {workout.intensity} Intensity
                        </span>
                        <span className="text-sm font-medium opacity-70">{workout.duration}</span>
                    </div>

                    <h3 className="text-3xl font-bold font-heading mb-4 leading-tight">{workout.title}</h3>

                    <div className="flex flex-wrap gap-2 mb-6">
                        {workout.muscles.map(m => (
                            <span key={m} className={`text-xs px-2 py-1 rounded border ${isActive
                                ? 'border-white/20 bg-white/5'
                                : 'border-stone-200 bg-stone-50 text-stone-500'
                                }`}>
                                {m}
                            </span>
                        ))}
                    </div>

                    {/* Exercise Preview */}
                    <div className="space-y-2 mb-6 opacity-90">
                        {workout.exercises.slice(0, 3).map((ex, i) => (
                            <div key={i} className="flex items-center justify-between text-sm py-1 border-b border-white/10 last:border-0">
                                <span>{ex.name}</span>
                                <span className="font-mono text-xs">{ex.sets} x {ex.reps}</span>
                            </div>
                        ))}
                        {workout.exercises.length > 3 && (
                            <div className="text-xs pt-1 opacity-60">+{workout.exercises.length - 3} more exercises</div>
                        )}
                    </div>
                </div>

                <div className="flex flex-col justify-end gap-3 min-w-[200px]">
                    <button
                        onClick={onStart}
                        className="w-full py-4 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold text-lg shadow-lg shadow-orange-500/25 transition-all transform active:scale-95"
                    >
                        Start Workout
                    </button>
                    <button
                        onClick={onView}
                        className={`w-full py-3 rounded-xl font-medium text-sm transition-colors ${isActive
                            ? 'bg-white/10 hover:bg-white/20 text-white dark:text-stone-900 border border-white/10'
                            : 'bg-stone-50 hover:bg-stone-100 text-stone-600'
                            }`}
                    >
                        View Details
                    </button>
                </div>
            </div>
        </div>
    )
}
