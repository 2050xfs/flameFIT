"use client";

import React, { useState, useRef, useCallback } from "react";
import { Kitchen } from "@/components/kitchen";
import { KitchenProps } from "@/lib/types";
import { Camera, ScanLine, X } from "lucide-react";

// Pick only the data props, as callbacks are handled here
type KitchenData = Omit<KitchenProps, "onLogFood" | "onScanBarcode" | "onAddWater" | "onViewMeal">;

type ModalMode = 'search' | 'barcode' | null;

export function KitchenClient({ initialData }: { initialData: KitchenData }) {
    const [waterIntake, setWaterIntake] = useState(initialData.waterIntake);
    const [modalMode, setModalMode] = useState<ModalMode>(null);
    const [localMeals, setLocalMeals] = useState(initialData.meals);
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [isSearchingResults, setIsSearchingResults] = useState(false);
    const [barcodeError, setBarcodeError] = useState<string | null>(null);
    const [barcodeScanning, setBarcodeScanning] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleLogFood = () => {
        setModalMode('search');
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
        setModalMode(null);

        const { logMealAction } = await import('./actions');
        try {
            await logMealAction(mealData);
        } catch (err) {
            console.error("Failed to save meal:", err);
            setLocalMeals(prev => prev.filter(m => m.id !== newMeal.id));
        }
    };

    const handleScanBarcode = () => {
        setBarcodeError(null);
        setModalMode('barcode');
    };

    // Handle image file from camera/file picker — use BarcodeDetector API if available,
    // otherwise fall back to sending the barcode number from the file name hint or prompting manual entry.
    const handleBarcodeImage = useCallback(async (file: File) => {
        setBarcodeScanning(true);
        setBarcodeError(null);

        try {
            // Try native BarcodeDetector API (Chrome 88+, Edge 88+, Safari 17.4+)
            if ('BarcodeDetector' in window) {
                const detector = new (window as any).BarcodeDetector({
                    formats: ['ean_13', 'ean_8', 'upc_a', 'upc_e', 'code_128', 'code_39', 'qr_code'],
                });
                const bitmap = await createImageBitmap(file);
                const barcodes = await detector.detect(bitmap);

                if (barcodes.length > 0) {
                    const code = barcodes[0].rawValue;
                    await searchByBarcode(code);
                    return;
                }
            }

            // Fallback: open search modal pre-filled for manual entry
            setBarcodeError('Barcode not detected. Please search manually.');
            setModalMode('search');
        } catch (err: any) {
            setBarcodeError('Could not read barcode. Try searching manually.');
            setModalMode('search');
        } finally {
            setBarcodeScanning(false);
        }
    }, []);

    const searchByBarcode = async (barcode: string) => {
        setIsSearchingResults(true);
        try {
            const { searchFoodAction } = await import('./actions');
            const fd = new FormData();
            fd.append('query', barcode);
            const items = await searchFoodAction(fd);
            setSearchResults(items || []);
            setModalMode('search');
        } finally {
            setIsSearchingResults(false);
        }
    };

    const handleAddWater = async () => {
        const optimisticAmount = waterIntake + 1;
        setWaterIntake(optimisticAmount);
        try {
            const { updateWaterAction } = await import('./actions');
            await updateWaterAction(1);
        } catch (err) {
            console.error("Failed to update water:", err);
            setWaterIntake(prev => prev - 1);
        }
    };

    const handleViewMeal = (_id: string) => {
        // Future: open meal detail sheet
    };

    return (
        <React.Fragment>
            {/* Smart Search Modal */}
            {modalMode === 'search' && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
                    <div className="bg-white dark:bg-stone-900 w-full max-w-lg rounded-3xl p-8 shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold text-2xl font-heading">Smart Search</h3>
                            <button onClick={() => setModalMode(null)} className="text-stone-400 hover:text-stone-600">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {barcodeError && (
                            <div className="mb-4 px-4 py-3 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 text-sm rounded-xl">
                                {barcodeError}
                            </div>
                        )}

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

                        <div className="flex-1 overflow-y-auto space-y-3 pr-2">
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

            {/* Barcode Scanner Modal */}
            {modalMode === 'barcode' && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
                    <div className="bg-white dark:bg-stone-900 w-full max-w-sm rounded-3xl p-8 shadow-2xl text-center">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold text-xl font-heading">Scan Barcode</h3>
                            <button onClick={() => setModalMode(null)} className="text-stone-400 hover:text-stone-600">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Scanner illustration */}
                        <div className="relative w-48 h-48 mx-auto mb-6 rounded-2xl bg-stone-100 dark:bg-stone-800 flex items-center justify-center overflow-hidden">
                            <ScanLine className="w-16 h-16 text-orange-500 opacity-50" />
                            <div className="absolute inset-x-4 top-1/2 -translate-y-px h-0.5 bg-orange-500 animate-pulse" />
                        </div>

                        <p className="text-sm text-stone-500 dark:text-stone-400 mb-6">
                            Point your camera at a product barcode or upload a photo of it.
                        </p>

                        {barcodeScanning ? (
                            <div className="flex items-center justify-center gap-3 text-orange-500 font-medium">
                                <div className="w-5 h-5 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
                                Reading barcode...
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {/* Camera capture (mobile) */}
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="w-full flex items-center justify-center gap-2 py-3.5 bg-orange-500 text-white rounded-2xl font-bold hover:bg-orange-600 transition-colors"
                                >
                                    <Camera className="w-5 h-5" />
                                    Open Camera
                                </button>
                                <button
                                    onClick={() => { setModalMode(null); setTimeout(() => setModalMode('search'), 100); }}
                                    className="w-full py-3 text-sm text-stone-500 hover:text-stone-700 dark:hover:text-stone-300 transition-colors"
                                >
                                    Search manually instead
                                </button>
                            </div>
                        )}

                        {/* Hidden file input — capture=environment opens rear camera on mobile */}
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            capture="environment"
                            className="hidden"
                            onChange={e => {
                                const file = e.target.files?.[0];
                                if (file) handleBarcodeImage(file);
                                e.target.value = '';
                            }}
                        />
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
