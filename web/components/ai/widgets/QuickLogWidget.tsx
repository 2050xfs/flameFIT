"use client";

import React, { useState } from 'react';
import { QuickLogWidget } from '@/types/chat-widgets';
import { Play, Check, Loader2 } from 'lucide-react';
import { submitQuickLog } from '@/app/actions/chat-actions';

interface QuickLogWidgetProps {
    widget: QuickLogWidget;
    onComplete?: () => void;
}

export function QuickLogWidgetComponent({ widget, onComplete }: QuickLogWidgetProps) {
    const [values, setValues] = useState<Record<string, string>>(() => {
        const initial: Record<string, string> = {};
        widget.inputs.forEach(input => {
            if (input.value) initial[input.name] = input.value;
        });
        return initial;
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await submitQuickLog(values);
            setIsSubmitting(false);
            setIsSubmitted(true);
            if (onComplete) onComplete();
        } catch (error) {
            console.error("Failed to log", error);
            setIsSubmitting(false);
        }
    };

    if (isSubmitted) {
        return (
            <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800 rounded-2xl p-6 flex flex-col items-center justify-center text-center animate-in fade-in zoom-in duration-300">
                <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center mb-3 shadow-lg shadow-emerald-500/20">
                    <Check className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-stone-900 dark:text-white mb-1">Logged Successfully!</h3>
                <p className="text-sm text-stone-500 dark:text-stone-400">Your activity has been tracked.</p>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-stone-900 border border-stone-100 dark:border-stone-800 rounded-3xl overflow-hidden shadow-lg my-2">
            <div className="bg-stone-50 dark:bg-stone-800/50 p-4 border-b border-stone-100 dark:border-stone-800 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center shadow-md shadow-orange-500/20">
                    <Play className="w-4 h-4 text-white fill-current" />
                </div>
                <div>
                    <h3 className="font-bold text-sm text-stone-900 dark:text-white">{widget.title || "Quick Log"}</h3>
                    <p className="text-[10px] uppercase tracking-wider font-bold text-stone-400">One-Tap Tracking</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="p-4 space-y-4">
                {widget.inputs.map(input => (
                    <div key={input.name}>
                        <label className="block text-xs font-bold text-stone-500 dark:text-stone-400 uppercase mb-1.5 ml-1">
                            {input.label}
                        </label>
                        {input.type === 'select' ? (
                            <select
                                value={values[input.name] || ''}
                                onChange={e => setValues({ ...values, [input.name]: e.target.value })}
                                className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all font-medium appearance-none"
                            >
                                <option value="" disabled>Select {input.label}</option>
                                {input.options?.map(opt => (
                                    <option key={opt} value={opt}>{opt}</option>
                                ))}
                            </select>
                        ) : (
                            <input
                                type={input.type}
                                value={values[input.name] || ''}
                                onChange={e => setValues({ ...values, [input.name]: e.target.value })}
                                className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all font-medium"
                                placeholder={input.label}
                            />
                        )}
                    </div>
                ))}

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 bg-stone-900 dark:bg-white text-white dark:text-stone-900 rounded-xl font-bold text-sm hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
                >
                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : widget.submitLabel}
                </button>
            </form>
        </div>
    );
}
