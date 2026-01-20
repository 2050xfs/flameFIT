
"use client";

import React, { useState } from 'react';
import { DetailedProProgram } from '@/lib/api/programs';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, ChevronDown, ChevronUp, BookOpen, Crown, User, Calendar, Flame, CheckCircle2, Lock } from 'lucide-react';
import Image from 'next/image';
import { PremiumGate } from '@/components/ui/PremiumGate';
import Link from 'next/link';

interface ProProgramDetailProps {
    program: DetailedProProgram;
}

export function ProProgramDetail({ program }: ProProgramDetailProps) {
    const [expandedChapter, setExpandedChapter] = useState<string | null>(null);

    return (
        <div className="min-h-screen bg-stone-950 text-white pb-32">
            {/* 1. Hero / Cover Section */}
            <div className="relative h-[70vh] w-full overflow-hidden">
                <Image
                    src={program.thumbnailUrl || '/placeholder-program.jpg'}
                    alt={program.title}
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent" />

                <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-12 max-w-5xl mx-auto w-full">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-4"
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500 text-white text-[10px] font-bold uppercase tracking-widest">
                            <Crown className="w-3 h-3 fill-current" />
                            Signature Series
                        </div>
                        <h1 className="text-5xl md:text-7xl font-bold font-heading leading-none">
                            {program.title}
                        </h1>
                        <div className="flex flex-wrap gap-4 text-stone-300 items-center">
                            <div className="flex items-center gap-2">
                                <User className="w-4 h-4 text-orange-500" />
                                <span className="font-bold">{program.author.name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-orange-500" />
                                <span>{program.durationWeeks} Weeks</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Flame className="w-4 h-4 text-orange-500" />
                                <span>{program.difficulty}</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* 2. Content Body */}
            <div className="max-w-5xl mx-auto p-6 md:p-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

                    {/* Left: Synopsis & TOC */}
                    <div className="lg:col-span-2 space-y-12">
                        {/* Synopsis */}
                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold font-heading flex items-center gap-2 text-orange-500">
                                <BookOpen className="w-6 h-6" />
                                Evolution Blueprint
                            </h2>
                            <p className="text-stone-400 text-lg leading-relaxed">
                                {program.synopsis}
                            </p>
                        </section>

                        {/* Table of Contents / Curriculum */}
                        <section className="space-y-6">
                            <h2 className="text-2xl font-bold font-heading">Curriculum</h2>
                            <div className="space-y-3">
                                {program.chapters.map((chapter, idx) => (
                                    <div
                                        key={chapter.id}
                                        className={`rounded-2xl border transition-all ${expandedChapter === chapter.id
                                            ? 'bg-stone-900 border-orange-500/50'
                                            : 'bg-stone-900/50 border-white/5 hover:border-white/10'
                                            }`}
                                    >
                                        <button
                                            onClick={() => setExpandedChapter(expandedChapter === chapter.id ? null : chapter.id)}
                                            className="w-full text-left p-4 flex items-center justify-between"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="w-8 h-8 rounded-full bg-stone-800 flex items-center justify-center text-xs font-bold font-mono text-stone-500">
                                                    {idx + 1}
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-lg">{chapter.title}</h3>
                                                    <p className="text-xs text-stone-500 uppercase tracking-wider">{chapter.duration}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                {chapter.isFreePreview && (
                                                    <span className="text-[10px] font-bold bg-teal-500/10 text-teal-500 px-2 py-0.5 rounded uppercase">Preview</span>
                                                )}
                                                {expandedChapter === chapter.id ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                                            </div>
                                        </button>

                                        <AnimatePresence>
                                            {expandedChapter === chapter.id && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    className="overflow-hidden"
                                                >
                                                    <div className="p-4 pt-0 border-t border-white/5 mt-2 space-y-4">
                                                        <p className="text-stone-400 text-sm leading-relaxed">
                                                            {chapter.description}
                                                        </p>

                                                        {/* Premium Gate within TOC */}
                                                        {!chapter.isFreePreview ? (
                                                            <div className="bg-stone-950 rounded-xl p-8 text-center space-y-4 border border-white/5">
                                                                <Lock className="w-8 h-8 text-orange-500 mx-auto" />
                                                                <div>
                                                                    <p className="font-bold">Content Locked</p>
                                                                    <p className="text-xs text-stone-500">Subscribe to Flame Fit Pro to unlock this phase.</p>
                                                                </div>
                                                                <Link
                                                                    href={`/workouts/pro/${program.id}/subscribe`}
                                                                    className="inline-block bg-orange-500 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg shadow-orange-500/20 hover:bg-orange-600 transition-colors"
                                                                >
                                                                    Unlock Program
                                                                </Link>
                                                            </div>
                                                        ) : (
                                                            <div className="space-y-4">
                                                                <div className="aspect-video bg-stone-800 rounded-xl flex items-center justify-center relative group cursor-pointer overflow-hidden">
                                                                    <div className="absolute inset-0 bg-stone-900/50 group-hover:bg-stone-900/0 transition-colors" />
                                                                    <Play className="w-12 h-12 text-white relative z-10 drop-shadow-2xl" />
                                                                    <p className="absolute bottom-4 left-4 text-xs font-bold text-white uppercase tracking-wider">Exercise Introduction</p>
                                                                </div>
                                                                <button className="w-full py-4 bg-white text-stone-950 rounded-xl font-bold hover:bg-stone-100 transition-all flex items-center justify-center gap-2">
                                                                    <Play className="w-5 h-5 fill-current" />
                                                                    Start Free Preview Day
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* Right: Author Bio & Sticky Buy */}
                    <div className="space-y-8">
                        {/* Author Card */}
                        <div className="bg-stone-900 rounded-3xl p-6 border border-white/5 space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-2xl bg-stone-800 relative overflow-hidden flex-shrink-0">
                                    {/* Author image placeholder */}
                                    {/* <Image src={program.author.image} alt={program.author.name} fill /> */}
                                    <div className="absolute inset-0 flex items-center justify-center text-stone-600 font-bold">
                                        {program.author.name[0]}
                                    </div>
                                </div>
                                <div>
                                    <h4 className="font-bold text-lg">{program.author.name}</h4>
                                    <p className="text-xs text-orange-500 font-bold uppercase tracking-wider">{program.author.title}</p>
                                </div>
                            </div>
                            <p className="text-sm text-stone-400 italic">
                                "{program.author.bio}"
                            </p>
                        </div>

                        {/* Checklist */}
                        <div className="space-y-4">
                            <h4 className="text-sm font-bold uppercase tracking-widest text-stone-500">Included in Program</h4>
                            <div className="space-y-2">
                                {[
                                    'Complete 4-Week Curriculum',
                                    'Instructional Video Library',
                                    'Specific Rep Ranges & Tempos',
                                    'Nutrition & Recovery Add-on',
                                    'Direct Community Access'
                                ].map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-3 text-sm text-stone-300">
                                        <CheckCircle2 className="w-4 h-4 text-orange-500" />
                                        {item}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* Bottom Sticky Action */}
            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[calc(100%-3rem)] max-w-lg bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-4 flex items-center justify-between shadow-2xl z-50">
                <div className="px-4">
                    <p className="text-[10px] text-stone-400 uppercase font-bold tracking-widest">Pricing</p>
                    <p className="text-xl font-bold">$49.00 <span className="text-xs font-normal text-stone-500">one-time</span></p>
                </div>
                <Link
                    href={`/workouts/pro/${program.id}/subscribe`}
                    className="bg-orange-500 text-white px-8 py-3 rounded-2xl font-bold shadow-lg shadow-orange-500/30 hover:bg-orange-600 transition-all flex items-center gap-2"
                >
                    Start Protocol
                    <Crown className="w-4 h-4 fill-current" />
                </Link>
            </div>
        </div>
    );
}
