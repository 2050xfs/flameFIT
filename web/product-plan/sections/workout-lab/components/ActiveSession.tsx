import React, { useState } from 'react'
import type { WorkoutDetail } from '@/../product/sections/workout-lab/types'

interface ActiveSessionProps {
    workout: WorkoutDetail
    onFinish: () => void
}

export function ActiveSession({ workout, onFinish }: ActiveSessionProps) {
    const [currentExerciseIdx, setCurrentExerciseIdx] = useState(0)
    const currentExercise = workout.exercises[currentExerciseIdx]

    return (
        <div className="h-[calc(100vh-100px)] flex flex-col bg-stone-950 text-white rounded-3xl overflow-hidden relative">

            {/* Immersive Background */}
            <div className="absolute inset-0 bg-gradient-to-b from-stone-900 to-black z-0" />
            <div className="absolute top-0 right-0 w-full h-1/2 bg-orange-600 blur-[120px] opacity-10 z-0" />

            {/* Header */}
            <div className="relative z-10 p-6 flex items-center justify-between border-b border-white/10">
                <div>
                    <p className="text-xs font-bold text-stone-400 uppercase tracking-wider">Active Session</p>
                    <h2 className="text-lg font-bold">{workout.title}</h2>
                </div>
                <div className="px-3 py-1 bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg text-xs font-mono font-bold animate-pulse">
                    00:12:45
                </div>
            </div>

            {/* Main Content */}
            <div className="relative z-10 flex-1 flex flex-col p-6 overflow-y-auto">
                {/* Exercise Progress */}
                <div className="flex items-center justify-between text-sm text-stone-400 mb-6">
                    <span>Exercise {currentExerciseIdx + 1} of {workout.exercises.length}</span>
                    <span>Next: {workout.exercises[currentExerciseIdx + 1]?.name || 'Finish'}</span>
                </div>

                <div className="flex-1 flex flex-col justify-center items-center text-center">
                    <h1 className="text-4xl font-bold font-heading mb-2">{currentExercise.name}</h1>
                    <div className="flex gap-4 mt-4">
                        <div className="bg-white/5 border border-white/10 p-4 rounded-2xl min-w-[100px]">
                            <span className="block text-3xl font-bold">{currentExercise.sets}</span>
                            <span className="text-xs text-stone-500 uppercase font-bold">Sets</span>
                        </div>
                        <div className="bg-white/5 border border-white/10 p-4 rounded-2xl min-w-[100px]">
                            <span className="block text-3xl font-bold">{currentExercise.reps}</span>
                            <span className="text-xs text-stone-500 uppercase font-bold">Reps Target</span>
                        </div>
                    </div>

                    {/* Logger Input (Simulated) */}
                    <div className="w-full max-w-md mt-12 bg-white/5 border border-white/10 rounded-2xl p-4">
                        <div className="grid grid-cols-4 gap-4 mb-2 text-xs text-stone-500 font-bold uppercase">
                            <div className="col-span-1">Set</div>
                            <div className="col-span-1">lbs</div>
                            <div className="col-span-1">Reps</div>
                            <div className="col-span-1"></div>
                        </div>
                        {[1, 2, 3].map(set => (
                            <div key={set} className="grid grid-cols-4 gap-4 mb-3 items-center">
                                <div className="w-8 h-8 rounded-full bg-stone-800 flex items-center justify-center text-xs font-bold text-stone-500 border border-white/5">
                                    {set}
                                </div>
                                <div className="h-10 bg-black/40 rounded-lg border border-white/10 flex items-center justify-center text-lg font-mono">
                                    -
                                </div>
                                <div className="h-10 bg-black/40 rounded-lg border border-white/10 flex items-center justify-center text-lg font-mono">
                                    -
                                </div>
                                <button className="h-8 w-8 rounded-lg bg-stone-800 hover:bg-green-500/20 hover:text-green-500 transition-colors flex items-center justify-center">
                                    ✓
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div className="relative z-10 p-6 border-t border-white/10 bg-black/20 backdrop-blur-md">
                <div className="flex gap-4">
                    <button
                        onClick={() => currentExerciseIdx > 0 && setCurrentExerciseIdx(c => c - 1)}
                        className="p-4 rounded-2xl bg-stone-800 text-stone-400 hover:bg-stone-700 disabled:opacity-50"
                        disabled={currentExerciseIdx === 0}
                    >
                        ←
                    </button>
                    <button
                        onClick={() => {
                            if (currentExerciseIdx < workout.exercises.length - 1) {
                                setCurrentExerciseIdx(c => c + 1)
                            } else {
                                onFinish()
                            }
                        }}
                        className="flex-1 py-4 bg-orange-600 hover:bg-orange-500 text-white rounded-2xl font-bold text-lg shadow-lg shadow-orange-600/20"
                    >
                        {currentExerciseIdx === workout.exercises.length - 1 ? 'Finish Workout' : 'Next Exercise'}
                    </button>
                </div>
            </div>
        </div>
    )
}
