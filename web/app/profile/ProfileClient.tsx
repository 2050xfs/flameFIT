"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { updateProfileAction, ProfileData } from "./actions";
import { Crown, Zap, Check, Loader2, User } from "lucide-react";

interface ProfileClientProps {
    initialData: any;
}

function SubscriptionPanel({ currentTier }: { currentTier: 'free' | 'pro' | 'elite' }) {
    const [loading, setLoading] = useState<string | null>(null);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const plans = [
        {
            id: 'free' as const,
            name: 'Spark Free',
            price: '$0',
            period: 'forever',
            icon: User,
            color: 'stone',
            features: [
                'AI-powered workout builder',
                'Nutrition & macro tracking',
                'Hydration logging',
                'Knowledge base access',
                'Progress analytics',
            ],
        },
        {
            id: 'pro' as const,
            name: 'Spark Pro',
            price: '$19',
            period: 'per month',
            icon: Zap,
            color: 'orange',
            features: [
                'Everything in Free',
                'Signature Series programs',
                'Advanced AI readiness scoring',
                'Priority Spark AI responses',
                'Photo progress comparison',
                'Barcode food scanning',
            ],
        },
        {
            id: 'elite' as const,
            name: 'Spark Elite',
            price: '$49',
            period: 'per month',
            icon: Crown,
            color: 'yellow',
            features: [
                'Everything in Pro',
                'Personal AI body coach',
                'Custom macro targets',
                'Unlimited program library',
                'Early access to new features',
                'White-glove onboarding',
            ],
        },
    ];

    const handleUpgrade = async (tier: 'pro' | 'elite') => {
        setLoading(tier);
        setMessage(null);
        try {
            const { upgradeSubscriptionAction } = await import('./actions');
            await upgradeSubscriptionAction(tier);
            setMessage({ type: 'success', text: `Successfully upgraded to ${tier.charAt(0).toUpperCase() + tier.slice(1)}!` });
        } catch (err: any) {
            setMessage({ type: 'error', text: err.message || 'Upgrade failed' });
        } finally {
            setLoading(null);
        }
    };

    const handleCancel = async () => {
        if (!confirm('Are you sure you want to cancel your subscription?')) return;
        setLoading('cancel');
        setMessage(null);
        try {
            const { cancelSubscriptionAction } = await import('./actions');
            await cancelSubscriptionAction();
            setMessage({ type: 'success', text: 'Subscription cancelled. You now have Free tier access.' });
        } catch (err: any) {
            setMessage({ type: 'error', text: err.message || 'Cancellation failed' });
        } finally {
            setLoading(null);
        }
    };

    return (
        <div className="space-y-6">
            {/* Current status banner */}
            <div className={`p-5 rounded-2xl border flex items-center gap-4 ${currentTier === 'elite' ? 'bg-yellow-50 dark:bg-yellow-900/10 border-yellow-200 dark:border-yellow-800' : currentTier === 'pro' ? 'bg-orange-50 dark:bg-orange-900/10 border-orange-200 dark:border-orange-800' : 'bg-stone-50 dark:bg-stone-800/50 border-stone-200 dark:border-stone-800'}`}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${currentTier === 'elite' ? 'bg-yellow-500' : currentTier === 'pro' ? 'bg-orange-500' : 'bg-stone-500'}`}>
                    {currentTier === 'elite' ? <Crown className="w-5 h-5 text-white" /> : currentTier === 'pro' ? <Zap className="w-5 h-5 text-white" /> : <User className="w-5 h-5 text-white" />}
                </div>
                <div>
                    <p className="font-bold text-stone-900 dark:text-white">
                        Current Plan: <span className="capitalize">{currentTier}</span>
                    </p>
                    <p className="text-sm text-stone-500 dark:text-stone-400">
                        {currentTier === 'free' ? 'Upgrade to unlock premium features' : 'Full premium access active'}
                    </p>
                </div>
                {currentTier !== 'free' && (
                    <button
                        onClick={handleCancel}
                        disabled={loading === 'cancel'}
                        className="ml-auto text-xs text-stone-400 hover:text-rose-500 transition-colors font-medium"
                    >
                        {loading === 'cancel' ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Cancel'}
                    </button>
                )}
            </div>

            {message && (
                <div className={`p-4 rounded-2xl text-sm font-medium ${message.type === 'success' ? 'bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800' : 'bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800'}`}>
                    {message.text}
                </div>
            )}

            {/* Plan cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {plans.map(plan => {
                    const Icon = plan.icon;
                    const isCurrent = currentTier === plan.id;
                    const isUpgrade = plans.findIndex(p => p.id === plan.id) > plans.findIndex(p => p.id === currentTier);
                    const isLoading = loading === plan.id;

                    return (
                        <div
                            key={plan.id}
                            className={`relative rounded-3xl p-6 border-2 transition-all ${isCurrent ? (plan.color === 'yellow' ? 'border-yellow-500 bg-yellow-50/50 dark:bg-yellow-900/10' : plan.color === 'orange' ? 'border-orange-500 bg-orange-50/50 dark:bg-orange-900/10' : 'border-stone-400 bg-stone-50 dark:bg-stone-800/50') : 'border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900'}`}
                        >
                            {isCurrent && (
                                <div className={`absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-white ${plan.color === 'yellow' ? 'bg-yellow-500' : plan.color === 'orange' ? 'bg-orange-500' : 'bg-stone-600'}`}>
                                    Current Plan
                                </div>
                            )}

                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${plan.color === 'yellow' ? 'bg-yellow-500' : plan.color === 'orange' ? 'bg-orange-500' : 'bg-stone-200 dark:bg-stone-700'}`}>
                                <Icon className={`w-5 h-5 ${plan.color !== 'stone' ? 'text-white' : 'text-stone-600 dark:text-stone-300'}`} />
                            </div>

                            <h4 className="font-bold text-stone-900 dark:text-white mb-1">{plan.name}</h4>
                            <div className="flex items-end gap-1 mb-4">
                                <span className="text-2xl font-black font-heading text-stone-900 dark:text-white">{plan.price}</span>
                                <span className="text-xs text-stone-400 mb-1">/{plan.period}</span>
                            </div>

                            <ul className="space-y-2 mb-6">
                                {plan.features.map((f, i) => (
                                    <li key={i} className="flex items-start gap-2 text-xs text-stone-600 dark:text-stone-400">
                                        <Check className={`w-3.5 h-3.5 mt-0.5 flex-shrink-0 ${plan.color === 'yellow' ? 'text-yellow-500' : plan.color === 'orange' ? 'text-orange-500' : 'text-stone-400'}`} />
                                        {f}
                                    </li>
                                ))}
                            </ul>

                            {plan.id !== 'free' && !isCurrent && isUpgrade && (
                                <button
                                    onClick={() => handleUpgrade(plan.id as 'pro' | 'elite')}
                                    disabled={!!loading}
                                    className={`w-full py-3 rounded-2xl text-xs font-black uppercase tracking-wider transition-all disabled:opacity-50 flex items-center justify-center gap-2 ${plan.color === 'yellow' ? 'bg-yellow-500 hover:bg-yellow-600 text-white shadow-lg shadow-yellow-500/20' : 'bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/20'}`}
                                >
                                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Icon className="w-4 h-4" />}
                                    {isLoading ? 'Upgrading...' : `Upgrade to ${plan.name}`}
                                </button>
                            )}

                            {isCurrent && (
                                <div className={`w-full py-3 rounded-2xl text-xs font-black uppercase tracking-wider text-center ${plan.color === 'yellow' ? 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400' : plan.color === 'orange' ? 'bg-orange-500/10 text-orange-600 dark:text-orange-400' : 'bg-stone-100 dark:bg-stone-800 text-stone-500'}`}>
                                    Active
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            <p className="text-xs text-stone-400 text-center">
                Plans are billed annually. Cancel anytime. No hidden fees.
            </p>
        </div>
    );
}

export function ProfileClient({ initialData }: ProfileClientProps) {
    const searchParams = useSearchParams();
    const tabParam = searchParams.get('tab');
    const [activeTab, setActiveTab] = useState<'profile' | 'subscription'>(
        tabParam === 'subscription' ? 'subscription' : 'profile'
    );

    useEffect(() => {
        if (tabParam === 'subscription') setActiveTab('subscription');
    }, [tabParam]);

    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

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
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Tab switcher */}
            <div className="flex bg-stone-100 dark:bg-stone-800 p-1 rounded-2xl w-fit">
                {[
                    { id: 'profile', label: 'Profile' },
                    { id: 'subscription', label: 'Subscription' },
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === tab.id ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-white shadow-sm' : 'text-stone-500 hover:text-stone-700 dark:hover:text-stone-300'}`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Profile Tab */}
            {activeTab === 'profile' && (
                <form onSubmit={handleSubmit} className="space-y-8">
                    {message && (
                        <div className={`p-4 rounded-2xl text-sm font-medium ${message.type === 'success' ? 'bg-teal-500/10 text-teal-600 border border-teal-500/20' : 'bg-rose-500/10 text-rose-600 border border-rose-500/20'}`}>
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

                        {/* Preferences */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-bold text-stone-400 uppercase tracking-widest">Preferences</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-stone-500 uppercase px-1">Theme</label>
                                    <select
                                        value={form.preferences?.theme || 'system'}
                                        onChange={e => setForm({ ...form, preferences: { ...form.preferences!, theme: e.target.value as any } })}
                                        className="w-full bg-stone-50 dark:bg-stone-800/50 border border-stone-100 dark:border-stone-800 rounded-2xl p-4 text-stone-900 dark:text-white focus:ring-2 ring-orange-500 outline-none transition-all"
                                    >
                                        <option value="system">System</option>
                                        <option value="light">Light</option>
                                        <option value="dark">Dark</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-stone-500 uppercase px-1">Units</label>
                                    <select
                                        value={form.preferences?.units || 'metric'}
                                        onChange={e => setForm({ ...form, preferences: { ...form.preferences!, units: e.target.value as any } })}
                                        className="w-full bg-stone-50 dark:bg-stone-800/50 border border-stone-100 dark:border-stone-800 rounded-2xl p-4 text-stone-900 dark:text-white focus:ring-2 ring-orange-500 outline-none transition-all"
                                    >
                                        <option value="metric">Metric (kg, cm)</option>
                                        <option value="imperial">Imperial (lbs, in)</option>
                                    </select>
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
                                        className={`px-4 py-2 rounded-xl text-sm font-bold transition-all border ${form.goals?.includes(goal) ? 'bg-orange-500 text-white border-orange-600 shadow-lg shadow-orange-500/20' : 'bg-stone-50 dark:bg-stone-800 text-stone-600 dark:text-stone-400 border-stone-100 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-700'}`}
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
                                className="w-full py-5 bg-orange-500 hover:bg-orange-600 text-white rounded-2xl font-bold text-lg shadow-xl shadow-orange-500/30 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
                                {isLoading ? "Saving Changes..." : "Update Profile"}
                            </button>
                        </div>
                    </div>
                </form>
            )}

            {/* Subscription Tab */}
            {activeTab === 'subscription' && (
                <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-8 shadow-sm">
                    <h3 className="text-sm font-bold text-stone-400 uppercase tracking-widest mb-6">Manage Subscription</h3>
                    <SubscriptionPanel currentTier={(initialData?.subscription_tier as 'free' | 'pro' | 'elite') || 'free'} />
                </div>
            )}
        </div>
    );
}
