"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { AppShell } from "./AppShell";
import { LayoutDashboard, Dumbbell, Utensils, BookOpen, TrendingUp, Sparkles, CalendarDays, User } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";

export function ShellWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const supabase = createClient();
    const [user, setUser] = useState<{ name: string; avatarUrl?: string; role?: string } | null>(null);
    const [isLoadingProfile, setIsLoadingProfile] = useState(true);

    useEffect(() => {
        if (!supabase) {
            setUser(null);
            setIsLoadingProfile(false);
            return;
        }

        const fetchUser = async () => {
            setIsLoadingProfile(true);
            const { data: { user: authUser } } = await supabase.auth.getUser();
            if (authUser) {
                // Fetch profile
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('name, role')
                    .eq('id', authUser.id)
                    .single();

                setUser({
                    name: profile?.name || authUser.email?.split('@')[0] || "User",
                    avatarUrl: "",
                    role: profile?.role || 'user'
                });
            } else {
                setUser(null);
            }
            setIsLoadingProfile(false);
        };

        fetchUser();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((event: any, session: any) => {
            if (session?.user) {
                fetchUser();
            } else {
                setUser(null);
                setIsLoadingProfile(false);
            }
        });

        return () => subscription.unsubscribe();
    }, [supabase]);

    const navigationItems = [
        {
            label: "Dashboard",
            href: "/dashboard",
            icon: LayoutDashboard,
            subItems: [
                { label: "Daily Spark", href: "/dashboard" }, // Future feature, for now point back to dashboard
                { label: "Nutrition", href: "/kitchen" },
                { label: "Planner", href: "/dashboard" }, // Dashboard is the planner for now
                { label: "Workouts", href: "/workouts" },
                { label: "Progress", href: "/progress" },

            ]
        },
        {
            label: "Workout Lab",
            href: "/workouts",
            icon: Dumbbell,
            subItems: []
        },
        {
            label: "Kitchen",
            href: "/kitchen",
            icon: Utensils,
            subItems: []
        },
        {
            label: "Knowledge Base",
            href: "/knowledge-base",
            icon: BookOpen,
            subItems: []
        },
        {
            label: "Progress",
            href: "/progress",
            icon: TrendingUp,
            subItems: []
        },
        {
            label: "Profile",
            href: "/profile",
            icon: User,
            subItems: []
        },
    ].map((item) => ({
        ...item,
        isActive: pathname === item.href || pathname.startsWith(item.href + '/'),
        subItems: item.subItems.map((subItem) => ({
            ...subItem,
            isActive: pathname === subItem.href,
        })),
    }));

    const handleNavigate = (href: string) => {
        router.push(href);
    };

    const handleLogout = async () => {
        if (!supabase) {
            return;
        }

        await supabase.auth.signOut();
        router.push('/login');
        router.refresh();
    };

    return (
        <AppShell
            navigationItems={navigationItems}
            user={isLoadingProfile ? { name: "Loading...", avatarUrl: "", role: "user" } : (user || { name: "Guest", avatarUrl: "", role: "user" })}
            onNavigate={handleNavigate}
            onLogout={handleLogout}
        >
            {children}
        </AppShell>
    );
}
