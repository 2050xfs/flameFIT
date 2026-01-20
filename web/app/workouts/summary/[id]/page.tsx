import React from "react";
import { SessionSummary } from "@/components/workout-lab/SessionSummary";
import { getWorkoutDetails } from "@/lib/api/workout";
import { notFound, redirect } from "next/navigation";

export default async function SummaryPage({ params }: { params: { id: string } }) {
    const { id } = await params;
    const workout = await getWorkoutDetails(id);

    if (!workout) {
        notFound();
    }

    const handleHome = async () => {
        "use server";
        redirect("/dashboard");
    };

    // Calculate mock stats from session details
    const totalSets = 0; // In a real app, query set_logs count
    const totalVolume = 0; // In a real app, sum(weight * reps)

    return (
        <div className="max-w-xl mx-auto py-10">
            <SessionSummary
                onHome={handleHome}
                duration={parseInt(workout.duration) || 60}
                sets={totalSets || 18} // Fallback for demo
                volume={totalVolume || 8450} // Fallback for demo
            />
        </div>
    );
}
