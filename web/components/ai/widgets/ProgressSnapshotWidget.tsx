"use client";

import React from 'react';
import { ProgressSnapshotWidget } from '@/types/chat-widgets';
import { TrendingUp, TrendingDown, Minus, Activity } from 'lucide-react';

export function ProgressSnapshotWidgetComponent({ widget }: { widget: ProgressSnapshotWidget }) {
    return (
        <div className="bg-white dark:bg-stone-900 border border-stone-100 dark:border-stone-800 rounded-3xl overflow-hidden shadow-lg my-2 w-full">
            <div className="bg-gradient-to-r from-teal-500 to-emerald-500 p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
                        <Activity className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h3 className="font-bold text-sm text-white">{widget.title || "Weekly Progress"}</h3>
                        <p className="text-[10px] uppercase tracking-wider font-bold text-white/80">Snapshot</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-px bg-stone-100 dark:bg-stone-800">
                {widget.metrics.map((metric, idx) => (
                    <div key={idx} className="bg-white dark:bg-stone-900 p-4 flex flex-col justify-between h-24">
                        <span className="text-xs font-bold text-stone-400 uppercase tracking-wide">{metric.label}</span>
                        <div className="flex items-end justify-between">
                            <span className="text-xl font-heading font-bold text-stone-900 dark:text-white">{metric.value}</span>
                            {metric.change && (
                                <div className={`flex items-center text-xs font-bold ${metric.trend === 'up' ? 'text-emerald-500' :
                                        metric.trend === 'down' ? 'text-rose-500' : 'text-stone-400'
                                    }`}>
                                    {metric.trend === 'up' && <TrendingUp className="w-3 h-3 mr-1" />}
                                    {metric.trend === 'down' && <TrendingDown className="w-3 h-3 mr-1" />}
                                    {metric.trend === 'neutral' && <Minus className="w-3 h-3 mr-1" />}
                                    {metric.change}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <div className="p-3 bg-stone-50 dark:bg-stone-900/50 border-t border-stone-100 dark:border-stone-800 text-center">
                <button className="text-xs font-bold text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-white transition-colors">
                    View Full Report →
                </button>
            </div>
        </div>
    );
}
