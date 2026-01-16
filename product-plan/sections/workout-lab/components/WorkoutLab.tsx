import React from 'react'
import type { WorkoutLabProps } from '@/../product/sections/workout-lab/types'
import { WorkoutCard } from './WorkoutCard'

export function WorkoutLab({
    currentPlan,
    weeklySchedule,
    todaysWorkout,
    upcomingWorkouts,
    onStartWorkout,
    onViewDetails
}: WorkoutLabProps) {
    return (
        <div className="space-y-8 animate-in fade-in duration-500">

            {/* Header & Plan Info */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold font-heading text-stone-900 dark:text-white">Workout Lab</h2>
                    <p className="text-stone-500 dark:text-stone-400 mt-1 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                        {currentPlan.name} • Week {currentPlan.week}
                    </p>
                </div>
                <div className="flex gap-3">
                    <button className="px-4 py-2 bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 rounded-xl font-bold text-sm hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors">
                        Library
                    </button>
                    <button className="px-4 py-2 bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 rounded-xl font-bold text-sm hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors">
                        Manage Plan
                    </button>
                </div>
            </div>

            {/* Weekly Schedule Strip */}
            <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-1.5 rounded-2xl overflow-x-auto shadow-sm">
                <div className="flex justify-between min-w-[600px]">
                    {weeklySchedule.map((day, idx) => (
                        <div key={idx} className={`flex-1 flex flex-col items-center justify-center py-4 px-2 rounded-xl transition-all relative ${day.status === 'active'
                            ? 'bg-gradient-to-br from-orange-500 to-rose-600 text-white shadow-lg shadow-orange-500/25 scale-[1.02] z-10'
                            : day.status === 'completed'
                                ? 'bg-transparent text-stone-400'
                                : 'bg-transparent text-stone-600 dark:text-stone-400'
                            }`}>

                            {/* Status Indicator Dot */}
                            {day.status === 'completed' && (
                                <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-teal-500" />
                            )}

                            <span className="text-[10px] font-bold uppercase tracking-wider opacity-80">{day.day}</span>
                            <span className={`text-xl font-bold font-heading my-1 ${day.status === 'active' ? 'text-white' : ''}`}>{day.date}</span>
                            <span className={`text-[9px] font-mono uppercase px-1.5 py-0.5 rounded ${day.status === 'active' ? 'bg-white/20 text-white' :
                                    day.code === 'REST' ? 'bg-stone-100 dark:bg-stone-800 text-stone-400' : 'bg-stone-100 dark:bg-stone-800 text-stone-500'
                                }`}>{day.code}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Today's Workout (Featured) */}
            <section>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-stone-900 dark:text-white font-heading">Ready to Train?</h3>
                    <span className="text-xs font-bold text-orange-500 uppercase tracking-wider animate-pulse">● Live Session Available</span>
                </div>
                <WorkoutCard
                    workout={todaysWorkout}
                    isActive={true}
                    onStart={() => onStartWorkout?.(todaysWorkout.id)}
                    onView={() => onViewDetails?.(todaysWorkout.id)}
                />
            </section>

            {/* Upcoming */}
            <section>
                <h3 className="text-lg font-bold text-stone-900 dark:text-white font-heading mb-4">On Deck</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {upcomingWorkouts.map(workout => (
                        <div key={workout.id} className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-6 rounded-2xl flex items-center justify-between group hover:border-orange-200 dark:hover:border-orange-900 transition-all hover:translate-x-1 cursor-pointer" onClick={() => onViewDetails?.(workout.id)}>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-100 dark:border-stone-700 flex items-center justify-center text-lg font-bold text-stone-300 group-hover:text-orange-500 transition-colors">
                                    {workout.date.substring(0, 2)}
                                </div>
                                <div>
                                    <h4 className="font-bold text-stone-900 dark:text-white font-heading text-lg group-hover:text-orange-600 transition-colors">{workout.title}</h4>
                                    <div className="flex items-center gap-3 text-xs font-medium text-stone-500 mt-1">
                                        <span className="flex items-center gap-1">⏱ {workout.duration}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="text-stone-300 group-hover:text-orange-500 text-2xl">→</div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    )
}
