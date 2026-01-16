import React from 'react'

interface WaterTrackerProps {
    current: number
    target: number
    onAddWater?: () => void
}

export function WaterTracker({ current, target, onAddWater }: WaterTrackerProps) {
    const percentage = Math.min((current / target) * 100, 100)
    const glassesRemaining = target - current

    return (
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-stone-400">Hydration</h3>
                <span className="text-xs font-mono text-stone-500">
                    {current}/{target} glasses
                </span>
            </div>

            {/* Water Visual */}
            <div className="relative w-32 h-32 mx-auto mb-6">
                {/* Glass outline */}
                <div className="absolute inset-0 rounded-full border-4 border-stone-200 dark:border-stone-800" />

                {/* Water fill */}
                <div className="absolute inset-0 flex items-end justify-center overflow-hidden rounded-full">
                    <div
                        className="w-full bg-gradient-to-t from-blue-500 to-cyan-400 transition-all duration-700 ease-out"
                        style={{ height: `${percentage}%` }}
                    />
                </div>

                {/* Center text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-bold font-heading text-stone-900 dark:text-white">
                        {current}
                    </span>
                    <span className="text-xs font-medium text-stone-500">glasses</span>
                </div>
            </div>

            {/* Add Water Button */}
            <button
                onClick={onAddWater}
                className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2"
            >
                💧 Add Glass
            </button>

            {glassesRemaining > 0 && (
                <p className="text-xs text-center text-stone-500 mt-3">
                    {glassesRemaining} more glass{glassesRemaining !== 1 ? 'es' : ''} to go!
                </p>
            )}

            {current >= target && (
                <p className="text-xs text-center text-teal-600 dark:text-teal-400 font-medium mt-3">
                    ✓ Hydration goal reached!
                </p>
            )}
        </div>
    )
}
