import React from 'react'

export default function DashboardLoading() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="h-9 w-48 bg-stone-200 dark:bg-stone-800 rounded-lg animate-pulse" />
                <div className="h-5 w-32 bg-stone-200 dark:bg-stone-800 rounded animate-pulse" />
            </div>

            {/* Spark Insight Skeleton */}
            <div className="h-24 w-full bg-stone-100 dark:bg-stone-800 rounded-[2rem] animate-pulse" />

            <div className="space-y-8">
                {/* Readiness + Hydration + Actions Skeleton */}
                <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Readiness Card */}
                    <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6">
                        <div className="flex flex-col items-center justify-center py-4">
                            <div className="w-40 h-40 rounded-full bg-stone-200 dark:bg-stone-800 animate-pulse mb-4" />
                            <div className="h-6 w-32 bg-stone-200 dark:bg-stone-800 rounded animate-pulse mb-2" />
                            <div className="h-4 w-48 bg-stone-200 dark:bg-stone-800 rounded animate-pulse" />
                        </div>
                    </div>

                    {/* Hydration Widget Skeleton */}
                    <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 flex flex-col items-center justify-between">
                        <div className="w-full flex justify-between items-center mb-6">
                            <div className="h-4 w-20 bg-stone-200 dark:bg-stone-800 rounded animate-pulse" />
                            <div className="h-4 w-16 bg-stone-200 dark:bg-stone-800 rounded animate-pulse" />
                        </div>
                        <div className="w-32 h-32 rounded-full bg-stone-200 dark:bg-stone-800 animate-pulse mb-4" />
                        <div className="h-10 w-full bg-stone-200 dark:bg-stone-800 rounded-xl animate-pulse" />
                    </div>

                    {/* Action Cards */}
                    <div className="grid grid-cols-1 gap-4">
                        <div className="h-full bg-stone-200 dark:bg-stone-800 rounded-3xl animate-pulse min-h-[140px]" />
                        <div className="h-full bg-stone-200 dark:bg-stone-800 rounded-3xl animate-pulse min-h-[140px]" />
                    </div>
                </section>

                {/* Macro Rings Skeleton */}
                <section>
                    <div className="flex items-center justify-between mb-6">
                        <div className="h-7 w-40 bg-stone-200 dark:bg-stone-800 rounded animate-pulse" />
                        <div className="h-5 w-24 bg-stone-200 dark:bg-stone-800 rounded animate-pulse" />
                    </div>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-5 flex flex-col items-center">
                                <div className="w-24 h-24 rounded-full bg-stone-200 dark:bg-stone-800 animate-pulse mb-3" />
                                <div className="h-6 w-12 bg-stone-200 dark:bg-stone-800 rounded animate-pulse mb-1" />
                                <div className="h-4 w-16 bg-stone-200 dark:bg-stone-800 rounded animate-pulse" />
                            </div>
                        ))}
                    </div>
                </section>

                {/* Timeline Skeleton */}
                <section>
                    <div className="h-7 w-48 bg-stone-200 dark:bg-stone-800 rounded animate-pulse mb-6" />
                    <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-8">
                        <div className="space-y-6">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="flex gap-6">
                                    <div className="w-10 h-10 rounded-full bg-stone-200 dark:bg-stone-800 animate-pulse" />
                                    <div className="flex-1 bg-stone-100 dark:bg-stone-800 rounded-2xl p-5">
                                        <div className="h-4 w-20 bg-stone-200 dark:bg-stone-700 rounded animate-pulse mb-2" />
                                        <div className="h-6 w-40 bg-stone-200 dark:bg-stone-700 rounded animate-pulse mb-2" />
                                        <div className="h-4 w-32 bg-stone-200 dark:bg-stone-700 rounded animate-pulse" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </div>
        </div>
    )
}
