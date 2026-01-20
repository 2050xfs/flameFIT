import React from 'react'
import type { TimelineItem } from '@/lib/types'

interface ScheduleDetailProps {
    timeline: TimelineItem[]
    onBack: () => void
    onItemAction: (id: string, type: 'meal' | 'workout') => void
}

export function ScheduleDetail({ timeline, onBack, onItemAction }: ScheduleDetailProps) {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right duration-500">
            <div className="flex items-center justify-between">
                <button
                    onClick={onBack}
                    className="flex items-center text-sm font-medium text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
                >
                    ← Back to Dashboard
                </button>
                <button className="text-sm font-bold text-orange-500 border border-orange-200 dark:border-orange-800/30 bg-orange-50 dark:bg-orange-900/20 px-3 py-1.5 rounded-lg">
                    Edit Schedule
                </button>
            </div>

            <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-8">
                <h2 className="text-2xl font-bold font-heading text-stone-900 dark:text-white mb-8">Full Daily Schedule</h2>

                <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-stone-200 dark:before:via-stone-700 before:to-transparent">
                    {timeline.map((item) => (
                        <div key={item.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">

                            {/* Icon Indicator */}
                            <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white dark:border-stone-900 bg-stone-200 dark:bg-stone-800 group-hover:bg-orange-500 group-hover:text-white transition-colors shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 text-stone-500">
                                {item.type === 'meal' ? '🍎' : '💪'}
                            </div>

                            {/* Card */}
                            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-stone-50 dark:bg-stone-800/50 p-6 rounded-2xl border border-stone-100 dark:border-stone-800 hover:border-orange-200 dark:hover:border-orange-900 transition-colors">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
                                    <span className="inline-block px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider bg-white dark:bg-stone-800 text-stone-500 border border-stone-200 dark:border-stone-700">
                                        {item.time}
                                    </span>
                                    <span className={`text-[10px] font-bold uppercase ${item.status === 'completed' ? 'text-teal-500' :
                                        item.status === 'upcoming' ? 'text-orange-500' : 'text-stone-400'
                                        }`}>
                                        {item.status}
                                    </span>
                                </div>

                                <h3 className="text-lg font-bold text-stone-900 dark:text-white mb-1">{item.title}</h3>
                                <p className="text-sm text-stone-500 dark:text-stone-400 mb-4">{item.details}</p>

                                {item.status !== 'completed' && (
                                    <button
                                        onClick={() => onItemAction(item.id, item.type)}
                                        className="w-full py-2 bg-white dark:bg-stone-700 border border-stone-200 dark:border-stone-600 rounded-lg text-sm font-bold text-stone-700 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-600 transition-colors"
                                    >
                                        {item.type === 'workout' ? 'Start Session' : 'Mark Complete'}
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
