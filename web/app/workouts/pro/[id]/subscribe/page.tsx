"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Trophy, Shield, Check, Loader2, ArrowRight, Zap, Target } from "lucide-react";

export default function SubscribePage() {
    const params = useParams();
    const router = useRouter();
    const [step, setStep] = useState(0);
    const [isProcessing, setIsProcessing] = useState(false);

    // Simulate data loading
    const programId = params.id as string;

    const steps = [
        {
            title: "Protocol Verification",
            description: "Synchronizing legend-tier architecture with your profile biometrics.",
            icon: Shield,
            color: "stone"
        },
        {
            title: "Performance Seeding",
            description: "Calibrating volume and frequency based on your CNS recovery capacity.",
            icon: Target,
            color: "orange"
        },
        {
            title: "Architecture Deployment",
            description: "Injecting specialized training protocols into your Workout Lab.",
            icon: Zap,
            color: "stone"
        }
    ];

    const handleNext = async () => {
        if (step < steps.length - 1) {
            setIsProcessing(true);
            setTimeout(() => {
                setStep(step + 1);
                setIsProcessing(false);
            }, 1500);
        } else {
            setIsProcessing(true);
            try {
                // Call Server Action to save subscription
                const { subscribeToProgramAction } = await import('@/lib/api/workout-actions');
                await subscribeToProgramAction(programId);

                setTimeout(() => {
                    router.push("/workouts");
                }, 2000);
            } catch (error) {
                console.error('Failed to subscribe to program:', error);
                setIsProcessing(false);
                // Optionally show error to user
            }
        }
    };

    const current = steps[step];
    const Icon = current.icon;

    return (
        <div className="min-h-screen bg-stone-50 dark:bg-stone-950 flex flex-col items-center justify-center p-6 pb-24">
            <div className="max-w-md w-full">
                {/* Progress Header */}
                <div className="flex gap-2 mb-12">
                    {steps.map((_, i) => (
                        <div
                            key={i}
                            className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${i <= step ? 'bg-orange-500' : 'bg-stone-200 dark:bg-stone-800'
                                }`}
                        />
                    ))}
                </div>

                {/* Content Card */}
                <div className="bg-white dark:bg-stone-900 rounded-[3rem] p-10 shadow-2xl shadow-stone-900/10 border border-stone-100 dark:border-stone-800 text-center relative overflow-hidden">
                    {/* Animated Background Element */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-40 bg-orange-500/5 blur-3xl rounded-full" />

                    <div className={`w-20 h-20 mx-auto rounded-3xl flex items-center justify-center mb-8 shadow-xl transition-all duration-500 ${current.color === 'orange'
                        ? 'bg-orange-500 shadow-orange-500/20'
                        : 'bg-stone-900 dark:bg-white shadow-stone-900/20'
                        }`}>
                        {isProcessing ? (
                            <Loader2 className={`w-8 h-8 animate-spin ${current.color === 'orange' ? 'text-white' : 'text-stone-900 dark:text-stone-100'}`} />
                        ) : (
                            <Icon className={`w-8 h-8 ${current.color === 'orange' ? 'text-white' : 'text-stone-100 dark:text-stone-900'}`} />
                        )}
                    </div>

                    <h2 className="text-3xl font-black text-stone-900 dark:text-white mb-4 font-heading tracking-tight">
                        {current.title}
                    </h2>
                    <p className="text-stone-500 dark:text-stone-400 font-medium leading-relaxed mb-10 px-4">
                        {current.description}
                    </p>

                    <button
                        onClick={handleNext}
                        disabled={isProcessing}
                        className="w-full py-5 bg-stone-900 dark:bg-white text-white dark:text-stone-900 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:opacity-90 transition-all disabled:opacity-70 flex items-center justify-center gap-3 group"
                    >
                        {isProcessing ? 'Processing Protocol...' : (
                            <>
                                {step === steps.length - 1 ? 'Deploy to Lab' : 'Synchronize'}
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>

                    <div className="mt-8 flex items-center justify-center gap-2 text-[10px] font-black text-stone-400 uppercase tracking-widest">
                        <Check className="w-3 h-3 text-emerald-500" /> Secure Cloud Deployment
                    </div>
                </div>

                {/* Footer Info */}
                <p className="mt-8 text-center text-xs text-stone-400 font-medium px-8 leading-loose uppercase tracking-widest">
                    You are subscribing to an <span className="text-orange-500 font-bold">Elite Tier</span> curriculum. Protocols will be available in your Workout Lab upon completion.
                </p>
            </div>
        </div>
    );
}
