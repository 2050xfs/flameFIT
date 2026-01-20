import type { DashboardProps } from '@/lib/types'
import { MotionList, MotionItem } from '@/components/ui/motion'

interface TodayTimelineProps {
    timeline: DashboardProps['timeline']
    onStartWorkout?: (type: string) => void
    onLogMeal?: () => void
    onViewDetails?: (id: string) => void
}

export function TodayTimeline({ timeline, onStartWorkout, onLogMeal, onViewDetails }: TodayTimelineProps) {
    return (
        <section>
            <h3 className="text-xl font-bold text-stone-900 dark:text-white font-heading mb-6">Today's Schedule</h3>
            <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-8">
                {timeline.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="text-6xl mb-4">📅</div>
                        <h4 className="text-lg font-bold text-stone-900 dark:text-white mb-2">Nothing Scheduled</h4>
                        <p className="text-sm text-stone-500 dark:text-stone-400 mb-6">
                            Your day is wide open. Add a workout or meal to get started.
                        </p>
                        <div className="flex gap-3 justify-center">
                            <button
                                onClick={() => onStartWorkout?.('next')}
                                className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-medium transition-colors"
                            >
                                Schedule Workout
                            </button>
                            <button
                                onClick={() => onLogMeal?.()}
                                className="px-4 py-2 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-900 dark:text-white rounded-lg text-sm font-medium transition-colors"
                            >
                                Log Meal
                            </button>
                        </div>
                    </div>
                ) : (
                    <MotionList className="space-y-8">
                        {timeline.map((item, index) => (
                            <MotionItem key={item.id} className="group flex gap-6 relative">
                                {/* Vertical Line */}
                                {index !== timeline.length - 1 && (
                                    <div className="absolute left-[19px] top-10 bottom-[-32px] w-0.5 bg-stone-100 dark:bg-stone-800 group-hover:bg-orange-100 dark:group-hover:bg-orange-900/30 transition-colors" />
                                )}

                                {/* Time Column */}
                                <div className="flex flex-col items-center min-w-[40px]">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all z-10 ${item.status === 'completed' ? 'bg-orange-500 border-orange-500 text-white' :
                                        item.status === 'upcoming' ? 'bg-white dark:bg-stone-900 border-orange-500 text-orange-500' :
                                            'bg-stone-100 dark:bg-stone-800 border-transparent text-stone-400'
                                        }`}>
                                        {item.type === 'workout' ? '⚡️' : '🍎'}
                                    </div>
                                </div>

                                {/* Content Card */}
                                <button
                                    onClick={() => onViewDetails?.(item.id)}
                                    className="flex-1 bg-stone-50 dark:bg-stone-800/50 rounded-2xl p-5 hover:bg-white dark:hover:bg-stone-800 border border-transparent hover:border-stone-200 dark:hover:border-stone-700 shadow-sm hover:shadow-md transition-all text-left cursor-pointer"
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="text-xs font-bold uppercase tracking-wider text-stone-400">{item.time}</span>
                                        <span className={`text-xs font-bold uppercase ${item.status === 'completed' ? 'text-teal-500' :
                                            item.status === 'upcoming' ? 'text-orange-500' : 'text-stone-400'
                                            }`}>{item.status}</span>
                                    </div>
                                    <h4 className="text-lg font-bold text-stone-900 dark:text-white mb-1">{item.title}</h4>
                                    <p className="text-sm text-stone-500 dark:text-stone-400">{item.details}</p>
                                </button>
                            </MotionItem>
                        ))}
                    </MotionList>
                )}
            </div>
        </section>
    )
}
