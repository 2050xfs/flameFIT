import React from "react";
import { getProgressData } from "@/lib/api/progress";
import { ProgressClient } from "./ProgressClient";

export default async function ProgressPage() {
    const data = await getProgressData();

    return (
        <div className="space-y-6">
            <ProgressClient initialData={data} />
        </div>
    );
}
