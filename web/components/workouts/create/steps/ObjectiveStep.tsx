
"use client";

import React from 'react';
import { SparkConfig } from '@/lib/types';
import { Dumbbell, Activity, Timer, Zap, Scale } from 'lucide-react';

interface ObjectiveStepProps {
    config: SparkConfig;
    updateConfig: (updates: Partial<SparkConfig>) => void;
    onNext: () => void;
}

export function ObjectiveStep({ config, updateConfig, onNext }: ObjectiveStepProps) {
    const objectives = [
        { id: 'hypertrophy', label: 'Hypertrophy', icon: Dumbbell, desc: 'Build muscle size' },
        { id: 'strength', label: 'Strength', icon: Scale, desc: 'Increase max force' },
        { id: 'endurance', label: 'Endurance', icon: Activity, desc: 'Sustain performance' },
        { id: 'fat-loss', label: 'Fat Loss', icon: Zap, desc: 'Burn calories' },
    ];

    const muscleGroups = [
        'Chest', 'Back', 'Shoulders', 'Legs', 'Arms', 'Core', 'Full Body'
    ];

    const toggleMuscle = (muscle: string) => {
        const current = config.muscles;
        if (current.includes(muscle)) {
            updateConfig({ muscles: current.filter(m => m !== muscle) });
        } else {
            updateConfig({ muscles: [...current, muscle] });
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="space-y-2">
                <h2 className="text-3xl font-bold font-heading">What's the goal?</h2>
                <p className="text-stone-400">Select your primary training objective for this session.</p>
            </div>

            {/* Objectives */}
            <div className="grid grid-cols-2 gap-4">
                {objectives.map((obj) => (
                    <button
                        key={obj.id}
                        onClick={() => updateConfig({ objective: obj.id as any })}
                        className={`p-4 rounded-xl border text-left transition-all ${config.objective === obj.id
                                ? 'bg-orange-500/10 border-orange-500 text-orange-500 ring-1 ring-orange-500'
                                : 'bg-stone-900 border-stone-800 text-stone-400 hover:border-stone-700'
                            }`}
                    >
                        <obj.icon className="w-6 h-6 mb-3" />
                        <div className="font-bold">{obj.label}</div>
                        <div className="text-xs opacity-70">{obj.desc}</div>
                    </button>
                ))}
            </div>

            <div className="space-y-4">
                <h3 className="text-lg font-bold">Target Muscles</h3>
                <div className="flex flex-wrap gap-3">
                    {muscleGroups.map((muscle) => (
                        <button
                            key={muscle}
                            onClick={() => toggleMuscle(muscle)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${config.muscles.includes(muscle)
                                    ? 'bg-white text-stone-950'
                                    : 'bg-stone-900 text-stone-400 hover:bg-stone-800'
                                }`}
                        >
                            {muscle}
                        </button>
                    ))}
                </div>
            </div>

            <button
                onClick={onNext}
                disabled={config.muscles.length === 0}
                className="w-full py-4 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-stone-950 font-bold rounded-xl transition-colors mt-8"
            >
                Confirm Objective
            </button>
        </div>
    );
}
