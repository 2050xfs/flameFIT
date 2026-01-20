"use client";

import React, { useState } from 'react';
import { BiometricOnboardingWidget } from '@/types/chat-widgets';
import { User, Scale, Ruler, Target, Check, Loader2 } from 'lucide-react';
import { updateProfile } from '@/app/actions/chat-actions';

interface BiometricWidgetProps {
    widget: BiometricOnboardingWidget;
    onComplete?: (data: any) => void;
}

export function BiometricWidgetComponent({ widget, onComplete }: BiometricWidgetProps) {
    const [step, setStep] = useState(0);
    const [data, setData] = useState({
        name: '',
        weight: '',
        height: '',
        goals: [] as string[],
        lifestyle: '',
        summary: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const steps = [
        { id: 'name', label: 'Full Name', icon: User, placeholder: 'Enter your name' },
        { id: 'weight', label: 'Body Mass (kg)', icon: Scale, placeholder: 'e.g. 85' },
        { id: 'height', label: 'Stature (cm)', icon: Ruler, placeholder: 'e.g. 180' },
        { id: 'goals', label: 'Primary Objectives', icon: Target },
        { id: 'lifestyle', label: 'Lifestyle Type', icon: Target, placeholder: 'e.g. Active, Sedentary, etc.' },
        { id: 'summary', label: 'Performance Summary', icon: Target, placeholder: 'What drives your training?' }
    ].filter(s => widget.missingFields.length === 0 || widget.missingFields.includes(s.id));

    const totalSteps = steps.length;
    const currentStep = steps[step];

    const goalOptions = ['Strength', 'Hypertrophy', 'Fat Loss', 'Endurance', 'Flexibility'];

    const handleNext = () => {
        if (step < totalSteps - 1) {
            setStep(step + 1);
        } else {
            handleSubmit();
        }
    };

    const toggleGoal = (goal: string) => {
        setData(prev => ({
            ...prev,
            goals: prev.goals.includes(goal)
                ? prev.goals.filter(g => g !== goal)
                : [...prev.goals, goal]
        }));
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            const payload: any = {};
            if (data.name) payload.name = data.name;
            if (data.weight) payload.weight = parseFloat(data.weight);
            if (data.height) payload.height = parseFloat(data.height);
            if (data.goals.length > 0) payload.goals = data.goals;

            // Nested lifestyle info in preferences
            payload.preferences = {
                lifestyle: data.lifestyle,
                performance_summary: data.summary,
                lifestyle_segments: [] // Placeholder for future segments
            };

            await updateProfile(payload);
            setIsSubmitted(true);
            if (onComplete) onComplete(payload);
        } catch (error) {
            console.error("Failed to update biometrics", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSubmitted) {
        return (
            <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800 rounded-2xl p-6 flex flex-col items-center justify-center text-center animate-in fade-in zoom-in duration-300">
                <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center mb-3 shadow-lg shadow-emerald-500/20">
                    <Check className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-stone-900 dark:text-white mb-1">Protocol Updated</h3>
                <p className="text-sm text-stone-500 dark:text-stone-400">Your biometrics have been synchronized.</p>
            </div>
        );
    }

    if (!currentStep) return null;

    const Icon = currentStep.icon;

    return (
        <div className="bg-white dark:bg-stone-900 border border-stone-100 dark:border-stone-800 rounded-3xl overflow-hidden shadow-lg my-2">
            <div className="bg-stone-50 dark:bg-stone-800/50 p-4 border-b border-stone-100 dark:border-stone-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center shadow-md shadow-orange-500/20">
                        <Icon className="w-4 h-4 text-white" />
                    </div>
                    <div>
                        <h3 className="font-bold text-sm text-stone-900 dark:text-white">{currentStep.label}</h3>
                        <p className="text-[10px] uppercase tracking-wider font-bold text-stone-400">Biometric Sync</p>
                    </div>
                </div>
                <div className="text-[10px] font-mono font-bold text-stone-400">
                    {step + 1} / {totalSteps}
                </div>
            </div>

            <div className="p-6">
                {currentStep.id === 'goals' ? (
                    <div className="grid grid-cols-2 gap-2">
                        {goalOptions.map(goal => (
                            <button
                                key={goal}
                                onClick={() => toggleGoal(goal)}
                                className={`px-4 py-3 rounded-xl text-xs font-bold transition-all border ${data.goals.includes(goal)
                                    ? 'bg-orange-500 text-white border-orange-500 shadow-lg shadow-orange-500/20'
                                    : 'bg-stone-50 dark:bg-stone-800 text-stone-600 dark:text-stone-400 border-stone-100 dark:border-stone-700 hover:border-orange-500/50'
                                    }`}
                            >
                                {goal}
                            </button>
                        ))}
                    </div>
                ) : (
                    <input
                        type={currentStep.id === 'name' ? 'text' : 'number'}
                        value={(data as any)[currentStep.id]}
                        onChange={e => setData({ ...data, [currentStep.id]: e.target.value })}
                        placeholder={currentStep.placeholder}
                        autoFocus
                        className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl px-4 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all font-medium"
                    />
                )}

                <button
                    onClick={handleNext}
                    disabled={isSubmitting || (currentStep.id !== 'goals' && !(data as any)[currentStep.id]) || (currentStep.id === 'goals' && data.goals.length === 0)}
                    className="w-full py-4 bg-stone-900 dark:bg-white text-white dark:text-stone-900 rounded-xl font-bold text-sm hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2 mt-6"
                >
                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : (step === totalSteps - 1 ? 'Complete Protocol' : 'Next Milestone')}
                </button>
            </div>
        </div>
    );
}
