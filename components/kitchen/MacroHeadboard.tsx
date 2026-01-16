import React from 'react'
import type { MacroTargets } from '@/lib/types'

interface MacroHeadboardProps {
    macros: MacroTargets
}

export function MacroHeadboard({ macros }: MacroHeadboardProps) {
    const macroList = [
        { label: 'Calories', ...macros.calories, color: 'text-stone-500', bgColor: 'bg-stone-500', unit: 'kcal' },
        { label: 'Protein', ...macros.protein, color: 'text-rose-500', bgColor: 'bg-rose-500', unit: 'g' },
        { label: 'Carbs', ...macros.carbs, color: 'text-amber-500', bgColor: 'bg-amber-500', unit: 'g' },
        { label: 'Fats', ...macros.fats, color: 'text-teal-500', bgColor: 'bg-teal-500', unit: 'g' }
    ]

    return (
        <div className="bg-gradient-to-br from-stone-900 to-stone-800 dark:from-white dark:to-stone-50 rounded-3xl p-6 md:p-8 text-white dark:text-stone-900 relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-orange-500 to-rose-600 rounded-full blur-3xl opacity-20 pointer-events-none" />

            <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold font-heading">Today's Macros</h3>
                    <div className="text-xs font-mono opacity-70">
                        {macros.calories.current} / {macros.calories.target} kcal
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {macroList.map((macro) => {
                        const percentage = Math.min((macro.current / macro.target) * 100, 100)
                        const isOver = macro.current > macro.target

                        return (
                            <div key={macro.label} className="space-y-3">
                                <div className="flex items-baseline justify-between">
                                    <span className="text-xs font-medium opacity-70">{macro.label}</span>
                                    <span className={`text-xs font-mono ${isOver ? 'text-red-400' : 'opacity-70'}`}>
                                        {macro.current}/{macro.target}{macro.unit}
                                    </span>
                                </div>

                                {/* Progress Bar */}
                                <div className="h-2 bg-white/10 dark:bg-stone-900/20 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full ${macro.bgColor} transition-all duration-500 rounded-full ${isOver ? 'animate-pulse' : ''}`}
                                        style={{ width: `${percentage}%` }}
                                    />
                                </div>

                                {/* Large Number */}
                                <div className="text-center">
                                    <span className={`text-3xl font-bold font-heading ${macro.color}`}>
                                        {macro.current}
                                    </span>
                                    <span className="text-xs ml-1 opacity-50">{macro.unit}</span>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
