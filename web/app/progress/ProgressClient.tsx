"use client";

import React, { useState } from "react";
import { Progress, PhotoCompare } from "@/components/progress";
import { ProgressProps, ProgressData } from "@/lib/types";


// Pick only the data props, as callbacks are handled here
type ProgressClientData = Omit<ProgressProps, "onMetricChange" | "onComparePhotos">;

export function ProgressClient({ initialData }: { initialData: ProgressData }) {
    const [isComparing, setIsComparing] = useState(false);
    const [isLoggingWeight, setIsLoggingWeight] = useState(false);
    const [localData, setLocalData] = useState(initialData);

    const handleMetricChange = (metric: string) => {
        console.log("Metric changed:", metric);
    };

    const handleComparePhotos = () => {
        setIsComparing(true);
    };

    const handleBackFromCompare = () => {
        setIsComparing(false);
    };

    const handleLogWeight = () => {
        setIsLoggingWeight(true);
    };

    const performWeightLog = async (formData: FormData) => {
        const weight = Number(formData.get('weight'));
        const bodyFat = formData.get('bodyFat') ? Number(formData.get('bodyFat')) : undefined;

        if (!weight) return;

        // Optimistic Update
        const today = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        const newPoint = { date: today, value: weight };

        setLocalData((prev: ProgressData) => ({

            ...prev,
            charts: {
                ...prev.charts,
                weight: [...prev.charts.weight, newPoint]
            },
            stats: [
                { ...prev.stats[0], value: weight.toString() },
                ...prev.stats.slice(1)
            ]
        }));
        setIsLoggingWeight(false);

        // Server Action
        try {
            const { logWeightAction } = await import('./actions');
            await logWeightAction(weight, bodyFat);
        } catch (err) {
            console.error("Failed to log weight:", err);
            setLocalData(initialData); // Revert on failure
        }
    };

    if (isComparing) {
        return <PhotoCompare onBack={handleBackFromCompare} />;
    }

    return (
        <React.Fragment>
            {isLoggingWeight && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
                    <div className="bg-white dark:bg-stone-900 w-full max-w-sm rounded-3xl p-8 shadow-2xl">
                        <h3 className="font-bold text-2xl mb-6 font-heading">Log Progress</h3>
                        <form action={performWeightLog} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">Weight (lbs)</label>
                                <input
                                    autoFocus
                                    name="weight"
                                    type="number"
                                    step="0.1"
                                    placeholder="0.0"
                                    className="w-full bg-stone-100 dark:bg-stone-800 rounded-2xl px-5 py-4 outline-none focus:ring-2 ring-teal-500 text-xl font-bold"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">Body Fat % (Optional)</label>
                                <input
                                    name="bodyFat"
                                    type="number"
                                    step="0.1"
                                    placeholder="0.0"
                                    className="w-full bg-stone-100 dark:bg-stone-800 rounded-2xl px-5 py-4 outline-none focus:ring-2 ring-teal-500 text-xl"
                                />
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsLoggingWeight(false)}
                                    className="flex-1 py-4 text-stone-500 font-bold hover:bg-stone-100 dark:hover:bg-stone-800 rounded-2xl transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-4 bg-teal-500 text-white font-bold rounded-2xl shadow-lg shadow-teal-500/20 hover:bg-teal-600 transition-all"
                                >
                                    Save
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <Progress
                data={localData}
                onMetricChange={handleMetricChange}
                onComparePhotos={handleComparePhotos}
                onLogWeight={handleLogWeight}
            />
        </React.Fragment>
    );
}

