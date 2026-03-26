"use client";

import React, { useOptimistic, startTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { Dashboard } from "@/components/dashboard/Dashboard";
import { DashboardProps } from "@/lib/types";
import { Moon, Smile, Zap, X } from "lucide-react";

type DashboardData = Omit<DashboardProps, "onStartWorkout" | "onLogMeal" | "onViewDetails">;

function ReadinessModal({ onClose, onSave }: { onClose: () => void; onSave: (data: any) => Promise<void> }) {
    const [sleep, setSleep] = useState(7.5);
    const [sleepQuality, setSleepQuality] = useState(3);
    const [mood, setMood] = useState(3);
    const [soreness, setSoreness] = useState(2);
    const [saving, setSaving] = useState(false);

    const labels5 = ['Very Bad', 'Bad', 'Okay', 'Good', 'Excellent'];
    const sorenessLabels = ['None', 'Mild', 'Moderate', 'High', 'Extreme'];

    const handleSave = async () => {
        setSaving(true);
        try {
            await onSave({ sleepHours: sleep, sleepQuality, mood, soreness });
            onClose();
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
            <div className="bg-white dark:bg-stone-900 w-full max-w-sm rounded-3xl p-8 shadow-2xl">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="font-bold text-xl font-heading">Daily Check-In</h3>
                    <button onClick={onClose} className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-200">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="space-y-6">
                    {/* Sleep Hours */}
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <Moon className="w-4 h-4 text-indigo-500" />
                            <label className="text-sm font-bold text-stone-700 dark:text-stone-300">Sleep Hours</label>
                            <span className="ml-auto text-lg font-bold font-heading text-stone-900 dark:text-white">{sleep}h</span>
                        </div>
                        <input
                            type="range" min="3" max="12" step="0.5"
                            value={sleep}
                            onChange={e => setSleep(Number(e.target.value))}
                            className="w-full accent-indigo-500"
                        />
                        <div className="flex justify-between text-xs text-stone-400 mt-1">
                            <span>3h</span><span>12h</span>
                        </div>
                    </div>

                    {/* Sleep Quality */}
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Moon className="w-4 h-4 text-indigo-400" />
                            <label className="text-sm font-bold text-stone-700 dark:text-stone-300">Sleep Quality</label>
                        </div>
                        <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map(v => (
                                <button
                                    key={v}
                                    onClick={() => setSleepQuality(v)}
                                    className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${sleepQuality === v ? 'bg-indigo-500 text-white' : 'bg-stone-100 dark:bg-stone-800 text-stone-500 hover:bg-stone-200 dark:hover:bg-stone-700'}`}
                                >
                                    {v}
                                </button>
                            ))}
                        </div>
                        <p className="text-xs text-stone-400 text-center mt-1">{labels5[sleepQuality - 1]}</p>
                    </div>

                    {/* Mood */}
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Smile className="w-4 h-4 text-yellow-500" />
                            <label className="text-sm font-bold text-stone-700 dark:text-stone-300">Mood & Energy</label>
                        </div>
                        <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map(v => (
                                <button
                                    key={v}
                                    onClick={() => setMood(v)}
                                    className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${mood === v ? 'bg-yellow-500 text-white' : 'bg-stone-100 dark:bg-stone-800 text-stone-500 hover:bg-stone-200 dark:hover:bg-stone-700'}`}
                                >
                                    {['😔', '😐', '🙂', '😊', '🔥'][v - 1]}
                                </button>
                            ))}
                        </div>
                        <p className="text-xs text-stone-400 text-center mt-1">{labels5[mood - 1]}</p>
                    </div>

                    {/* Soreness */}
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Zap className="w-4 h-4 text-rose-500" />
                            <label className="text-sm font-bold text-stone-700 dark:text-stone-300">Muscle Soreness</label>
                        </div>
                        <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map(v => (
                                <button
                                    key={v}
                                    onClick={() => setSoreness(v)}
                                    className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${soreness === v ? 'bg-rose-500 text-white' : 'bg-stone-100 dark:bg-stone-800 text-stone-500 hover:bg-stone-200 dark:hover:bg-stone-700'}`}
                                >
                                    {v}
                                </button>
                            ))}
                        </div>
                        <p className="text-xs text-stone-400 text-center mt-1">{sorenessLabels[soreness - 1]}</p>
                    </div>
                </div>

                <div className="flex gap-3 mt-8">
                    <button
                        onClick={onClose}
                        className="flex-1 py-3.5 text-stone-500 font-bold hover:bg-stone-100 dark:hover:bg-stone-800 rounded-2xl transition-all text-sm"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex-1 py-3.5 bg-orange-500 text-white font-bold rounded-2xl shadow-lg shadow-orange-500/20 hover:bg-orange-600 disabled:opacity-50 transition-all text-sm"
                    >
                        {saving ? 'Saving...' : 'Save Check-In'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export function DashboardClient({ initialData }: { initialData: DashboardData }) {
    const router = useRouter();
    const [showReadinessModal, setShowReadinessModal] = useState(false);
    const [optimisticWater, addOptimisticWater] = useOptimistic(
        initialData.water,
        (state, amount: number) => ({ ...state, current: state.current + amount })
    );

    const handleStartWorkout = (_id: string) => {
        router.push('/workouts');
    };

    const handleLogMeal = () => {
        router.push('/kitchen');
    };

    const handleViewDetails = (id: string) => {
        const item = initialData.timeline.find(t => t.id === id);
        if (item) {
            if (item.type === 'workout') router.push('/workouts');
            else if (item.type === 'meal') router.push('/kitchen');
        }
    };

    const handleInsightAction = () => {
        const insight = initialData.insight;
        if (!insight) return;

        const actionText = (insight.actionLabel || "").toLowerCase();
        const messageText = (insight.message || "").toLowerCase();

        if (actionText.includes('profile') || messageText.includes('profile')) {
            router.push('/profile');
        } else if (
            actionText.includes('training') || actionText.includes('session') ||
            actionText.includes('workout') || messageText.includes('workout')
        ) {
            router.push('/workouts');
        } else if (
            actionText.includes('protein') || actionText.includes('log') ||
            messageText.includes('fuel') || messageText.includes('snack')
        ) {
            router.push('/kitchen');
        }
    };

    const handleAddWater = async () => {
        startTransition(async () => {
            addOptimisticWater(1);
            try {
                const { updateWaterAction } = await import('@/app/kitchen/actions');
                await updateWaterAction(1);
            } catch (err) {
                console.error("Failed to update water:", err);
            }
        });
    };

    const handleSaveReadiness = async (data: any) => {
        const { logReadinessAction } = await import('@/app/dashboard/actions');
        await logReadinessAction(data);
        router.refresh();
    };

    return (
        <>
            {showReadinessModal && (
                <ReadinessModal
                    onClose={() => setShowReadinessModal(false)}
                    onSave={handleSaveReadiness}
                />
            )}
            <Dashboard
                {...initialData}
                water={optimisticWater}
                onStartWorkout={handleStartWorkout}
                onLogMeal={handleLogMeal}
                onAddWater={handleAddWater}
                onViewDetails={handleViewDetails}
                onInsightAction={handleInsightAction}
                onLogReadiness={() => setShowReadinessModal(true)}
            />
        </>
    );
}
