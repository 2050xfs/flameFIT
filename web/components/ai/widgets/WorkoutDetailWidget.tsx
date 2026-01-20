"use client";

import React from 'react';
import { WorkoutDetailWidget } from '@/types/chat-widgets';
import { Play, Clock, Flame, Info } from 'lucide-react';

export function WorkoutDetailWidgetComponent({ widget, onStart }: { widget: WorkoutDetailWidget, onStart?: (id: string) => void }) {
    return (
        <div className="bg-white dark:bg-stone-900 border border-stone-100 dark:border-stone-800 rounded-3xl overflow-hidden shadow-xl my-3 w-full max-w-sm mx-auto">
            {/* Hero Section */}
            <div className="relative h-48 bg-stone-900 group">
                {/* Fallback pattern or image */}
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-60" />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-stone-900/40 to-transparent" />

                <div className="absolute top-4 right-4">
                    <span className="px-3 py-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-xs font-bold text-white uppercase tracking-wider">
                        {widget.stats.difficulty}
                    </span>
                </div>

                <div className="absolute bottom-4 left-4 right-4 text-white">
                    <h3 className="text-xl font-heading font-black mb-1">{widget.title}</h3>
                    <div className="flex items-center gap-4 text-xs font-medium text-stone-300">
                        <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {widget.stats.duration}</span>
                        <span className="flex items-center gap-1.5"><Flame className="w-3.5 h-3.5 text-orange-500" /> {widget.stats.burn}</span>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="p-5 space-y-4">
                <p className="text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
                    {widget.description}
                </p>

                <div className="space-y-2">
                    <h4 className="text-xs font-bold text-stone-400 uppercase tracking-widest flex items-center gap-1.5">
                        <Info className="w-3 h-3" /> Equipment
                    </h4>
                    <div className="flex flex-wrap gap-2">
                        {widget.equipment.map((item, idx) => (
                            <span key={idx} className="px-2.5 py-1 bg-stone-100 dark:bg-stone-800 rounded-lg text-xs font-bold text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-700">
                                {item}
                            </span>
                        ))}
                    </div>
                </div>

                <div className="pt-2">
                    <button
                        onClick={() => onStart && onStart(widget.id)}
                        className="w-full py-3.5 bg-orange-500 hover:bg-orange-600 active:scale-[0.98] transition-all text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20"
                    >
                        <Play className="w-4 h-4 fill-current" />
                        Start Session
                    </button>
                </div>
            </div>
        </div>
    );
}
