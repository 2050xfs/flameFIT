"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { WorkoutLab } from "@/components/workout-lab";
import { WorkoutLabProps } from "@/lib/types";

// Pick only the data props, as callbacks are handled here
type WorkoutLabData = Omit<WorkoutLabProps, "onStartWorkout" | "onViewDetails">;

export function WorkoutLabClient({ initialData }: { initialData: WorkoutLabData }) {
    const router = useRouter();

    const handleStartWorkout = (id: string) => {
        // Navigate to active session page
        // For now, we'll just log - in the future this would start an active session
        console.log("Starting workout:", id);
        // router.push(`/workouts/session/${id}`);
    };

    const handleViewDetails = (id: string) => {
        // Navigate to workout details page
        console.log("Viewing workout details:", id);
        // router.push(`/workouts/${id}`);
    };

    return (
        <WorkoutLab
            {...initialData}
            onStartWorkout={handleStartWorkout}
            onViewDetails={handleViewDetails}
        />
    );
}
