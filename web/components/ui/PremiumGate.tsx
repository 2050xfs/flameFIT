"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Lock, Crown, Zap } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export type SubscriptionTier = 'free' | 'pro' | 'elite';

interface PremiumGateProps {
    isPremiumContent: boolean;
    requiredTier?: SubscriptionTier;
    children: React.ReactNode;
    title?: string;
    description?: string;
}

async function getUserTier(): Promise<SubscriptionTier> {
    const supabase = createClient();
    if (!supabase) return 'free';

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return 'free';

    const { data: profile } = await supabase
        .from('profiles')
        .select('subscription_tier, subscription_expires_at')
        .eq('id', user.id)
        .single();

    if (!profile) return 'free';

    // Check if subscription has expired
    if (profile.subscription_expires_at) {
        const expiry = new Date(profile.subscription_expires_at);
        if (expiry < new Date()) return 'free';
    }

    return (profile.subscription_tier as SubscriptionTier) || 'free';
}

function tierMeetsRequirement(userTier: SubscriptionTier, required: SubscriptionTier): boolean {
    const ranks: Record<SubscriptionTier, number> = { free: 0, pro: 1, elite: 2 };
    return ranks[userTier] >= ranks[required];
}

export function PremiumGate({
    isPremiumContent,
    requiredTier = 'pro',
    children,
    title = "Premium Content",
    description = "Subscribe to FlameFit Pro to access this exclusive functionality."
}: PremiumGateProps) {
    const [hasAccess, setHasAccess] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!isPremiumContent) {
            setHasAccess(true);
            setIsLoading(false);
            return;
        }

        getUserTier().then(tier => {
            setHasAccess(tierMeetsRequirement(tier, requiredTier));
            setIsLoading(false);
        });
    }, [isPremiumContent, requiredTier]);

    if (!isPremiumContent) {
        return <>{children}</>;
    }

    if (isLoading) {
        return (
            <div className="animate-pulse space-y-4 p-6">
                <div className="h-4 bg-stone-200 dark:bg-stone-800 rounded w-3/4"></div>
                <div className="h-4 bg-stone-200 dark:bg-stone-800 rounded w-full"></div>
                <div className="h-4 bg-stone-200 dark:bg-stone-800 rounded w-5/6"></div>
            </div>
        );
    }

    if (hasAccess) {
        return <>{children}</>;
    }

    const tierLabel = requiredTier === 'elite' ? 'Elite' : 'Pro';
    const tierIcon = requiredTier === 'elite' ? Crown : Zap;
    const TierIcon = tierIcon;

    return (
        <div className="relative">
            {/* Blurred placeholder preview */}
            <div className="blur-md select-none pointer-events-none opacity-40 h-[320px] overflow-hidden">
                <div className="p-8 space-y-4">
                    <div className="h-6 bg-stone-300 dark:bg-stone-700 rounded w-1/2" />
                    <div className="h-4 bg-stone-200 dark:bg-stone-800 rounded w-full" />
                    <div className="h-4 bg-stone-200 dark:bg-stone-800 rounded w-4/5" />
                    <div className="h-24 bg-stone-200 dark:bg-stone-800 rounded-2xl w-full" />
                    <div className="h-4 bg-stone-200 dark:bg-stone-800 rounded w-3/4" />
                </div>
            </div>

            {/* Gradient fade */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/60 to-white dark:via-stone-950/60 dark:to-stone-950 pointer-events-none" />

            {/* Overlay card */}
            <div className="absolute inset-0 z-10 flex items-center justify-center p-6">
                <div className="bg-white/95 dark:bg-stone-900/95 backdrop-blur-xl border border-stone-200 dark:border-stone-800 p-8 rounded-3xl max-w-sm w-full text-center shadow-2xl">
                    <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/30 rounded-2xl flex items-center justify-center mx-auto mb-5">
                        <Lock className="w-7 h-7 text-orange-500" />
                    </div>

                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 text-orange-500 text-xs font-bold uppercase tracking-wider mb-4">
                        <TierIcon className="w-3 h-3" />
                        {tierLabel} Feature
                    </div>

                    <h3 className="text-xl font-bold font-heading text-stone-900 dark:text-white mb-2">
                        {title}
                    </h3>
                    <p className="text-stone-500 dark:text-stone-400 mb-6 text-sm leading-relaxed">
                        {description}
                    </p>

                    <div className="space-y-3">
                        <Link
                            href="/profile?tab=subscription"
                            className="flex items-center justify-center gap-2 w-full py-3.5 bg-gradient-to-r from-orange-500 to-rose-500 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-orange-500/30 hover:opacity-90 text-sm"
                        >
                            <Crown className="w-4 h-4" />
                            Unlock {tierLabel} Access
                        </Link>
                        <p className="text-xs text-stone-400">
                            Already subscribed?{' '}
                            <button
                                onClick={() => window.location.reload()}
                                className="text-orange-500 hover:underline"
                            >
                                Refresh
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
