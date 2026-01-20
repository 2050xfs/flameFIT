import React from "react";
import { getWorkoutDetails } from "@/lib/api/workout";
import { ActiveSession } from "@/components/workout-lab/ActiveSession";
import { notFound } from "next/navigation";

export default async function ActiveSessionPage({ params }: { params: { id: string } }) {
    const { id } = await params;
    const workout = await getWorkoutDetails(id);

    if (!workout) {
        notFound();
    }

    return (
        <div className="max-w-4xl mx-auto py-4">
            <ActiveSession workout={workout} />
        </div>
    );
}
