'use client';

import type { DashboardProps } from '@/lib/types';
import { MotionDiv, scaleIn } from '@/components/ui/motion';
import { ClipboardList } from 'lucide-react';

interface ReadinessCardProps {
    readiness: DashboardProps['readiness'];
    onLogReadiness?: () => void;
}

export function ReadinessCard({ readiness, onLogReadiness }: ReadinessCardProps) {
    const ringColor =
        readiness.score >= 85 ? 'text-emerald-500' :
        readiness.score >= 65 ? 'text-orange-500' :
        'text-rose-500';

    const badgeColor =
        readiness.score >= 85 ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300' :
        readiness.score >= 65 ? 'bg-orange-100 dark:bg-orange-500/20 text-orange-700 dark:text-orange-300' :
        'bg-rose-100 dark:bg-rose-500/20 text-rose-700 dark:text-rose-300';

    return (
        <MotionDiv variants={scaleIn} className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <div className="w-32 h-32 rounded-full bg-orange-500 blur-2xl" />
            </div>

            <div className="flex flex-col items-center justify-center py-4">
                {/* Readiness Ring */}
                <div className="relative w-40 h-40">
                    <svg className="w-full h-full transform -rotate-90">
                        <circle cx="80" cy="80" r="70" fill="none" stroke="currentColor" strokeWidth="12" className="text-stone-100 dark:text-stone-800" />
                        <circle
                            cx="80" cy="80" r="70"
                            fill="none" stroke="currentColor" strokeWidth="12"
                            className={ringColor}
                            strokeDasharray={2 * Math.PI * 70}
                            strokeDashoffset={2 * Math.PI * 70 * (1 - readiness.score / 100)}
                            strokeLinecap="round"
                        />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-4xl font-bold font-heading text-stone-900 dark:text-white">{readiness.score}</span>
                        <span className="text-xs font-bold uppercase text-stone-400">Readiness</span>
                    </div>
                </div>

                <div className="mt-4 text-center">
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase mb-2 ${badgeColor}`}>
                        {readiness.status}
                    </div>
                    <p className="text-sm text-stone-600 dark:text-stone-400 max-w-[200px] leading-relaxed mx-auto">
                        {readiness.message}
                    </p>
                </div>

                {onLogReadiness && (
                    <button
                        onClick={onLogReadiness}
                        className="mt-5 flex items-center gap-2 px-4 py-2 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 text-xs font-bold hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors"
                    >
                        <ClipboardList className="w-3.5 h-3.5" />
                        Log Today's Readiness
                    </button>
                )}
            </div>
        </MotionDiv>
    );
}
