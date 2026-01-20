"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { WorkoutLab } from "@/components/workout-lab";
import { WorkoutLabProps } from "@/lib/types";
import { startWorkoutSession } from "@/lib/api/workout-actions";

// Pick only the data props, as callbacks are handled here
type WorkoutLabData = Omit<WorkoutLabProps, "onStartWorkout" | "onViewDetails">;

export function WorkoutLabClient({ initialData }: { initialData: WorkoutLabData }) {
    const router = useRouter();

    const handleStartWorkout = async (id: string) => {
        // Call server action to mark session as active
        const result = await startWorkoutSession(id);

        if (result.success) {
            // Navigate to active session page
            router.push(`/workouts/session/${id}`);
        } else {
            console.error("Failed to start workout:", result.error);
        }
    };

    const handleViewDetails = (id: string) => {
        // Navigate to workout details page
        router.push(`/workouts/${id}`);
    };

    const handleBrowseLibrary = () => {
        router.push("/knowledge-base");
    };

    const handleManagePlan = () => {
        router.push("/workouts/manage");
    };

    const handleCreateCustomWorkout = () => {
        router.push("/workouts/create");
    };

    const handleViewProProgram = (id: string) => {
        router.push(`/workouts/pro/${id}`);
    };

    const handleSubscribeToProgram = (id: string) => {
        // We take them to the detail page first so they see the full value
        router.push(`/workouts/pro/${id}`);
    };

    return (
        <WorkoutLab
            {...initialData}
            onStartWorkout={handleStartWorkout}
            onViewDetails={handleViewDetails}
            onBrowseLibrary={handleBrowseLibrary}
            onManagePlan={handleManagePlan}
            onCreateCustomWorkout={handleCreateCustomWorkout}
            onViewProProgram={handleViewProProgram}
            onSubscribeToProgram={handleSubscribeToProgram}
        />
    );
}

