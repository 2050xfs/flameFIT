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

    useEffect(() => {
        if (!supabase) {
            setUser(null);
            return;
        }

        const fetchUser = async () => {
            const { data: { user: authUser } } = await supabase.auth.getUser();
            if (authUser) {
                // Fetch profile
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('full_name, avatar_url, role')
                    .eq('id', authUser.id)
                    .single();

                setUser({
                    name: profile?.full_name || authUser.email?.split('@')[0] || "User",
                    avatarUrl: profile?.avatar_url || "",
                    role: profile?.role || 'user'
                });
            }
        };

        fetchUser();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((event: any, session: any) => {
            if (session?.user) {
                fetchUser();
            } else {
                setUser(null);
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
                { label: "Daily Spark", href: "/dashboard/ai" },
                { label: "Nutrition", href: "/dashboard/nutrition" },
                { label: "Planner", href: "/dashboard/planner" },
                { label: "Workouts", href: "/dashboard/workouts" },
                { label: "Profile", href: "/dashboard/profile" },
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
            user={user || { name: "Guest", avatarUrl: "", role: "user" }}
            onNavigate={handleNavigate}
            onLogout={handleLogout}
        >
            {children}
        </AppShell>
    );
}
