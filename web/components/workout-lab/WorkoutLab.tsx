import React from 'react'
import type { WorkoutLabProps } from '@/lib/types'
import { WorkoutCard } from './WorkoutCard'
import { ProProgramLibrary } from './ProProgramLibrary'
import { Zap, Sparkles, ChevronRight } from 'lucide-react'

export function WorkoutLab({
    currentPlan,
    weeklySchedule,
    todaysWorkout,
    upcomingWorkouts,
    onStartWorkout,
    onViewDetails,
    proPrograms = [],
    customWorkouts = [],
    onSubscribeToProgram,
    onBrowseLibrary,
    onManagePlan,
    onCreateCustomWorkout,
    onViewProProgram
}: WorkoutLabProps) {
    return (
        <div className="space-y-12 animate-in fade-in duration-500">

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
                    <button
                        onClick={onBrowseLibrary}
                        className="px-4 py-2 bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 rounded-xl font-bold text-sm hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors"
                    >
                        Library
                    </button>
                    <button
                        onClick={onManagePlan}
                        className="px-4 py-2 bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 rounded-xl font-bold text-sm hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors"
                    >
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
                {todaysWorkout ? (
                    <>
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
                    </>
                ) : (
                    <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-12 text-center">
                        <div className="text-6xl mb-4">🧘</div>
                        <h3 className="text-2xl font-bold font-heading text-stone-900 dark:text-white mb-2">Rest Day</h3>
                        <p className="text-stone-500 dark:text-stone-400 mb-6 max-w-md mx-auto">
                            Recovery is just as important as training. Take today to let your muscles rebuild stronger.
                        </p>
                        <div className="flex gap-3 justify-center">
                            <button
                                onClick={onBrowseLibrary}
                                className="px-6 py-3 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-900 dark:text-white rounded-xl font-medium transition-colors"
                            >
                                Browse Library
                            </button>
                            <button
                                onClick={onCreateCustomWorkout}
                                className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-medium transition-colors"
                            >
                                Create Custom Workout
                            </button>
                        </div>
                    </div>
                )}
            </section>

            {/* Spark Architectures (Custom Workouts) */}
            <section className="animate-in slide-in-from-bottom-4 duration-700">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/20">
                            <Zap className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-stone-900 dark:text-white font-heading tracking-tight">Spark Architectures</h3>
                            <p className="text-stone-500 dark:text-stone-400 text-xs font-bold uppercase tracking-widest">Custom protocols generated for your biometrics</p>
                        </div>
                    </div>
                </div>

                {customWorkouts && customWorkouts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {customWorkouts.map(workout => (
                            <div key={workout.id} className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-6 rounded-3xl hover:border-orange-500/30 transition-all group cursor-pointer relative overflow-hidden h-full flex flex-col">
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-100 transition-opacity">
                                    <Sparkles className="w-12 h-12 text-orange-500" />
                                </div>

                                <div className="mb-4">
                                    <span className="text-[10px] font-black text-orange-500 uppercase tracking-[0.2em] mb-1 block">Optimal Protocol</span>
                                    <h4 className="text-xl font-bold text-stone-900 dark:text-white font-heading leading-tight">{workout.name}</h4>
                                </div>

                                <div className="flex flex-wrap gap-1.5 mb-6">
                                    {workout.muscles?.map((m: string) => (
                                        <span key={m} className="px-2 py-0.5 bg-stone-100 dark:bg-stone-800 text-stone-500 dark:text-stone-400 text-[9px] font-bold rounded-lg uppercase tracking-wider">{m}</span>
                                    ))}
                                </div>

                                <div className="mt-auto flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-stone-50 dark:bg-stone-800 flex items-center justify-center border border-stone-100 dark:border-stone-700">
                                            <Zap className="w-3.5 h-3.5 text-orange-500" />
                                        </div>
                                        <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">{workout.difficulty}</span>
                                    </div>
                                    <button className="p-3 bg-stone-900 dark:bg-white text-white dark:text-stone-900 rounded-xl group-hover:bg-orange-500 group-hover:text-white transition-all shadow-lg shadow-stone-900/10 active:scale-95">
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white dark:bg-stone-900/50 border-2 border-dashed border-stone-200 dark:border-stone-800 rounded-[2.5rem] p-12 text-center">
                        <div className="w-16 h-16 bg-stone-100 dark:bg-stone-800 rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <Sparkles className="w-8 h-8 text-stone-300 dark:text-stone-600" />
                        </div>
                        <h4 className="text-lg font-bold text-stone-900 dark:text-white mb-2 font-heading">No Custom Architectures Yet</h4>
                        <p className="text-stone-500 dark:text-stone-400 text-sm max-w-sm mx-auto mb-6">
                            Ask Spark to "Build me a workout protocol" to see your personalized training architectures here.
                        </p>
                        <button
                            onClick={onCreateCustomWorkout}
                            className="px-6 py-3 bg-stone-900 dark:bg-white text-white dark:text-stone-900 rounded-xl font-bold text-xs uppercase tracking-widest hover:opacity-90 transition-all shadow-lg"
                        >
                            Open Curator
                        </button>
                    </div>
                )}
            </section>

            {/* Pro Collection */}
            <ProProgramLibrary
                programs={proPrograms}
                onSubscribe={onSubscribeToProgram}
                onViewDetails={onViewProProgram}
            />

            {/* Upcoming */}
            {upcomingWorkouts.length > 0 && (
                <section>
                    <h3 className="text-lg font-bold text-stone-900 dark:text-white font-heading mb-4">On Deck</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {upcomingWorkouts.map(workout => (
                            <div key={workout.id} className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-6 rounded-2xl flex items-center justify-between group hover:border-orange-200 dark:hover:border-orange-900 transition-all hover:translate-x-1 cursor-pointer" onClick={() => onViewDetails?.(workout.id)}>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-100 dark:border-stone-700 flex items-center justify-center text-lg font-bold text-stone-300 group-hover:text-orange-500 transition-colors">
                                        {workout.date?.substring(0, 2) || '??'}
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
            )}
        </div>
    )
}
