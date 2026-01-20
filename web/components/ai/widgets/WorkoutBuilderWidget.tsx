"use client";

import React, { useState } from 'react';
import { WorkoutBuilderWidget } from '@/types/chat-widgets';
import { Dumbbell, Target, Layers, ChevronRight, Check, Loader2, Save, X } from 'lucide-react';
import { saveCustomWorkout } from '@/app/actions/chat-actions';

interface WorkoutBuilderProps {
    widget: WorkoutBuilderWidget;
    onComplete?: (data: any) => void;
}

export function WorkoutBuilderWidgetComponent({ widget, onComplete }: WorkoutBuilderProps) {
    const [step, setStep] = useState(0);
    const [data, setData] = useState({
        goal: '',
        muscles: [] as string[],
        difficulty: '',
        equipment: [] as string[]
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const steps = [
        { id: 'goal', label: 'Session Objective', icon: Target, options: ['Strength', 'Hypertrophy', 'Endurance', 'Mobility'] },
        { id: 'muscles', label: 'Primary Target', icon: Layers, options: ['Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Core'] },
        { id: 'difficulty', label: 'intensity level', icon: Target, options: ['Beginner', 'Intermediate', 'Advanced', 'Elite'] },
        { id: 'equipment', label: 'Available Tools', icon: Dumbbell, options: ['Full Gym', 'Dumbbells', 'Bodyweight', 'Bands'] },
        { id: 'confirm', label: 'Final Architecture', icon: Check, options: [] }
    ];

    const currentStep = steps[step];

    const handleSelect = (option: string) => {
        if (currentStep.id === 'muscles' || currentStep.id === 'equipment') {
            const list = currentStep.id === 'muscles' ? data.muscles : data.equipment;
            const newList = list.includes(option) ? list.filter(i => i !== option) : [...list, option];
            setData({ ...data, [currentStep.id]: newList });
        } else {
            setData({ ...data, [currentStep.id]: option });
            setTimeout(() => {
                if (step < steps.length - 1) setStep(step + 1);
            }, 300);
        }
    };

    const handleNext = () => {
        if (step < steps.length - 1) {
            setStep(step + 1);
        } else {
            handleSubmit();
        }
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            // Map selections to a structured protocol (Mock protocol for now, in V2 this would be GPT-generated)
            const protocol = data.muscles.map(muscle => ({
                name: `${data.difficulty} ${muscle} Press`,
                sets: data.difficulty === 'Advanced' ? '4' : '3',
                reps: data.goal === 'Strength' ? '5-8' : '10-12',
                notes: `Focus on ${data.goal.toLowerCase()} using ${data.equipment.join(', ')}.`
            }));

            await saveCustomWorkout({
                name: `${data.muscles.join(' & ')} ${data.goal}`,
                goal: data.goal,
                muscles: data.muscles,
                difficulty: data.difficulty,
                equipment: data.equipment,
                protocol
            });

            setIsSubmitted(true);
            if (onComplete) onComplete(data);
        } catch (error) {
            console.error("Save failed", error);
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
                <h3 className="font-bold text-stone-900 dark:text-white mb-1">Architecture Approved</h3>
                <p className="text-sm text-stone-500 dark:text-stone-400">Spark is now generating your optimal protocol.</p>
            </div>
        );
    }

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
                        <p className="text-[10px] uppercase tracking-wider font-bold text-stone-400">Protocol Architect</p>
                    </div>
                </div>
                <div className="text-[10px] font-mono font-bold text-stone-400">
                    {step + 1} / {steps.length}
                </div>
            </div>

            {currentStep.id === 'confirm' ? (
                <div className="p-6">
                    <div className="bg-stone-50 dark:bg-stone-800/50 rounded-2xl p-4 mb-6 border border-stone-100 dark:border-stone-700">
                        <h4 className="text-xs font-black text-stone-400 uppercase tracking-widest mb-3">Protocol Summary</h4>
                        <div className="space-y-2">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-stone-500">Targets</span>
                                <span className="font-bold text-stone-900 dark:text-white">{data.muscles.join(', ')}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-stone-500">Method</span>
                                <span className="font-bold text-stone-900 dark:text-white">{data.goal}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-stone-500">Level</span>
                                <span className="font-bold text-orange-500">{data.difficulty}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={() => setStep(0)}
                            className="flex-1 py-4 bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 rounded-xl font-bold text-sm hover:bg-stone-200 transition-colors flex items-center justify-center gap-2"
                        >
                            <X className="w-4 h-4" /> Edit
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="flex-[2] py-4 bg-orange-500 text-white rounded-xl font-bold text-sm hover:opacity-90 shadow-lg shadow-orange-500/20 transition-all flex items-center justify-center gap-2"
                        >
                            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Save className="w-4 h-4" /> Save to Library</>}
                        </button>
                    </div>
                </div>
            ) : (
                <>
                    <div className="p-4 grid grid-cols-2 gap-2">
                        {currentStep.options.map(option => {
                            const isSelected = currentStep.id === 'muscles'
                                ? data.muscles.includes(option)
                                : currentStep.id === 'equipment'
                                    ? data.equipment.includes(option)
                                    : (data as any)[currentStep.id] === option;

                            return (
                                <button
                                    key={option}
                                    onClick={() => handleSelect(option)}
                                    className={`p-3 rounded-xl text-xs font-bold transition-all border text-left flex items-center justify-between ${isSelected
                                        ? 'bg-orange-500 text-white border-orange-500 shadow-md shadow-orange-500/10'
                                        : 'bg-stone-50 dark:bg-stone-800 text-stone-600 dark:text-stone-400 border-stone-100 dark:border-stone-700 hover:border-orange-500/30'
                                        }`}
                                >
                                    {option}
                                    {isSelected && <Check className="w-3 h-3" />}
                                </button>
                            );
                        })}
                    </div>

                    {(currentStep.id === 'muscles' || currentStep.id === 'equipment') && (
                        <div className="p-4 pt-0">
                            <button
                                onClick={handleNext}
                                disabled={isSubmitting || (currentStep.id === 'muscles' ? data.muscles.length === 0 : data.equipment.length === 0)}
                                className="w-full py-3 bg-stone-900 dark:bg-white text-white dark:text-stone-900 rounded-xl font-bold text-xs hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Confirm Selection'} <ChevronRight className="w-3 h-3" />
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
