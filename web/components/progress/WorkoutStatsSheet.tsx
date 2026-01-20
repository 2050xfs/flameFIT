
"use client";

import React from 'react';
import { GeneratedWorkout } from '@/lib/types';
import { motion, AnimatePresence } from 'framer-motion';
import { X, TrendingUp, BarChart3, Clock, Flame, Info, CheckCircle2 } from 'lucide-react';

interface WorkoutStatsSheetProps {
    workout: GeneratedWorkout | null;
    onClose: () => void;
}

export function WorkoutStatsSheet({ workout, onClose }: WorkoutStatsSheetProps) {
    if (!workout) return null;

    // Mock history data for the graph
    const history = [
        { date: 'Jan 05', volume: workout.stats.volume * 0.8 },
        { date: 'Jan 10', volume: workout.stats.volume * 0.9 },
        { date: 'Jan 15', volume: workout.stats.volume },
    ];

    const maxVolume = Math.max(...history.map(h => h.volume));

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 overflow-hidden pointer-events-none">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-stone-950/60 backdrop-blur-sm pointer-events-auto"
                />

                {/* Sheet */}
                <motion.div
                    initial={{ x: '100%' }}
                    animate={{ x: 0 }}
                    exit={{ x: '100%' }}
                    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                    className="absolute inset-y-0 right-0 w-full max-w-md bg-white dark:bg-stone-900 shadow-2xl pointer-events-auto flex flex-col"
                >
                    {/* Header */}
                    <div className="p-6 border-b border-stone-100 dark:border-stone-800 flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-bold font-heading">{workout.title}</h2>
                            <p className="text-xs text-stone-500 uppercase font-bold tracking-widest mt-1">Symmetry Protocol Stats</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-full transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Scrollable Content */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-8">

                        {/* Summary Cards */}
                        <div className="grid grid-cols-2 gap-3">
                            <div className="bg-stone-50 dark:bg-stone-800/50 p-4 rounded-2xl border border-stone-100 dark:border-white/5">
                                <div className="flex items-center gap-2 mb-2">
                                    <BarChart3 className="w-4 h-4 text-orange-500" />
                                    <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Avg Volume</span>
                                </div>
                                <p className="text-xl font-bold">{(workout.stats.volume / 1000).toFixed(1)}k <span className="text-stone-500 text-xs font-normal">kg</span></p>
                            </div>
                            <div className="bg-stone-50 dark:bg-stone-800/50 p-4 rounded-2xl border border-stone-100 dark:border-white/5">
                                <div className="flex items-center gap-2 mb-2">
                                    <Flame className="w-4 h-4 text-orange-500" />
                                    <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">CNS Intensity</span>
                                </div>
                                <p className="text-xl font-bold">{workout.stats.intensity}/10</p>
                            </div>
                        </div>

                        {/* Volume Growth Chart (Mini SVG) */}
                        <section className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-sm font-bold uppercase tracking-widest text-stone-500">Volume Progression</h3>
                                <div className="flex items-center gap-1 text-teal-500 text-xs font-bold">
                                    <TrendingUp className="w-3 h-3" />
                                    +12.4%
                                </div>
                            </div>
                            <div className="bg-stone-50 dark:bg-stone-800/50 rounded-3xl p-6 border border-stone-100 dark:border-white/5">
                                <div className="h-32 flex items-end gap-2">
                                    {history.map((pt, i) => (
                                        <div key={i} className="flex-1 flex flex-col items-center gap-2">
                                            <motion.div
                                                initial={{ height: 0 }}
                                                animate={{ height: `${(pt.volume / maxVolume) * 100}%` }}
                                                className="w-full bg-orange-500 rounded-t-lg relative group"
                                            >
                                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-stone-900 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                                    {(pt.volume / 1000).toFixed(1)}k kg
                                                </div>
                                            </motion.div>
                                            <span className="text-[9px] text-stone-400 font-bold uppercase tracking-tighter">{pt.date}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>

                        {/* Exercises List */}
                        <section className="space-y-4">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-stone-500">Included Architectures</h3>
                            <div className="space-y-3">
                                {workout.exercises.map((ex, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-4 bg-stone-50 dark:bg-stone-800/50 rounded-2xl border border-stone-100 dark:border-white/5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-stone-900 dark:bg-white flex items-center justify-center text-xs font-bold text-white dark:text-stone-900">
                                                {idx + 1}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-sm">{ex.name}</h4>
                                                <p className="text-[10px] text-stone-500 uppercase tracking-widest">{ex.sets} sets × {ex.reps} reps</p>
                                            </div>
                                        </div>
                                        <CheckCircle2 className="w-4 h-4 text-orange-500/30" />
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Insights */}
                        <div className="p-4 bg-orange-500/5 border border-orange-500/10 rounded-2xl space-y-2">
                            <div className="flex items-center gap-2 text-orange-500">
                                <Info className="w-4 h-4" />
                                <span className="text-xs font-bold uppercase tracking-widest">Spark Insight</span>
                            </div>
                            <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
                                You reach peak volume at set 3. Consider increasing the initial load of {workout.exercises[0]?.name || 'the first exercise'} by 2.5kg to trigger better adaptation.
                            </p>
                        </div>

                    </div>

                    {/* Footer Actions */}
                    <div className="p-6 border-t border-stone-100 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-800/20">
                        <button
                            onClick={onClose}
                            className="w-full py-4 bg-orange-500 text-white rounded-2xl font-bold shadow-lg shadow-orange-500/20 hover:bg-orange-600 transition-all active:scale-[0.98]"
                        >
                            Sync to Lab
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
