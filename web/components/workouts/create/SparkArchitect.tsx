
"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Sparkles, Check } from 'lucide-react';
import { SparkConfig, GeneratedWorkout } from '@/lib/types';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Steps
import { ObjectiveStep } from './steps/ObjectiveStep';
import { ConstraintsStep } from './steps/ConstraintsStep';
import { GenerationStep } from './steps/GenerationStep';
import { ReviewStep } from './steps/ReviewStep';
import { saveGeneratedWorkoutAction } from '@/app/workouts/actions';

export default function SparkArchitect() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [config, setConfig] = useState<SparkConfig>({
        objective: 'hypertrophy',
        muscles: [],
        duration: 45,
        equipment: 'full-gym',
        intensity: 'moderate'
    });
    const [generatedWorkout, setGeneratedWorkout] = useState<GeneratedWorkout | null>(null);

    const totalSteps = 4;

    const handleNext = () => {
        if (step < totalSteps) setStep(prev => prev + 1);
    };

    const handleBack = () => {
        if (step > 1) setStep(prev => prev - 1);
    };

    const handleGenerate = async () => {
        // Trigger generation logic (Step 3)
        setStep(3);
        // Mock generation delay for now
        setTimeout(() => {
            const mockWorkout: GeneratedWorkout = {
                id: 'spark-123',
                title: 'AI Generated Protocol',
                description: `A ${config.intensity} intensity ${config.objective} session focusing on ${config.muscles.join(', ')}.`,
                exercises: [], // Populated in Step 4
                stats: {
                    volume: 12000,
                    intensity: 8.5,
                    calories: 450,
                    duration: config.duration
                }
            };
            setGeneratedWorkout(mockWorkout);
            setStep(4);
        }, 3000);
    };



    const handleDeploy = async () => {
        if (!generatedWorkout) return;

        const result = await saveGeneratedWorkoutAction({
            title: generatedWorkout.title,
            description: generatedWorkout.description,
            exercises: generatedWorkout.exercises,
            stats: generatedWorkout.stats,
            prompt: `Objective: ${config.objective}, Equipment: ${config.equipment}`,
            muscleGroups: config.muscles,
            tags: [config.objective, config.intensity]
        });

        if (result.success) {
            router.push('/progress?tab=library');
        } else {
            console.error("Failed to save:", result.error);
            // Ideally show a toast here
        }
    };

    return (
        <div className="min-h-screen bg-stone-950 text-white flex flex-col">
            {/* Header */}
            <div className="p-6 flex items-center justify-between border-b border-white/10">
                <div className="flex items-center gap-4">
                    <button onClick={() => router.back()} className="p-2 hover:bg-white/5 rounded-full">
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    <div>
                        <h1 className="text-xl font-bold font-heading flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-orange-500" />
                            Spark Architect
                        </h1>
                        <p className="text-xs text-stone-400">AI-Powered Workout Builder</p>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="flex gap-1">
                    {[1, 2, 3, 4].map((s) => (
                        <div
                            key={s}
                            className={`h-1 w-8 rounded-full transition-colors ${s <= step ? 'bg-orange-500' : 'bg-stone-800'}`}
                        />
                    ))}
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col relative overflow-hidden">
                <AnimatePresence mode='wait'>
                    <motion.div
                        key={step}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="flex-1 p-6 max-w-2xl mx-auto w-full flex flex-col"
                    >
                        {step === 1 && (
                            <ObjectiveStep
                                config={config}
                                updateConfig={(updates) => setConfig({ ...config, ...updates })}
                                onNext={handleNext}
                            />
                        )}
                        {step === 2 && (
                            <ConstraintsStep
                                config={config}
                                updateConfig={(updates) => setConfig({ ...config, ...updates })}
                                onGenerate={handleGenerate}
                                onBack={handleBack}
                            />
                        )}
                        {step === 3 && (
                            <GenerationStep config={config} />
                        )}
                        {step === 4 && generatedWorkout && (
                            <ReviewStep
                                workout={generatedWorkout}
                                onDeploy={handleDeploy}
                                onBack={() => setStep(2)} // Allow re-configuring
                            />
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}
