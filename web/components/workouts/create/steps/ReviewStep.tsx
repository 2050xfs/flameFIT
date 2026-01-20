
"use client";

import React from 'react';
import { GeneratedWorkout } from '@/lib/types';
import { Play, RotateCcw, BarChart3, Clock, Flame } from 'lucide-react';

interface ReviewStepProps {
    workout: GeneratedWorkout;
    onDeploy: () => void;
    onBack: () => void;
}

export function ReviewStep({ workout, onDeploy, onBack }: ReviewStepProps) {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
            {/* Header Stats */}
            <div className="bg-gradient-to-br from-stone-900 to-stone-950 p-6 rounded-2xl border border-white/5 space-y-4">
                <div className="flex justify-between items-start">
                    <div>
                        <h2 className="text-2xl font-bold font-heading text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">
                            {workout.title}
                        </h2>
                        <p className="text-stone-400 text-sm mt-1">{workout.description}</p>
                    </div>
                    <div className="bg-stone-800 p-2 rounded-lg">
                        <Flame className="w-6 h-6 text-orange-500" />
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/5">
                    <div className="text-center">
                        <div className="text-xs text-stone-500 uppercase tracking-wider">Volume</div>
                        <div className="font-bold font-mono">{workout.stats.volume.toLocaleString()} kg</div>
                    </div>
                    <div className="text-center border-l border-white/5 border-r">
                        <div className="text-xs text-stone-500 uppercase tracking-wider">Intensity</div>
                        <div className="font-bold font-mono text-orange-400">{workout.stats.intensity}/10</div>
                    </div>
                    <div className="text-center">
                        <div className="text-xs text-stone-500 uppercase tracking-wider">Burn</div>
                        <div className="font-bold font-mono">{workout.stats.calories} kcal</div>
                    </div>
                </div>
            </div>

            {/* Exercise List Placeholder */}
            <div className="space-y-3">
                <h3 className="font-bold text-lg flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-stone-400" />
                    Protocol Sequence
                </h3>
                <div className="space-y-2">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="flex items-center gap-4 p-4 bg-stone-900/50 rounded-xl border border-white/5 hover:bg-stone-800/50 transition-colors">
                            <div className="w-8 h-8 rounded-full bg-stone-800 flex items-center justify-center font-mono text-xs text-stone-500">
                                {i}
                            </div>
                            <div className="flex-1">
                                <div className="font-bold text-stone-200">Pending Exercise {i}</div>
                                <div className="text-xs text-stone-500">3 Sets • 8-12 Reps • RPE 8</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Actions */}
            <div className="pt-4 flex gap-4">
                <button
                    onClick={onBack}
                    className="flex-1 py-4 bg-stone-800 hover:bg-stone-700 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                    <RotateCcw className="w-5 h-5" />
                    Regenerate
                </button>
                <button
                    onClick={onDeploy}
                    className="flex-[2] py-4 bg-white text-stone-950 hover:bg-stone-200 font-bold rounded-xl transition-colors flex items-center justify-center gap-2 shadow-xl shadow-white/5"
                >
                    <Play className="w-5 h-5 fill-current" />
                    Deploy to Schedule
                </button>
            </div>
        </div>
    );
}
