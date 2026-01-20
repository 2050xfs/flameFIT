'use client'

import React from 'react'

export default function DashboardError({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-heading font-bold text-stone-900 dark:text-white">Dashboard</h1>
                <div className="text-sm text-stone-500 font-mono">{new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</div>
            </div>

            <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-12">
                <div className="text-center max-w-md mx-auto">
                    <div className="text-6xl mb-4">⚠️</div>
                    <h2 className="text-2xl font-bold text-stone-900 dark:text-white mb-2">Unable to Load Dashboard</h2>
                    <p className="text-stone-600 dark:text-stone-400 mb-6">
                        We encountered an error while loading your dashboard data. This could be a temporary issue.
                    </p>
                    <div className="flex gap-3 justify-center">
                        <button
                            onClick={reset}
                            className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors"
                        >
                            Try Again
                        </button>
                        <button
                            onClick={() => window.location.href = '/'}
                            className="px-6 py-3 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-900 dark:text-white rounded-lg font-medium transition-colors"
                        >
                            Go Home
                        </button>
                    </div>
                    {process.env.NODE_ENV === 'development' && (
                        <details className="mt-6 text-left">
                            <summary className="text-sm text-stone-500 cursor-pointer hover:text-stone-700 dark:hover:text-stone-300">
                                Error Details
                            </summary>
                            <pre className="mt-2 p-4 bg-stone-100 dark:bg-stone-800 rounded-lg text-xs text-stone-700 dark:text-stone-300 overflow-auto">
                                {error.message}
                            </pre>
                        </details>
                    )}
                </div>
            </div>
        </div>
    )
}
