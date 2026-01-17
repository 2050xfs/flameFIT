import React from 'react'

interface HistoryListProps {
    onBack: () => void
}

export function HistoryList({ onBack }: HistoryListProps) {
    return (
        <div className="min-h-screen bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-white p-6 animate-in slide-in-from-right duration-300 fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center gap-4 mb-8">
                <button onClick={onBack} className="p-2 bg-stone-200 dark:bg-stone-800 rounded-full hover:opacity-80">
                    ←
                </button>
                <h1 className="text-2xl font-bold font-heading">Workout History</h1>
            </div>

            <div className="space-y-6 relative border-l-2 border-stone-200 dark:border-stone-800 ml-4 pl-8 pb-10">
                {['Today', 'Yesterday', 'Jan 12', 'Jan 10', 'Jan 8'].map((date, i) => (
                    <div key={i} className="relative">
                        <div className="absolute -left-[39px] top-1 w-4 h-4 rounded-full bg-stone-300 dark:bg-stone-700 border-2 border-stone-100 dark:border-stone-900" />
                        <p className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-2">{date}</p>

                        <div className="bg-white dark:bg-stone-900 p-5 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-lg font-bold font-heading">Upper Body Power</h3>
                                    <p className="text-sm text-stone-500">1h 15m • 24 Sets</p>
                                </div>
                                <div className="text-right">
                                    <span className="block text-xl font-bold font-mono">12,450</span>
                                    <span className="text-xs text-stone-400 uppercase">Vol (lbs)</span>
                                </div>
                            </div>

                            {/* Best Sets */}
                            <div className="space-y-2 pt-4 border-t border-stone-100 dark:border-stone-800">
                                <div className="flex justify-between text-sm">
                                    <span className="font-medium text-stone-600 dark:text-stone-300">Bench Press</span>
                                    <span className="font-mono font-bold">225 x 5</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="font-medium text-stone-600 dark:text-stone-300">Incline DB</span>
                                    <span className="font-mono font-bold">80 x 8</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
