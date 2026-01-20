
"use client";

import React, { useEffect, useState } from 'react';
import { SparkConfig } from '@/lib/types';
import { Sparkles } from 'lucide-react';

interface GenerationStepProps {
    config: SparkConfig;
}

export function GenerationStep({ config }: GenerationStepProps) {
    const [status, setStatus] = useState("Initializing Spark...");

    useEffect(() => {
        const statuses = [
            "Analyzing biometric profile...",
            "Selecting optimal exercises...",
            `Calibrating for ${config.objective}...`,
            "Calculating volume metrics...",
            "Finalizing Spark protocol..."
        ];

        let i = 0;
        const interval = setInterval(() => {
            if (i < statuses.length) {
                setStatus(statuses[i]);
                i++;
            }
        }, 600);

        return () => clearInterval(interval);
    }, [config]);

    return (
        <div className="flex-1 flex flex-col items-center justify-center space-y-8 animate-in fade-in duration-700">
            <div className="relative">
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-orange-500 blur-3xl opacity-20 rounded-full animate-pulse" />

                {/* Spark Icon Animation */}
                <div className="relative w-24 h-24 bg-gradient-to-br from-orange-400 to-red-600 rounded-2xl flex items-center justify-center transform rotate-3 animate-spin-slow">
                    <Sparkles className="w-12 h-12 text-white animate-pulse" />
                </div>
            </div>

            <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold font-heading animate-pulse">Generating Protocol</h2>
                <p className="text-stone-400 font-mono text-sm h-6">{status}</p>
            </div>

            {/* Config Summary Tags */}
            <div className="flex flex-wrap gap-2 justify-center opacity-50">
                <span className="px-3 py-1 bg-stone-800 rounded-full text-xs">{config.objective}</span>
                <span className="px-3 py-1 bg-stone-800 rounded-full text-xs">{config.duration} min</span>
                <span className="px-3 py-1 bg-stone-800 rounded-full text-xs">{config.intensity}</span>
            </div>
        </div>
    );
}
