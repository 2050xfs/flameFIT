"use client";

import React from 'react';
import { Sparkles, TrendingUp, AlertCircle } from 'lucide-react';

interface SparkInsightProps {
    insight: {
        type: 'success' | 'warning' | 'info';
        message: string;
        actionLabel?: string;
        onAction?: () => void;
    } | null;
}

export function SparkInsight({ insight }: SparkInsightProps) {
    if (!insight) return null;

    const styles = {
        success: 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-900/30 text-emerald-800 dark:text-emerald-300 icon-emerald-500',
        warning: 'bg-amber-50 dark:bg-amber-950/20 border-amber-100 dark:border-amber-900/30 text-amber-800 dark:text-amber-300 icon-amber-500',
        info: 'bg-orange-50 dark:bg-orange-950/20 border-orange-100 dark:border-orange-900/30 text-orange-800 dark:text-orange-300 icon-orange-500'
    };

    const Icons = {
        success: TrendingUp,
        warning: AlertCircle,
        info: Sparkles
    };

    const Icon = Icons[insight.type];

    return (
        <div className={`border rounded-2xl p-4 flex gap-4 items-start animate-in slide-in-from-top-4 duration-500 ${styles[insight.type]}`}>
            <div className={`w-10 h-10 rounded-xl bg-white dark:bg-stone-900 flex items-center justify-center shadow-sm flex-shrink-0`}>
                <Icon className={`w-6 h-6 ${insight.type === 'info' ? 'text-orange-500' : ''}`} />
            </div>
            <div className="flex-1">
                <p className="text-sm font-medium leading-relaxed">
                    {insight.message}
                </p>
                {insight.actionLabel && (
                    <button
                        onClick={insight.onAction}
                        className="mt-2 text-xs font-bold uppercase tracking-wider hover:opacity-70 transition-opacity"
                    >
                        {insight.actionLabel} →
                    </button>
                )}
            </div>
        </div>
    );
}
