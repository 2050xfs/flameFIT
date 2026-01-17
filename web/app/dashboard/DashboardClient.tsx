"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Dashboard } from "@/components/dashboard/Dashboard";
import { DashboardProps } from "@/lib/types";

// Pick only the data props, as callbacks are handled here
type DashboardData = Omit<DashboardProps, "onStartWorkout" | "onLogMeal" | "onViewDetails">;

export function DashboardClient({ initialData }: { initialData: DashboardData }) {
    const router = useRouter();

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
        // View details for a specific timeline item
        // Find the item from the timeline
        const item = initialData.timeline.find(t => t.id === id);

        if (item) {
            if (item.type === 'workout') {
                // Navigate to workout details
                router.push('/workouts');
            } else if (item.type === 'meal') {
                // Navigate to nutrition/meal details
                router.push('/kitchen');
            }
        }
    };

    return (
        <Dashboard
            {...initialData}
            onStartWorkout={handleStartWorkout}
            onLogMeal={handleLogMeal}
            onViewDetails={handleViewDetails}
        />
    );
}
