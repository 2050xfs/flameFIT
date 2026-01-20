"use client";

import React, { useState } from "react";
import { updateProfileAction, ProfileData } from "./actions";

interface ProfileClientProps {
    initialData: any;
}

export function ProfileClient({ initialData }: ProfileClientProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const [form, setForm] = useState<ProfileData>({
        name: initialData?.name || "",
        height: initialData?.height || 175,
        weight: initialData?.weight || 75,
        goals: initialData?.goals || [],
        preferences: initialData?.preferences || { theme: 'system', units: 'metric' },
    });

    const goalOptions = ["Lose Weight", "Gain Muscle", "Improve Endurance", "Maintenance", "Increase Strength"];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage(null);

        try {
            await updateProfileAction(form);
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
        } catch (err: any) {
            setMessage({ type: 'error', text: err.message || 'Failed to update profile' });
        } finally {
            setIsLoading(false);
        }
    };

    const toggleGoal = (goal: string) => {
        const currentGoals = form.goals || [];
        if (currentGoals.includes(goal)) {
            setForm({ ...form, goals: currentGoals.filter(g => g !== goal) });
        } else {
            setForm({ ...form, goals: [...currentGoals, goal] });
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {message && (
                <div className={`p-4 rounded-2xl text-sm font-medium ${message.type === 'success'
                        ? 'bg-teal-500/10 text-teal-600 border border-teal-500/20'
                        : 'bg-rose-500/10 text-rose-600 border border-rose-500/20'
                    }`}>
                    {message.text}
                </div>
            )}

            <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-8 shadow-sm space-y-8">
                {/* Basic Info */}
                <div className="space-y-4">
                    <h3 className="text-sm font-bold text-stone-400 uppercase tracking-widest">General Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-stone-500 uppercase px-1">Display Name</label>
                            <input
                                required
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                className="w-full bg-stone-50 dark:bg-stone-800/50 border border-stone-100 dark:border-stone-800 rounded-2xl p-4 text-stone-900 dark:text-white focus:ring-2 ring-orange-500 outline-none transition-all"
                            />
                        </div>
                    </div>
                </div>

                {/* Metrics */}
                <div className="space-y-4">
                    <h3 className="text-sm font-bold text-stone-400 uppercase tracking-widest">Body Metrics</h3>
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-stone-500 uppercase px-1">Height (cm)</label>
                            <input
                                type="number"
                                value={form.height}
                                onChange={(e) => setForm({ ...form, height: parseFloat(e.target.value) })}
                                className="w-full bg-stone-50 dark:bg-stone-800/50 border border-stone-100 dark:border-stone-800 rounded-2xl p-4 text-stone-900 dark:text-white focus:ring-2 ring-orange-500 outline-none transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-stone-500 uppercase px-1">Weight (kg)</label>
                            <input
                                type="number"
                                step="0.1"
                                value={form.weight}
                                onChange={(e) => setForm({ ...form, weight: parseFloat(e.target.value) })}
                                className="w-full bg-stone-50 dark:bg-stone-800/50 border border-stone-100 dark:border-stone-800 rounded-2xl p-4 text-stone-900 dark:text-white focus:ring-2 ring-orange-500 outline-none transition-all"
                            />
                        </div>
                    </div>
                </div>

                {/* Goals */}
                <div className="space-y-4">
                    <h3 className="text-sm font-bold text-stone-400 uppercase tracking-widest">Fitness Goals</h3>
                    <div className="flex flex-wrap gap-2">
                        {goalOptions.map(goal => (
                            <button
                                key={goal}
                                type="button"
                                onClick={() => toggleGoal(goal)}
                                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all border ${form.goals?.includes(goal)
                                        ? 'bg-orange-500 text-white border-orange-600 shadow-lg shadow-orange-500/20'
                                        : 'bg-stone-50 dark:bg-stone-800 text-stone-600 dark:text-stone-400 border-stone-100 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-700'
                                    }`}
                            >
                                {goal}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="pt-4">
                    <button
                        disabled={isLoading}
                        type="submit"
                        className="w-full py-5 bg-orange-500 hover:bg-orange-600 text-white rounded-2xl font-bold text-lg shadow-xl shadow-orange-500/30 transition-all active:scale-[0.98] disabled:opacity-50"
                    >
                        {isLoading ? "Saving Changes..." : "Update Profile"}
                    </button>
                </div>
            </div>
        </form>
    );
}
