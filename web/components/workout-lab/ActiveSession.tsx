"use client";

import React, { useState, useEffect } from 'react'
import type { WorkoutDetail } from '@/lib/types'
import { logSet, completeWorkoutSession } from '@/lib/api/workout-actions'
import { useRouter } from 'next/navigation'

interface ActiveSessionProps {
    workout: WorkoutDetail
}

export function ActiveSession({ workout }: ActiveSessionProps) {
    const router = useRouter();
    const [currentExerciseIdx, setCurrentExerciseIdx] = useState(0)
    const [seconds, setSeconds] = useState(0)
    const [isLogging, setIsLogging] = useState(false)
    const [weight, setWeight] = useState<string>('')
    const [reps, setReps] = useState<string>('')

    // Timer
    useEffect(() => {
        const interval = setInterval(() => {
            setSeconds(s => s + 1)
        }, 1000)
        return () => clearInterval(interval)
    }, [])

    const formatTime = (s: number) => {
        const mins = Math.floor(s / 60)
        const secs = s % 60
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }

    const currentExercise = workout.exercises[currentExerciseIdx]

    const handleLogSet = async () => {
        if (!weight || !reps) return;

        setIsLogging(true)
        const success = await logSet(
            workout.id,
            currentExercise.exerciseId,
            parseFloat(weight),
            parseInt(reps)
        )
        setIsLogging(false)

        if (success) {
            // Optional: reset fields or show success animation
            setReps('')
        }
    }

    const handleFinish = async () => {
        await completeWorkoutSession(workout.id, Math.floor(seconds / 60))
        router.push(`/workouts/summary/${workout.id}`)
    }


    return (
        <div className="h-[calc(100vh-120px)] flex flex-col bg-stone-950 text-white rounded-3xl overflow-hidden relative shadow-2xl">

            {/* Immersive Background */}
            <div className="absolute inset-0 bg-gradient-to-b from-stone-900 to-black z-0" />
            <div className="absolute top-0 right-0 w-full h-1/2 bg-orange-600 blur-[120px] opacity-10 z-0" />

            {/* Header */}
            <div className="relative z-10 p-6 flex items-center justify-between border-b border-white/10">
                <div>
                    <p className="text-xs font-bold text-stone-400 uppercase tracking-wider">Active Session</p>
                    <h2 className="text-lg font-bold">{workout.title}</h2>
                </div>
                <div className="px-4 py-2 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-lg font-mono font-bold">
                    {formatTime(seconds)}
                </div>
            </div>

            {/* Main Content */}
            <div className="relative z-10 flex-1 flex flex-col p-6 overflow-y-auto">
                {/* Exercise Progress */}
                <div className="flex items-center justify-between text-sm text-stone-400 mb-8">
                    <span>Exercise {currentExerciseIdx + 1} of {workout.exercises.length}</span>
                    <div className="h-1.5 flex-1 mx-4 bg-white/5 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-orange-500 transition-all duration-500"
                            style={{ width: `${((currentExerciseIdx + 1) / workout.exercises.length) * 100}%` }}
                        />
                    </div>
                    <span className="text-xs font-bold">{Math.round(((currentExerciseIdx + 1) / workout.exercises.length) * 100)}%</span>
                </div>

                <div className="flex-1 flex flex-col justify-center items-center text-center">
                    <h1 className="text-4xl font-bold font-heading mb-4 text-white">{currentExercise.name}</h1>

                    <div className="flex gap-6 mt-2">
                        <div className="bg-white/5 border border-white/10 p-4 rounded-3xl min-w-[120px] backdrop-blur-sm">
                            <span className="block text-4xl font-bold text-orange-500">{currentExercise.sets}</span>
                            <span className="text-[10px] text-stone-500 uppercase font-bold tracking-widest mt-1">Sets Target</span>
                        </div>
                        <div className="bg-white/5 border border-white/10 p-4 rounded-3xl min-w-[120px] backdrop-blur-sm">
                            <span className="block text-4xl font-bold text-orange-500">{currentExercise.reps}</span>
                            <span className="text-[10px] text-stone-500 uppercase font-bold tracking-widest mt-1">Reps Target</span>
                        </div>
                    </div>

                    {/* Logger Input (Simplified for Demo) */}
                    <div className="w-full max-w-md mt-12 bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-md">
                        <div className="text-left mb-6">
                            <h3 className="text-sm font-bold text-stone-400 uppercase tracking-widest">Log Your Progress</h3>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-stone-500 uppercase">Weight (lbs)</label>
                                <input
                                    type="number"
                                    value={weight}
                                    onChange={(e) => setWeight(e.target.value)}
                                    placeholder="0"
                                    className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-center text-xl font-mono focus:border-orange-500 outline-none transition-colors"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-stone-500 uppercase">Reps</label>
                                <input
                                    type="number"
                                    value={reps}
                                    onChange={(e) => setReps(e.target.value)}
                                    placeholder="0"
                                    className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-center text-xl font-mono focus:border-orange-500 outline-none transition-colors"
                                />
                            </div>
                        </div>

                        <button
                            className="w-full mt-6 py-4 bg-white/10 hover:bg-white/20 text-white rounded-2xl font-bold transition-all active:scale-95 disabled:opacity-50"
                            onClick={() => handleLogSet()}
                            disabled={isLogging || !weight || !reps}
                        >
                            {isLogging ? 'Logging...' : 'Log Set'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div className="relative z-10 p-6 border-t border-white/10 bg-black/20 backdrop-blur-md">
                <div className="flex gap-4">
                    <button
                        onClick={() => currentExerciseIdx > 0 && setCurrentExerciseIdx(c => c - 1)}
                        className="p-4 rounded-2xl bg-stone-800 text-stone-400 hover:bg-stone-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        disabled={currentExerciseIdx === 0}
                    >
                        ←
                    </button>
                    <button
                        onClick={() => {
                            if (currentExerciseIdx < workout.exercises.length - 1) {
                                setCurrentExerciseIdx(c => c + 1)
                            } else {
                                handleFinish()
                            }
                        }}
                        className="flex-1 py-4 bg-orange-600 hover:bg-orange-500 text-white rounded-2xl font-bold text-lg shadow-xl shadow-orange-600/30 transition-all active:scale-[0.98]"
                    >
                        {currentExerciseIdx === workout.exercises.length - 1 ? 'Finish Workout' : 'Next Exercise'}
                    </button>
                </div>
            </div>
        </div>
    )
}
