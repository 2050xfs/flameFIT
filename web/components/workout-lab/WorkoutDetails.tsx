"use client";

import React from 'react'
import type { WorkoutDetail } from '@/lib/types'

interface WorkoutDetailsProps {
    workout: WorkoutDetail
    onBack: () => void
    onStart: () => void
}

export function WorkoutDetails({ workout, onBack, onStart }: WorkoutDetailsProps) {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right duration-500">

            {/* Header */}
            <div className="relative h-64 bg-stone-900 rounded-b-3xl -mx-4 -mt-4 md:rounded-3xl md:mx-0 md:mt-0 p-8 flex flex-col justify-end overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
                {/* Abstract Muscle Art */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-rose-600 blur-[80px] opacity-40 z-0" />

                <div className="relative z-20 text-white">
                    <button onClick={onBack} className="flex items-center gap-2 mb-8 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-colors text-sm font-bold">
                        ← Back
                    </button>

                    <div className="flex gap-2 mb-3">
                        {workout.muscles.map(m => (
                            <span key={m} className="px-2 py-1 bg-white/10 backdrop-blur-sm rounded text-[10px] font-bold uppercase tracking-wider border border-white/10">
                                {m}
                            </span>
                        ))}
                    </div>
                    <h1 className="text-3xl font-bold font-heading mb-2">{workout.title}</h1>
                    <div className="flex items-center gap-4 text-sm font-medium text-stone-300">
                        <span className="flex items-center gap-1">⏱ {workout.duration}</span>
                        <span className="flex items-center gap-1">🔥 {workout.intensity} Intensity</span>
                    </div>
                </div>
            </div>

            {/* Start Button Sticky */}
            <div className="sticky top-4 z-40">
                <button
                    onClick={onStart}
                    disabled={workout.status === 'completed'}
                    className={`w-full py-4 rounded-2xl font-bold text-lg shadow-xl transition-transform active:scale-[0.98] flex items-center justify-center gap-2 ${workout.status === 'completed'
                            ? 'bg-stone-100 text-stone-400 cursor-not-allowed shadow-none'
                            : 'bg-orange-500 hover:bg-orange-600 text-white shadow-orange-500/20'
                        }`}
                >
                    <span>
                        {workout.status === 'active' ? 'Resume Session' :
                            workout.status === 'completed' ? 'Finished' : 'Start Session'}
                    </span>
                    {workout.status !== 'completed' && (
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    )}
                </button>
            </div>


            {/* Exercise List */}
            <div className="space-y-4 pb-8">
                <h3 className="text-lg font-bold text-stone-900 dark:text-white font-heading px-2">Program Design</h3>
                {workout.exercises.map((ex, i) => (
                    <div key={i} className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-5 rounded-2xl flex items-center gap-5">
                        <div className="w-12 h-12 rounded-xl bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-stone-400 font-bold text-lg border border-stone-200 dark:border-stone-700">
                            {i + 1}
                        </div>
                        <div className="flex-1">
                            <h4 className="font-bold text-stone-900 dark:text-white text-lg">{ex.name}</h4>
                            <div className="flex gap-4 mt-1 text-sm font-mono text-stone-500">
                                <span className="bg-stone-50 dark:bg-stone-800 px-2 py-0.5 rounded border border-stone-100 dark:border-stone-700">
                                    <strong className="text-stone-900 dark:text-stone-300">{ex.sets}</strong> Sets
                                </span>
                                <span className="bg-stone-50 dark:bg-stone-800 px-2 py-0.5 rounded border border-stone-100 dark:border-stone-700">
                                    <strong className="text-stone-900 dark:text-stone-300">{ex.reps}</strong> Reps
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
