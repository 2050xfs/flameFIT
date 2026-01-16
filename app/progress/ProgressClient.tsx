"use client";

import React, { useState } from "react";
import { Progress, PhotoCompare } from "@/components/progress";
import { ProgressProps } from "@/lib/types";

// Pick only the data props, as callbacks are handled here
type ProgressClientData = Omit<ProgressProps, "onMetricChange" | "onComparePhotos">;

export function ProgressClient({ initialData }: { initialData: ProgressClientData["data"] }) {
    const [isComparing, setIsComparing] = useState(false);

    const handleMetricChange = (metric: string) => {
        console.log("Metric changed:", metric);
    };

    const handleComparePhotos = () => {
        console.log("Compare photos clicked");
        setIsComparing(true);
    };

    const handleBackFromCompare = () => {
        setIsComparing(false);
    };

    if (isComparing) {
        return <PhotoCompare onBack={handleBackFromCompare} />;
    }

    return (
        <Progress
            data={initialData}
            onMetricChange={handleMetricChange}
            onComparePhotos={handleComparePhotos}
        />
    );
}
