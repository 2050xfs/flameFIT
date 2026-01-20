import React, { Suspense } from "react";
import { getWorkoutDetails } from "@/lib/api/workout";
import { WorkoutDetails } from "@/components/workout-lab/WorkoutDetails";
import { notFound } from "next/navigation";
import { startWorkoutSession } from "@/lib/api/workout-actions";
import { redirect } from "next/navigation";

export default async function WorkoutDetailsPage({ params }: { params: { id: string } }) {
    const { id } = await params;
    const workout = await getWorkoutDetails(id);

    if (!workout) {
        notFound();
    }

    const handleBack = async () => {
        "use server";
        redirect("/workouts");
    };

    const handleStart = async () => {
        "use server";
        await startWorkoutSession(id);
        redirect(`/workouts/session/${id}`);
    };

    return (
        <div className="max-w-2xl mx-auto">
            <WorkoutDetails
                workout={workout}
                onBack={handleBack}
                onStart={handleStart}
            />
        </div>
    );
}
