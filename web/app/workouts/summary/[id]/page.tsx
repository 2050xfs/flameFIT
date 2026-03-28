import React from "react";
import { SessionSummary } from "@/components/workout-lab/SessionSummary";
import { getWorkoutDetails } from "@/lib/api/workout";
import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";

export default async function SummaryPage({ params }: { params: { id: string } }) {
    const { id } = await params;
    const supabase = await createClient();

    const [workout, { data: setLogs }] = await Promise.all([
        getWorkoutDetails(id),
        supabase
            .from('set_logs')
            .select('weight, reps')
            .eq('workout_session_id', id),
    ]);

    if (!workout) {
        notFound();
    }

    const handleHome = async () => {
        "use server";
        redirect("/dashboard");
    };

    const totalSets = setLogs?.length || 0;
    const totalVolume = (setLogs || []).reduce((acc, s) => acc + (s.weight || 0) * (s.reps || 0), 0);

    return (
        <div className="max-w-xl mx-auto py-10">
            <SessionSummary
                onHome={handleHome}
                duration={parseInt(workout.duration) || 60}
                sets={totalSets}
                volume={Math.round(totalVolume)}
            />
        </div>
    );
}
