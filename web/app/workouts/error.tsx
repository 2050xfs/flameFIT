"use client";

import React, { useEffect } from "react";
import Link from "next/link";

export default function WorkoutError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center space-y-6">
            <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center text-4xl">
                ⚠️
            </div>

            <div className="space-y-2">
                <h2 className="text-2xl font-bold font-heading text-stone-900 dark:text-white">
                    Something went wrong in the Lab
                </h2>
                <p className="text-stone-500 dark:text-stone-400 max-w-sm mx-auto">
                    We encountered an error while loading your workout data. Don't worry, your progress is safe.
                </p>
            </div>

            <div className="flex gap-4">
                <button
                    onClick={() => reset()}
                    className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold transition-all shadow-lg shadow-orange-500/20"
                >
                    Try Again
                </button>
                <Link
                    href="/dashboard"
                    className="px-6 py-3 bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-white rounded-xl font-bold hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors"
                >
                    Back to Dashboard
                </Link>
            </div>

            {process.env.NODE_ENV === "development" && (
                <div className="mt-8 p-4 bg-stone-100 dark:bg-stone-900 rounded-lg text-left overflow-auto max-w-xl">
                    <p className="text-xs font-mono text-red-500">{error.message}</p>
                    {error.stack && <pre className="text-[10px] mt-2 text-stone-400">{error.stack}</pre>}
                </div>
            )}
        </div>
    );
}
