import React from 'react'
import type { MealEntry } from '@/lib/types'

interface MealStreamProps {
    meals: MealEntry[]
    onViewMeal?: (id: string) => void
    onLogFood?: () => void
}

export function MealStream({ meals, onViewMeal, onLogFood }: MealStreamProps) {
    const mealTypeEmojis: Record<string, string> = {
        breakfast: '🍳',
        lunch: '🥗',
        dinner: '🍽️',
        snack: '🍎'
    }

    const mealTypeColors: Record<string, string> = {
        breakfast: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300',
        lunch: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300',
        dinner: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
        snack: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
    }

    if (meals.length === 0) {
        return (
            <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-12 text-center">
                <div className="text-6xl mb-4">🍽️</div>
                <h3 className="text-xl font-bold font-heading text-stone-900 dark:text-white mb-2">No Meals Logged</h3>
                <p className="text-stone-500 dark:text-stone-400 mb-6 max-w-md mx-auto">
                    Start tracking your nutrition by logging your first meal of the day.
                </p>
                <button
                    onClick={onLogFood}
                    className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-medium transition-colors"
                >
                    Log First Meal
                </button>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-bold text-stone-900 dark:text-white font-heading">Meal Stream</h3>
                <span className="text-sm text-stone-500 dark:text-stone-400">{meals.length} entries today</span>
            </div>

            <div className="space-y-3">
                {meals.map((meal) => (
                    <button
                        key={meal.id}
                        onClick={() => onViewMeal?.(meal.id)}
                        className="w-full bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-5 hover:border-orange-200 dark:hover:border-orange-900 transition-all text-left group"
                    >
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex items-start gap-4 flex-1">
                                {/* Time & Type Badge */}
                                <div className="flex flex-col items-center gap-2">
                                    <span className="text-2xl">{mealTypeEmojis[meal.mealType]}</span>
                                    <span className="text-xs font-bold text-stone-400">{meal.time}</span>
                                </div>

                                {/* Meal Details */}
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <h4 className="font-bold text-stone-900 dark:text-white group-hover:text-orange-600 transition-colors">
                                            {meal.foodName}
                                        </h4>
                                        <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${mealTypeColors[meal.mealType]}`}>
                                            {meal.mealType}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-4 text-xs text-stone-500 dark:text-stone-400">
                                        <span>{meal.servingSize}</span>
                                        <span>•</span>
                                        <span>{meal.calories} cal</span>
                                    </div>
                                </div>
                            </div>

                            {/* Macro Summary */}
                            <div className="flex gap-4 text-xs">
                                <div className="text-center">
                                    <div className="font-bold text-rose-600 dark:text-rose-400">{meal.protein}g</div>
                                    <div className="text-stone-400">P</div>
                                </div>
                                <div className="text-center">
                                    <div className="font-bold text-amber-600 dark:text-amber-400">{meal.carbs}g</div>
                                    <div className="text-stone-400">C</div>
                                </div>
                                <div className="text-center">
                                    <div className="font-bold text-teal-600 dark:text-teal-400">{meal.fats}g</div>
                                    <div className="text-stone-400">F</div>
                                </div>
                            </div>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    )
}
