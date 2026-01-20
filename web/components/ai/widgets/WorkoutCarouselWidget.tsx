"use client";

import React from 'react';
import { WorkoutCarouselWidget } from '@/types/chat-widgets';
import { Dumbbell, Clock, ChevronRight } from 'lucide-react';
import Image from 'next/image';

export function WorkoutCarouselWidgetComponent({ widget, onSelect }: { widget: WorkoutCarouselWidget, onSelect?: (id: string) => void }) {
    return (
        <div className="my-2 space-y-2">
            <h3 className="text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider ml-1">{widget.title || "Recommended For You"}</h3>
            <div className="flex bg-stone-50 dark:bg-stone-800/20 p-2 rounded-2xl overflow-x-auto gap-3 snap-x no-scrollbar">
                {widget.items.map((item) => (
                    <div
                        key={item.id}
                        className="flex-shrink-0 w-48 snap-center bg-white dark:bg-stone-900 border border-stone-100 dark:border-stone-800 rounded-2xl overflow-hidden shadow-sm cursor-pointer hover:shadow-md transition-shadow group"
                        onClick={() => onSelect && onSelect(item.id)}
                    >
                        <div className="relative h-28 bg-stone-200 dark:bg-stone-800">
                            {/* Placeholder for real image since we don't have many assets yet */}
                            <div className="absolute inset-0 flex items-center justify-center bg-stone-100 dark:bg-stone-800 text-stone-300">
                                <Dumbbell className="w-8 h-8 opacity-20" />
                            </div>
                            {item.image && (
                                <img src={item.image} alt={item.title} className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" />
                            )}
                            <div className="absolute top-2 right-2 px-2 py-0.5 bg-black/50 backdrop-blur-md rounded-full text-[10px] font-bold text-white uppercase border border-white/10">
                                {item.difficulty}
                            </div>
                        </div>
                        <div className="p-3">
                            <h4 className="font-bold text-sm text-stone-900 dark:text-white leading-tight mb-1 line-clamp-2">{item.title}</h4>
                            <div className="flex items-center gap-1 text-[10px] font-medium text-stone-500">
                                <Clock className="w-3 h-3" />
                                {item.meta}
                            </div>
                        </div>
                    </div>
                ))}

                {/* Spacer for right padding */}
                <div className="w-2 flex-shrink-0" />
            </div>
        </div>
    );
}
