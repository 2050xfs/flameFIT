import React from 'react'
import type { KitchenProps } from '@/lib/types'
import { MacroHeadboard } from './MacroHeadboard'
import { MealStream } from './MealStream'
import { WaterTracker } from './WaterTracker'

export function Kitchen({
    macros,
    meals,
    waterIntake,
    waterTarget,
    onLogFood,
    onScanBarcode,
    onAddWater,
    onViewMeal
}: KitchenProps) {
    return (
        <div className="space-y-8 animate-in fade-in duration-500">

            {/* Header & Quick Actions */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold font-heading text-stone-900 dark:text-white">Kitchen</h2>
                    <p className="text-stone-500 dark:text-stone-400 mt-1">Track your nutrition and hit your macro targets</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={onScanBarcode}
                        className="px-4 py-2 bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 rounded-xl font-bold text-sm hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors flex items-center gap-2"
                    >
                        📷 Scan
                    </button>
                    <button
                        onClick={onLogFood}
                        className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold text-sm transition-colors"
                    >
                        + Smart Add
                    </button>
                </div>
            </div>

            {/* Macro Headboard */}
            <MacroHeadboard macros={macros} />

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Meal Stream */}
                <div className="lg:col-span-2">
                    <MealStream meals={meals} onViewMeal={onViewMeal} onLogFood={onLogFood} />
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    <WaterTracker current={waterIntake} target={waterTarget} onAddWater={onAddWater} />

                    {/* Quick Stats */}
                    <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-6">
                        <h3 className="text-sm font-bold uppercase tracking-wider text-stone-400 mb-4">Quick Stats</h3>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-stone-600 dark:text-stone-400">Meals Logged</span>
                                <span className="text-lg font-bold font-heading text-stone-900 dark:text-white">{meals.length}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-stone-600 dark:text-stone-400">Avg Meal Size</span>
                                <span className="text-lg font-bold font-heading text-stone-900 dark:text-white">
                                    {meals.length > 0 ? Math.round(macros.calories.current / meals.length) : 0} cal
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
