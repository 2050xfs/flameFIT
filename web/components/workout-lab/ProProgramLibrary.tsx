import React from 'react';
import type { ProProgram } from '@/lib/types';
import { Trophy, Clock, BarChart, CheckCircle2 } from 'lucide-react';
import Image from 'next/image';

interface ProProgramLibraryProps {
    programs: ProProgram[];
    onSubscribe?: (id: string) => void;
    onViewDetails?: (id: string) => void;
}

export function ProProgramLibrary({ programs, onSubscribe, onViewDetails }: ProProgramLibraryProps) {
    if (!programs.length) return null;

    return (
        <section className="space-y-6">
            <div className="flex items-center justify-between px-2">
                <div>
                    <h3 className="text-2xl font-bold text-stone-900 dark:text-white font-heading tracking-tight">The Pro Collection</h3>
                    <p className="text-stone-500 dark:text-stone-400 text-sm">ARCHITECTED BY LEGENDS. OPTIMIZED FOR ELITE PERFORMANCE.</p>
                </div>
                <div className="hidden sm:flex gap-2">
                    <div className="px-3 py-1 bg-stone-100 dark:bg-stone-800 rounded-full text-[10px] font-bold text-stone-500 uppercase tracking-widest">
                        Scroll to Explore
                    </div>
                </div>
            </div>

            <div className="relative group">
                <div className="flex gap-6 overflow-x-auto pb-8 pt-2 no-scrollbar scroll-smooth snap-x snap-mandatory px-2">
                    {programs.map((program) => (
                        <div
                            key={program.id}
                            className="flex-shrink-0 w-[320px] sm:w-[400px] snap-start group/card"
                        >
                            <div className="relative overflow-hidden bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-[2.5rem] p-6 hover:shadow-2xl hover:shadow-orange-500/10 transition-all duration-500 group-hover/card:-translate-y-2 h-full flex flex-col">
                                {/* Status Badge */}
                                <div className="absolute top-6 right-6 z-10">
                                    <div className="px-3 py-1 bg-orange-500 text-white text-[9px] font-black uppercase tracking-[0.2em] rounded-full shadow-lg shadow-orange-500/20">
                                        Elite Tier
                                    </div>
                                </div>

                                {/* Thumbnail */}
                                <div className="relative w-full h-52 rounded-[1.5rem] bg-stone-100 dark:bg-stone-800 border border-stone-100 dark:border-stone-700 overflow-hidden mb-6 group-hover/card:shadow-xl transition-all duration-500">
                                    {program.thumbnailUrl ? (
                                        <Image
                                            src={program.thumbnailUrl}
                                            alt={program.title}
                                            fill
                                            sizes="(max-width: 640px) 320px, 400px"
                                            className="object-cover group-hover/card:scale-110 transition-transform duration-700"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex flex-col items-center justify-center gap-3">
                                            <Trophy className="w-10 h-10 text-stone-300 dark:text-stone-700" />
                                            <div className="h-1 w-12 bg-orange-500/50 rounded-full" />
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 flex items-end p-6">
                                        <span className="text-white text-[10px] font-bold uppercase tracking-widest">View Curriculum</span>
                                    </div>
                                </div>

                                <div className="flex flex-col flex-1">
                                    <div className="mb-2 flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
                                        <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest">{program.creator}</span>
                                    </div>
                                    <h4 className="text-2xl font-bold text-stone-900 dark:text-white font-heading mb-3 leading-tight leading-[1.1]">{program.title}</h4>

                                    <p className="text-stone-500 dark:text-stone-400 text-sm line-clamp-2 mb-6 leading-relaxed font-medium">
                                        {program.description}
                                    </p>

                                    {/* Spark Intel Badge */}
                                    <div className="mb-6 p-3 rounded-2xl bg-orange-500/5 border border-orange-500/10 flex items-start gap-3">
                                        <div className="w-6 h-6 rounded-lg bg-orange-500 flex items-center justify-center flex-shrink-0 animate-pulse">
                                            <Trophy className="w-3 h-3 text-white" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-stone-900 dark:text-white uppercase tracking-wider mb-0.5">Spark's Analysis</p>
                                            <p className="text-[10px] text-stone-500 dark:text-stone-400 font-medium leading-normal">Optimized for CNS recovery and hypertrophy.</p>
                                        </div>
                                    </div>

                                    <div className="mt-auto">
                                        <div className="flex items-center gap-4 text-[10px] font-black text-stone-400 uppercase tracking-[0.15em] mb-6 border-t border-stone-100 dark:border-stone-800 pt-6">
                                            <div className="flex items-center gap-2">
                                                <Clock className="w-3.5 h-3.5" />
                                                {program.durationWeeks}W
                                            </div>
                                            <div className="w-px h-3 bg-stone-200 dark:bg-stone-800" />
                                            <div className="flex items-center gap-2">
                                                <BarChart className="w-3.5 h-3.5" />
                                                {program.difficulty}
                                            </div>
                                        </div>

                                        <div className="flex gap-2">
                                            {program.isOwned ? (
                                                <button
                                                    disabled
                                                    className="flex-1 py-4 bg-teal-500/10 text-teal-500 rounded-2xl font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-2"
                                                >
                                                    <CheckCircle2 className="w-4 h-4" />
                                                    Active Protocol
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => onSubscribe?.(program.id)}
                                                    className="flex-1 py-4 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-950 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-orange-500 dark:hover:bg-white hover:text-white hover:shadow-lg hover:shadow-orange-500/20 transition-all active:scale-[0.98]"
                                                >
                                                    Subscribe
                                                </button>
                                            )}
                                            <button
                                                onClick={() => onViewDetails?.(program.id)}
                                                className="px-6 py-4 border-2 border-stone-100 dark:border-stone-800 text-stone-600 dark:text-stone-400 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:border-orange-500/30 hover:text-orange-500 transition-all active:scale-[0.98]"
                                            >
                                                Details
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                    {/* Empty spacer for end of scroll */}
                    <div className="flex-shrink-0 w-4" />
                </div>
            </div>
        </section>
    );
}
