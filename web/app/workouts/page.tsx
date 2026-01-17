import React from "react";
import { getWorkoutLabData } from "@/lib/api/workout";
import { WorkoutLabClient } from "./WorkoutLabClient";

export default async function WorkoutsPage() {
    const data = await getWorkoutLabData();

    return (
        <div className="space-y-6">
            <WorkoutLabClient initialData={data} />
        </div>
    );
}
