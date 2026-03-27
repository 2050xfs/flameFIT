'use client';

import React, { useState } from 'react';
import { CheckCircle2, Circle, ChevronRight, Trophy, Calendar } from 'lucide-react';

interface ProgramProgressCardProps {
    programId: string;
    programTitle: string;
    totalWeeks: number;
    currentWeek: number;
    subscribedAt: string; // ISO date
    onAdvanceWeek?: () => void;
}

export function ProgramProgressCard({
    programTitle,
    totalWeeks,
    currentWeek,
    subscribedAt,
    onAdvanceWeek,
}: ProgramProgressCardProps) {
    const [advancing, setAdvancing] = useState(false);
    const completedWeeks = Math.max(0, currentWeek - 1);
    const pct = Math.round((completedWeeks / totalWeeks) * 100);
    const isComplete = currentWeek > totalWeeks;

    const daysSinceSubscribe = Math.floor(
        (Date.now() - new Date(subscribedAt).getTime()) / (1000 * 60 * 60 * 24)
    );
    const expectedWeek = Math.min(Math.floor(daysSinceSubscribe / 7) + 1, totalWeeks + 1);
    const behindSchedule = expectedWeek > currentWeek && !isComplete;

    const handleAdvance = async () => {
        if (!onAdvanceWeek || advancing) return;
        setAdvancing(true);
        try {
            await onAdvanceWeek();
        } finally {
            setAdvancing(false);
        }
    };

    if (isComplete) {
        return (
            <div className="bg-gradient-to-br from-orange-500/10 to-yellow-500/10 border border-orange-500/20 rounded-3xl p-6">
                <div className="flex items-center gap-3 mb-3">
                    <Trophy className="w-6 h-6 text-yellow-500" />
                    <h3 className="font-bold text-white font-heading">Program Complete!</h3>
                </div>
                <p className="text-stone-400 text-sm mb-4">
                    You finished <span className="text-white font-bold">{programTitle}</span> — {totalWeeks} weeks of work done.
                </p>
                <div className="w-full bg-orange-500/20 rounded-full h-2">
                    <div className="h-2 bg-orange-500 rounded-full w-full" />
                </div>
                <p className="text-xs text-orange-400 font-bold mt-2 text-right">100% Complete</p>
            </div>
        );
    }

    return (
        <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 space-y-5">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-1">Active Program</p>
                    <h3 className="font-bold text-white font-heading text-lg leading-tight">{programTitle}</h3>
                </div>
                <div className="text-right">
                    <span className="text-3xl font-bold text-orange-500 font-heading">{currentWeek}</span>
                    <span className="text-stone-500 text-sm"> / {totalWeeks}</span>
                    <p className="text-xs text-stone-500">weeks</p>
                </div>
            </div>

            {/* Progress bar */}
            <div>
                <div className="w-full bg-stone-800 rounded-full h-2">
                    <div
                        className="h-2 bg-gradient-to-r from-orange-500 to-rose-500 rounded-full transition-all duration-700"
                        style={{ width: `${pct}%` }}
                    />
                </div>
                <div className="flex justify-between text-xs text-stone-500 mt-1">
                    <span>{pct}% complete</span>
                    <span>{totalWeeks - completedWeeks} weeks remaining</span>
                </div>
            </div>

            {/* Week bubbles */}
            <div className="flex flex-wrap gap-2">
                {Array.from({ length: totalWeeks }, (_, i) => i + 1).map(week => {
                    const done = week < currentWeek;
                    const active = week === currentWeek;
                    return (
                        <div
                            key={week}
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                                done
                                    ? 'bg-orange-500 text-white'
                                    : active
                                        ? 'bg-orange-500/20 border-2 border-orange-500 text-orange-400'
                                        : 'bg-stone-800 text-stone-600'
                            }`}
                        >
                            {done ? <CheckCircle2 className="w-4 h-4" /> : week}
                        </div>
                    );
                })}
            </div>

            {/* Behind schedule warning */}
            {behindSchedule && (
                <div className="flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/20 rounded-xl px-3 py-2">
                    <Calendar className="w-4 h-4 text-yellow-500 shrink-0" />
                    <p className="text-xs text-yellow-400">
                        You're behind schedule (expected week {expectedWeek}). Log this week's workouts to advance.
                    </p>
                </div>
            )}

            {/* Advance button */}
            {onAdvanceWeek && (
                <button
                    onClick={handleAdvance}
                    disabled={advancing}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-orange-500/10 hover:bg-orange-500 text-orange-400 hover:text-white border border-orange-500/20 rounded-2xl text-sm font-bold transition-all disabled:opacity-50"
                >
                    {advancing ? 'Advancing...' : `Mark Week ${currentWeek} Complete`}
                    <ChevronRight className="w-4 h-4" />
                </button>
            )}
        </div>
    );
}
