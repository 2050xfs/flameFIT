"use client";

import React, { useState } from "react";
import { Kitchen } from "@/components/kitchen";
import { KitchenProps } from "@/lib/types";

// Pick only the data props, as callbacks are handled here
type KitchenData = Omit<KitchenProps, "onLogFood" | "onScanBarcode" | "onAddWater" | "onViewMeal">;

export function KitchenClient({ initialData }: { initialData: KitchenData }) {
    const [waterIntake, setWaterIntake] = useState(initialData.waterIntake);
    const [isSearching, setIsSearching] = useState(false);

    // Stub for optimistic UI
    const [localMeals, setLocalMeals] = useState(initialData.meals);

    const handleLogFood = () => {
        setIsSearching(true);
    };

    const performSearch = async (formData: FormData) => {
        // Dynamic import to avoid server-action issues in client component if not set up perfectly
        // But here we use the action passed down or imported.
        // For prototype, we'll just log and mock "adding" to the list
        // const query = formData.get('query');
        // console.log("Searching for:", query);

        // Optimistic add for demo linked to real search
        const { searchFoodAction } = await import('./actions');
        const items = await searchFoodAction(formData);

        if (items && items.length > 0) {
            const item = items[0];
            const mealData = {
                name: item.name,
                calories: item.calories,
                protein: item.protein,
                carbs: item.carbs,
                fats: item.fats,
                serving_size: item.servingSize || "1 serving",
                meal_type: 'snack' as const,
            };

            // 1. Optimistic Update (Immediate UI feedback)
            const newMeal: any = {
                id: `temp-${Date.now()}`,
                foodName: item.name,
                calories: item.calories,
                protein: item.protein,
                carbs: item.carbs,
                fats: item.fats,
                servingSize: item.servingSize,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                mealType: 'snack',
            };
            setLocalMeals(prev => [newMeal, ...prev]);

            // 2. Server Action (Persist to DB)
            // We import dynamically to avoid client-side bundling issues with server actions if strictly separated
            // though normally they can be imported directly if 'use server' is at top of file.
            const { logMealAction } = await import('./actions');
            try {
                await logMealAction(mealData);
                console.log("Meal logged to Supabase!");
            } catch (err) {
                console.error("Failed to save meal:", err);
                // Optionally revert optimistic update here
            }
        }

        setIsSearching(false);
    };

    const handleScanBarcode = () => {
        console.log("Scan barcode clicked");
    };

    const handleAddWater = () => {
        setWaterIntake(prev => Math.min(prev + 1, initialData.waterTarget + 5));
    };

    const handleViewMeal = (id: string) => {
        console.log("View meal:", id);
    };

    return (
        <React.Fragment>
            {isSearching && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-in fade-in">
                    <div className="bg-white dark:bg-stone-900 w-full max-w-lg rounded-2xl p-6 shadow-2xl">
                        <h3 className="font-bold text-lg mb-4">Smart Add Food</h3>
                        <form action={performSearch} className="flex gap-2">
                            <input
                                autoFocus
                                name="query"
                                type="text"
                                placeholder="e.g. 1 cup oatmeal and 2 eggs"
                                className="flex-1 bg-stone-100 dark:bg-stone-800 rounded-xl px-4 py-3 outline-none focus:ring-2 ring-orange-500"
                            />
                            <button type="submit" className="bg-orange-500 text-white font-bold px-6 rounded-xl hover:bg-orange-600">
                                Add
                            </button>
                        </form>
                        <button onClick={() => setIsSearching(false)} className="mt-4 text-xs font-bold text-stone-500 uppercase hover:text-stone-800">
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            <Kitchen
                {...initialData}
                meals={localMeals}
                waterIntake={waterIntake}
                onLogFood={handleLogFood}
                onScanBarcode={handleScanBarcode}
                onAddWater={handleAddWater}
                onViewMeal={handleViewMeal}
            />
        </React.Fragment>
    );
}
