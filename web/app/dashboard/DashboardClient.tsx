"use client";

import React, { useOptimistic, startTransition } from "react";
import { useRouter } from "next/navigation";
import { Dashboard } from "@/components/dashboard/Dashboard";
import { DashboardProps } from "@/lib/types";

// Pick only the data props, as callbacks are handled here
type DashboardData = Omit<DashboardProps, "onStartWorkout" | "onLogMeal" | "onViewDetails">;

export function DashboardClient({ initialData }: { initialData: DashboardData }) {
    const router = useRouter();
    const [optimisticWater, addOptimisticWater] = useOptimistic(
        initialData.water,
        (state, amount: number) => ({ ...state, current: state.current + amount })
    );

    const handleStartWorkout = (id: string) => {
        // Navigate to the workout session page
        // For now, navigate to workouts section
        // In the future, this could be /workouts/session/{id}
        router.push('/workouts');
    };

    const handleLogMeal = () => {
        // Navigate to kitchen for quick meal logging
        router.push('/kitchen');
    };

    const handleViewDetails = (id: string) => {
        // ... (Keep existing log entry logic) ...
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
            actionText.includes('training') ||
            actionText.includes('session') ||
            actionText.includes('workout') ||
            messageText.includes('session') ||
            messageText.includes('workout') ||
            messageText.includes('training')
        ) {
            router.push('/workouts');
        } else if (
            actionText.includes('protein') ||
            actionText.includes('log') ||
            messageText.includes('fuel') ||
            messageText.includes('snack') ||
            messageText.includes('intake')
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

    return (
        <Dashboard
            {...initialData}
            water={optimisticWater}
            onStartWorkout={handleStartWorkout}
            onLogMeal={handleLogMeal}
            onAddWater={handleAddWater}
            onViewDetails={handleViewDetails}
            onInsightAction={handleInsightAction}
        />
    );
}
