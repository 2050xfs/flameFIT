"use client";

import React, { useState } from 'react';
import { SessionSchedulerWidget } from '@/types/chat-widgets';
import { Calendar, Clock, Video, CheckCircle2 } from 'lucide-react';

export function SessionSchedulerWidgetComponent({ widget, onSchedule }: { widget: SessionSchedulerWidget, onSchedule?: (slot: string) => void }) {
    const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
    const [isBooked, setIsBooked] = useState(false);

    const handleBook = () => {
        if (!selectedSlot) return;
        setIsBooked(true);
        if (onSchedule) onSchedule(selectedSlot);
    };

    if (isBooked) {
        return (
            <div className="bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-3xl p-6 flex flex-col items-center justify-center text-center animate-in fade-in zoom-in duration-300 my-2">
                <div className="w-12 h-12 bg-teal-500 rounded-full flex items-center justify-center mb-3 shadow-lg shadow-teal-500/20">
                    <CheckCircle2 className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-stone-900 dark:text-white mb-1">Session Confirmed!</h3>
                <p className="text-sm text-stone-500 dark:text-stone-400">You're booked with {widget.coachName}</p>
                <p className="text-xs font-bold text-teal-600 dark:text-teal-400 mt-2 bg-teal-50 dark:bg-teal-900/30 px-3 py-1 rounded-full">
                    {new Date(selectedSlot!).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
                </p>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-stone-900 border border-stone-100 dark:border-stone-800 rounded-3xl overflow-hidden shadow-lg my-2 w-full">
            <div className="p-4 border-b border-stone-100 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-800/30">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-sm text-stone-900 dark:text-white">Book Session</h3>
                    <Video className="w-4 h-4 text-stone-400" />
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-stone-200 dark:bg-stone-700 overflow-hidden">
                        {/* Placeholder avatar */}
                        <div className="w-full h-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 dark:text-orange-400 font-bold text-xs">
                            {widget.coachName.charAt(0)}
                        </div>
                    </div>
                    <div>
                        <p className="text-xs font-bold text-stone-700 dark:text-stone-300">{widget.coachName}</p>
                        <p className="text-[10px] text-stone-400">Certified Trainer</p>
                    </div>
                </div>
            </div>

            <div className="p-4">
                <div className="flex items-center gap-2 mb-3 text-xs font-bold text-stone-400 uppercase tracking-wide">
                    <Calendar className="w-3 h-3" />
                    <span>Available Slots Today</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                    {widget.availableSlots.map((slot) => {
                        const date = new Date(slot);
                        const timeStr = date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
                        const isSelected = selectedSlot === slot;

                        return (
                            <button
                                key={slot}
                                onClick={() => setSelectedSlot(slot)}
                                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border ${isSelected
                                        ? 'bg-stone-900 dark:bg-white text-white dark:text-stone-900 border-stone-900 dark:border-white shadow-md transform scale-[1.02]'
                                        : 'bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:border-stone-300 dark:hover:border-stone-600'
                                    }`}
                            >
                                {timeStr}
                            </button>
                        );
                    })}
                </div>

                <div className="mt-4 pt-3 border-t border-stone-100 dark:border-stone-800">
                    <button
                        onClick={handleBook}
                        disabled={!selectedSlot}
                        className="w-full py-3 bg-teal-500 hover:bg-teal-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-teal-500/20 active:scale-[0.98]"
                    >
                        Confirm Booking
                    </button>
                </div>
            </div>
        </div>
    );
}
