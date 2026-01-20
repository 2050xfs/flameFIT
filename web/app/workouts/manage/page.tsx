import React from 'react';

export default function ManagePlanPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center">
            <div className="w-20 h-20 bg-blue-100 dark:bg-blue-950/30 rounded-full flex items-center justify-center mb-6">
                <span className="text-4xl">📅</span>
            </div>
            <h1 className="text-3xl font-bold font-heading mb-4 text-stone-900 dark:text-white">Manage Plan</h1>
            <p className="text-stone-500 max-w-md mb-8">
                Your Periodization Dashboard is launching soon. Spark is optimizing your long-term training cycles.
            </p>
            <a href="/workouts" className="px-6 py-3 bg-stone-900 dark:bg-white text-white dark:text-stone-900 rounded-xl font-bold transition-all hover:scale-105">
                Return to Lab
            </a>
        </div>
    );
}
