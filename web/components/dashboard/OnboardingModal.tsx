'use client';

import React, { useState } from 'react';
import { ChevronRight, Check, Target, Weight, User, Flame } from 'lucide-react';

const GOALS = [
    { id: 'muscle_gain', label: 'Build Muscle', icon: '💪' },
    { id: 'fat_loss', label: 'Lose Fat', icon: '🔥' },
    { id: 'strength', label: 'Get Stronger', icon: '🏋️' },
    { id: 'endurance', label: 'Build Endurance', icon: '🏃' },
    { id: 'aesthetics', label: 'Improve Aesthetics', icon: '✨' },
    { id: 'health', label: 'General Health', icon: '❤️' },
];

interface OnboardingData {
    name: string;
    weight: string;
    height: string;
    goals: string[];
}

interface OnboardingModalProps {
    onComplete: (data: OnboardingData) => Promise<void>;
    onSkip: () => void;
}

export function OnboardingModal({ onComplete, onSkip }: OnboardingModalProps) {
    const [step, setStep] = useState(0);
    const [saving, setSaving] = useState(false);
    const [data, setData] = useState<OnboardingData>({
        name: '',
        weight: '',
        height: '',
        goals: [],
    });

    const steps = [
        { label: 'Name', icon: User },
        { label: 'Stats', icon: Weight },
        { label: 'Goals', icon: Target },
    ];

    const canAdvance = () => {
        if (step === 0) return data.name.trim().length >= 2;
        if (step === 1) return data.weight !== '' && data.height !== '';
        if (step === 2) return data.goals.length >= 1;
        return false;
    };

    const toggleGoal = (id: string) => {
        setData(prev => ({
            ...prev,
            goals: prev.goals.includes(id)
                ? prev.goals.filter(g => g !== id)
                : [...prev.goals, id],
        }));
    };

    const handleFinish = async () => {
        setSaving(true);
        try {
            await onComplete(data);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-stone-900 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-br from-orange-500 to-rose-600 p-8 text-white">
                    <div className="flex items-center gap-2 mb-4">
                        <Flame className="w-6 h-6" />
                        <span className="text-sm font-bold uppercase tracking-widest opacity-80">FlameFIT</span>
                    </div>
                    <h2 className="text-2xl font-bold font-heading mb-1">
                        {step === 0 && "Welcome. Let's get started."}
                        {step === 1 && 'Your biometrics matter.'}
                        {step === 2 && "What are you training for?"}
                    </h2>
                    <p className="text-sm opacity-80">
                        {step === 0 && 'Spark needs to know who you are to personalize everything.'}
                        {step === 1 && 'Weight and height unlock precise calorie and macro targets.'}
                        {step === 2 && 'Select all that apply. Spark adapts its coaching to your goals.'}
                    </p>

                    {/* Step indicators */}
                    <div className="flex gap-2 mt-6">
                        {steps.map((s, i) => (
                            <div
                                key={i}
                                className={`flex-1 h-1 rounded-full transition-all ${i <= step ? 'bg-white' : 'bg-white/30'}`}
                            />
                        ))}
                    </div>
                </div>

                {/* Body */}
                <div className="p-8">
                    {/* Step 0: Name */}
                    {step === 0 && (
                        <div className="space-y-4">
                            <label className="block text-sm font-bold text-stone-700 dark:text-stone-300 mb-2">
                                What should Spark call you?
                            </label>
                            <input
                                type="text"
                                autoFocus
                                placeholder="Your name"
                                value={data.name}
                                onChange={e => setData(d => ({ ...d, name: e.target.value }))}
                                onKeyDown={e => e.key === 'Enter' && canAdvance() && setStep(1)}
                                className="w-full px-4 py-3.5 bg-stone-100 dark:bg-stone-800 rounded-2xl text-stone-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/50 text-lg"
                            />
                        </div>
                    )}

                    {/* Step 1: Stats */}
                    {step === 1 && (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-stone-700 dark:text-stone-300 mb-2">
                                    Body Weight (kg)
                                </label>
                                <input
                                    type="number"
                                    autoFocus
                                    placeholder="e.g. 80"
                                    value={data.weight}
                                    onChange={e => setData(d => ({ ...d, weight: e.target.value }))}
                                    className="w-full px-4 py-3.5 bg-stone-100 dark:bg-stone-800 rounded-2xl text-stone-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/50 text-lg"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-stone-700 dark:text-stone-300 mb-2">
                                    Height (cm)
                                </label>
                                <input
                                    type="number"
                                    placeholder="e.g. 178"
                                    value={data.height}
                                    onChange={e => setData(d => ({ ...d, height: e.target.value }))}
                                    className="w-full px-4 py-3.5 bg-stone-100 dark:bg-stone-800 rounded-2xl text-stone-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/50 text-lg"
                                />
                            </div>
                            <p className="text-xs text-stone-400">
                                Used to calculate your TDEE and precise macro targets. Stored securely.
                            </p>
                        </div>
                    )}

                    {/* Step 2: Goals */}
                    {step === 2 && (
                        <div className="grid grid-cols-2 gap-3">
                            {GOALS.map(goal => {
                                const selected = data.goals.includes(goal.id);
                                return (
                                    <button
                                        key={goal.id}
                                        onClick={() => toggleGoal(goal.id)}
                                        className={`relative flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all text-sm font-bold ${
                                            selected
                                                ? 'border-orange-500 bg-orange-50 dark:bg-orange-950 text-orange-600 dark:text-orange-400'
                                                : 'border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400 hover:border-stone-300 dark:hover:border-stone-600'
                                        }`}
                                    >
                                        {selected && (
                                            <div className="absolute top-2 right-2 w-4 h-4 bg-orange-500 rounded-full flex items-center justify-center">
                                                <Check className="w-2.5 h-2.5 text-white" />
                                            </div>
                                        )}
                                        <span className="text-2xl">{goal.icon}</span>
                                        {goal.label}
                                    </button>
                                );
                            })}
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-3 mt-8">
                        <button
                            onClick={onSkip}
                            className="px-4 py-3.5 text-stone-400 font-bold hover:text-stone-600 dark:hover:text-stone-200 transition-colors text-sm"
                        >
                            Skip for now
                        </button>
                        <button
                            onClick={step < 2 ? () => setStep(s => s + 1) : handleFinish}
                            disabled={!canAdvance() || saving}
                            className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-orange-500 text-white font-bold rounded-2xl shadow-lg shadow-orange-500/20 hover:bg-orange-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                        >
                            {saving ? 'Saving...' : step < 2 ? (
                                <>Continue <ChevronRight className="w-4 h-4" /></>
                            ) : (
                                <>Activate Spark <Flame className="w-4 h-4" /></>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
