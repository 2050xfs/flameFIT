"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Lock } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface PremiumGateProps {
    isPremiumContent: boolean;
    children: React.ReactNode;
    title?: string;
    description?: string;
}

export function PremiumGate({
    isPremiumContent,
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

        const checkAccess = async () => {
            const supabase = createClient();
            if (!supabase) {
                setIsLoading(false);
                return;
            }

            const { data: { user } } = await supabase.auth.getUser();

            // TODO: Fetch actual subscription status from profile table
            // For now, we mock access if user is logged in (or specific user)
            // Ideally: const { data: profile } = await supabase.from('profiles').select('subscription_tier').eq('id', user.id).single();
            // const isPro = profile?.subscription_tier === 'pro' || profile?.subscription_tier === 'elite';

            const isPro = !!user; // TEMPORARY: Allow any logged-in user for testing, or assume false if strict.

            setHasAccess(isPro);
            setIsLoading(false);
        };

        checkAccess();
    }, [isPremiumContent]);

    if (!isPremiumContent) {
        return <>{children}</>;
    }

    if (isLoading) {
        // Show a skeleton or loading state that mimics the content
        return (
            <div className="animate-pulse space-y-4">
                <div className="h-4 bg-stone-200 dark:bg-stone-800 rounded w-3/4"></div>
                <div className="h-4 bg-stone-200 dark:bg-stone-800 rounded w-full"></div>
                <div className="h-4 bg-stone-200 dark:bg-stone-800 rounded w-5/6"></div>
            </div>
        );
    }

    if (hasAccess) {
        return <>{children}</>;
    }

    // Locked State
    return (
        <div className="relative">
            {/* Blurred Content Preview */}
            <div className="blur-md select-none pointer-events-none opacity-50 h-[400px] overflow-hidden mask-image-gradient">
                {/* Render children to show underlying structure but blurred?
                     Or just placeholders to prevent leaking info in DOM?
                     Safest is placeholders, but visual effect needs children.
                     If children are text, it's in DOM.
                     For security, don't render children if sensitive.
                     But for "teaser", maybe render first paragraph?
                  */}
                <div dangerouslySetInnerHTML={{ __html: "<h1>Content Locked</h1><p>Lorem ipsum dolor sit amet...</p>" }} />
            </div>

            {/* Overlay */}
            <div className="absolute inset-0 z-10 flex items-center justify-center p-6 bg-gradient-to-b from-transparent to-white dark:to-stone-950">
                <div className="bg-white/90 dark:bg-stone-900/90 backdrop-blur-xl border border-stone-200 dark:border-stone-800 p-8 rounded-3xl max-w-md w-full text-center shadow-2xl transform transition-all hover:scale-105">
                    <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Lock className="w-8 h-8 text-orange-500" />
                    </div>
                    <h3 className="text-2xl font-bold font-heading text-stone-900 dark:text-white mb-2">
                        {title}
                    </h3>
                    <p className="text-stone-500 dark:text-stone-400 mb-8 leading-relaxed">
                        {description}
                    </p>
                    <div className="space-y-4">
                        <Link
                            href="/pro/subscribe"
                            className="block w-full py-4 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-orange-500/25"
                        >
                            Unlock Pro Access
                        </Link>
                        <p className="text-xs text-stone-400">
                            Already a member? <Link href="/login" className="text-orange-500 hover:underline">Sign In</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
