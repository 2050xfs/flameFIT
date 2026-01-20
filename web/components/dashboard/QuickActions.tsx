import { MotionList, MotionItem } from '@/components/ui/motion'

interface QuickActionsProps {
    onStartWorkout?: (type: string) => void
    onLogMeal?: () => void
}

export function QuickActions({ onStartWorkout, onLogMeal }: QuickActionsProps) {
    return (
        <MotionList className="grid grid-cols-1 gap-4">
            <MotionItem
                onClick={() => onStartWorkout?.('next')}
                className="relative h-full bg-gradient-to-br from-orange-500 to-rose-600 rounded-3xl p-6 text-left flex flex-col justify-end overflow-hidden group hover:shadow-xl hover:shadow-orange-500/25 transition-all transform hover:-translate-y-1"
            >
                <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 blur-3xl rounded-full -mr-16 -mt-16 pointer-events-none" />
                <div className="relative z-10">
                    <span className="inline-block p-2 bg-white/20 rounded-lg text-white mb-2 backdrop-blur-md">💪</span>
                    <span className="block text-white font-bold text-xl font-heading">Start Workout</span>
                </div>
            </MotionItem>

            <MotionItem
                onClick={() => onLogMeal?.()}
                className="relative h-full bg-stone-100 dark:bg-stone-800 rounded-3xl p-6 text-left flex flex-col justify-end hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors group"
            >
                <div className="absolute top-0 right-0 w-48 h-48 bg-stone-300 dark:bg-stone-600 opacity-20 blur-3xl rounded-full -mr-10 -mt-10 pointer-events-none" />
                <div className="relative z-10">
                    <span className="inline-block p-2 bg-white dark:bg-stone-700 rounded-lg text-stone-900 dark:text-white mb-2 shadow-sm">🥑</span>
                    <span className="block text-stone-900 dark:text-white font-bold text-xl font-heading">Quick Add</span>
                </div>
            </MotionItem>
        </MotionList>
    )
}
