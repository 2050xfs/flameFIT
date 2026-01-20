import React from 'react'

export default function WorkoutLabLoading() {
    return (
        <div className="space-y-8 animate-pulse p-4">
            {/* Header Skeleton */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="space-y-3">
                    <div className="h-10 w-48 bg-stone-200 dark:bg-stone-800 rounded-xl" />
                    <div className="h-5 w-32 bg-stone-100 dark:bg-stone-800/50 rounded-lg" />
                </div>
                <div className="flex gap-3">
                    <div className="h-10 w-24 bg-stone-100 dark:bg-stone-800 rounded-xl" />
                    <div className="h-10 w-32 bg-stone-100 dark:bg-stone-800 rounded-xl" />
                </div>
            </div>

            {/* Schedule Strip Skeleton */}
            <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-2 rounded-2xl">
                <div className="flex justify-between gap-2 overflow-x-auto pb-2">
                    {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                        <div key={i} className="flex-1 min-w-[80px] h-24 bg-stone-50 dark:bg-stone-800/30 rounded-xl" />
                    ))}
                </div>
            </div>

            {/* Main Card Skeleton */}
            <section className="space-y-4">
                <div className="h-6 w-36 bg-stone-200 dark:bg-stone-800 rounded-lg" />
                <div className="h-64 w-full bg-stone-100 dark:bg-stone-800/50 rounded-3xl" />
            </section>

            {/* Grid Skeleton */}
            <section className="space-y-4">
                <div className="h-6 w-32 bg-stone-200 dark:bg-stone-800 rounded-lg" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="h-24 bg-stone-50 dark:bg-stone-800/30 rounded-2xl" />
                    <div className="h-24 bg-stone-50 dark:bg-stone-800/30 rounded-2xl" />
                </div>
            </section>
        </div>
    )
}
