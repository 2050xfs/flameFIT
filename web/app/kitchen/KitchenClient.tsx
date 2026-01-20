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
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [isSearchingResults, setIsSearchingResults] = useState(false);


    const handleLogFood = () => {
        setIsSearching(true);
        setSearchResults([]);
    };

    const performSearch = async (formData: FormData) => {
        setIsSearchingResults(true);
        const { searchFoodAction } = await import('./actions');
        const items = await searchFoodAction(formData);
        setSearchResults(items || []);
        setIsSearchingResults(false);
    };

    const handleSelectFood = async (item: any) => {
        const mealData = {
            name: item.name,
            calories: item.calories,
            protein: item.protein,
            carbs: item.carbs,
            fats: item.fats,
            serving_size: item.servingSize || "1 serving",
            meal_type: 'snack' as const,
        };

        // 1. Optimistic Update
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
        setIsSearching(false);

        // 2. Server Action
        const { logMealAction } = await import('./actions');
        try {
            await logMealAction(mealData);
        } catch (err) {
            console.error("Failed to save meal:", err);
            setLocalMeals(prev => prev.filter(m => m.id !== newMeal.id));
        }
    };


    const handleScanBarcode = () => {
        console.log("Scan barcode clicked");
    };

    const handleAddWater = async () => {
        const optimisticAmount = waterIntake + 1;
        setWaterIntake(optimisticAmount);

        try {
            const { updateWaterAction } = await import('./actions');
            await updateWaterAction(1);
        } catch (err) {
            console.error("Failed to update water:", err);
            setWaterIntake(prev => prev - 1); // Revert on failure
        }
    };


    const handleViewMeal = (id: string) => {
        console.log("View meal:", id);
    };

    return (
        <React.Fragment>
            {isSearching && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
                    <div className="bg-white dark:bg-stone-900 w-full max-w-lg rounded-3xl p-8 shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold text-2xl font-heading">Smart Search</h3>
                            <button onClick={() => setIsSearching(false)} className="text-stone-400 hover:text-stone-600">
                                ✕
                            </button>
                        </div>

                        <form action={performSearch} className="flex gap-2 mb-6">
                            <input
                                autoFocus
                                name="query"
                                type="text"
                                placeholder="e.g. 2 eggs and a banana"
                                className="flex-1 bg-stone-100 dark:bg-stone-800 rounded-2xl px-5 py-4 outline-none focus:ring-2 ring-orange-500 text-lg"
                            />
                            <button
                                type="submit"
                                disabled={isSearchingResults}
                                className="bg-orange-500 text-white font-bold px-8 rounded-2xl hover:bg-orange-600 disabled:opacity-50 transition-colors"
                            >
                                {isSearchingResults ? '...' : 'Search'}
                            </button>
                        </form>

                        <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-thin">
                            {searchResults.length > 0 ? (
                                searchResults.map((item, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => handleSelectFood(item)}
                                        className="w-full bg-stone-50 dark:bg-stone-800/50 hover:bg-stone-100 dark:hover:bg-stone-800 p-4 rounded-2xl text-left transition-all border border-transparent hover:border-orange-500/30 flex justify-between items-center group"
                                    >
                                        <div>
                                            <p className="font-bold text-stone-900 dark:text-white capitalize text-base">{item.name}</p>
                                            <p className="text-xs text-stone-500 font-mono uppercase tracking-wider">{item.servingSize} • {item.calories} kcal</p>
                                        </div>
                                        <div className="flex gap-2 text-[10px] font-bold">
                                            <span className="bg-orange-500/10 text-orange-600 px-2 py-1 rounded">P: {item.protein}g</span>
                                            <span className="bg-blue-500/10 text-blue-600 px-2 py-1 rounded">C: {item.carbs}g</span>
                                        </div>
                                    </button>
                                ))
                            ) : !isSearchingResults ? (
                                <div className="text-center py-12 text-stone-400">
                                    <p className="text-sm">Search for food or a whole meal</p>
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                                    <p className="text-sm text-stone-500 font-medium">Analyzing nutrition...</p>
                                </div>
                            )}
                        </div>
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
