
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
    const [generationError, setGenerationError] = useState<string | null>(null);

    const totalSteps = 4;

    const handleNext = () => {
        if (step < totalSteps) setStep(prev => prev + 1);
    };

    const handleBack = () => {
        if (step > 1) setStep(prev => prev - 1);
    };

    const handleGenerate = async () => {
        setStep(3);
        setGenerationError(null);
        try {
            const res = await fetch('/api/ai/generate-workout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(config),
            });
            if (res.status === 429) {
                const data = await res.json();
                setGenerationError(`Rate limit reached. Try again in ${data.resetIn}s.`);
                return; // Stay on step 3 to show error
            }
            if (!res.ok) throw new Error('Generation failed');
            const workout: GeneratedWorkout = await res.json();
            if (!workout.exercises || workout.exercises.length === 0) {
                setGenerationError('AI returned an empty workout. Please try again.');
                return;
            }
            setGeneratedWorkout(workout);
            setStep(4);
        } catch (err) {
            console.error('Workout generation error:', err);
            setGenerationError('Generation failed. Check your connection and try again.');
        }
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
            router.push('/workouts');
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
                            <div className="flex-1 flex flex-col items-center justify-center gap-6">
                                <GenerationStep config={config} />
                                {generationError && (
                                    <div className="w-full max-w-md bg-red-500/10 border border-red-500/30 rounded-2xl p-4 text-center">
                                        <p className="text-red-400 text-sm font-medium">{generationError}</p>
                                        <button
                                            onClick={() => { setGenerationError(null); setStep(2); }}
                                            className="mt-3 px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-sm font-bold transition-all"
                                        >
                                            Go Back & Retry
                                        </button>
                                    </div>
                                )}
                            </div>
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
