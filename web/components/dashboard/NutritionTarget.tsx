import type { DashboardProps } from '@/lib/types'
import { MotionList, MotionItem } from '@/components/ui/motion'

interface NutritionTargetProps {
    macros: DashboardProps['macros']
    onLogMeal?: () => void
}

export function NutritionTarget({ macros, onLogMeal }: NutritionTargetProps) {
    return (
        <section>
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-stone-900 dark:text-white font-heading">Nutrition Target</h3>
                <button
                    onClick={() => onLogMeal?.()}
                    className="text-sm text-orange-500 hover:text-orange-600 font-medium font-mono hover:underline"
                >
                    View Details →
                </button>
            </div>
            <MotionList className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <MacroRing label="Calories" current={macros.calories.current} target={macros.calories.target} color="text-stone-500" unit="kcal" />
                <MacroRing label="Protein" current={macros.protein.current} target={macros.protein.target} color="text-rose-500" unit="g" />
                <MacroRing label="Carbs" current={macros.carbs.current} target={macros.carbs.target} color="text-amber-500" unit="g" />
                <MacroRing label="Fats" current={macros.fats.current} target={macros.fats.target} color="text-teal-500" unit="g" />
            </MotionList>
        </section>
    )
}

function MacroRing({ label, current, target, color, unit }: { label: string, current: number, target: number, color: string, unit: string }) {
    const hasTarget = target > 0
    const percentage = hasTarget ? Math.min((current / target) * 100, 100) : 0

    return (
        <MotionItem className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-5 flex flex-col items-center justify-center hover:border-orange-200 dark:hover:border-orange-900/30 transition-colors">
            <div className="relative w-24 h-24 mb-3">
                <svg className="w-full h-full transform -rotate-90">
                    <circle cx="48" cy="48" r="40" fill="none" stroke="currentColor" strokeWidth="8" className="text-stone-100 dark:text-stone-800" />
                    <circle
                        cx="48"
                        cy="48"
                        r="40"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="8"
                        className={color}
                        strokeDasharray={2 * Math.PI * 40}
                        strokeDashoffset={2 * Math.PI * 40 * (1 - percentage / 100)}
                        strokeLinecap="round"
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-xs font-medium text-stone-400">{label}</span>
                </div>
            </div>
            <div className="text-center">
                <span className="text-lg font-bold text-stone-900 dark:text-white font-heading block">{current}</span>
                {hasTarget ? (
                    <span className="text-xs text-stone-400">/ {target}{unit}</span>
                ) : (
                    <span className="text-xs font-semibold text-orange-500">Set goal</span>
                )}
            </div>
        </MotionItem>
    )
}
