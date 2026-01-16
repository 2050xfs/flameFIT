import React from 'react'

interface QuickLogProps {
    onBack: () => void
    onAdd: (item: any) => void
}

export function QuickLog({ onBack, onAdd }: QuickLogProps) {
    const recentItems = [
        { id: '1', name: 'Oatmeal & Whey', cals: 450, macros: '30P 50C 10F' },
        { id: '2', name: 'Grilled Chicken Salad', cals: 320, macros: '45P 10C 12F' },
        { id: '3', name: 'Greek Yogurt Bowl', cals: 220, macros: '20P 15C 5F' },
    ]

    const favorites = [
        { id: 'f1', icon: '🍌', name: 'Pre-Workout Banana' },
        { id: 'f2', icon: '🥤', name: 'Post-Workout Shake' },
        { id: 'f3', icon: '🥚', name: '3 Eggs Scramble' },
    ]

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-500">

            {/* Header */}
            <div className="flex items-center justify-between">
                <button
                    onClick={onBack}
                    className="p-2 -ml-2 text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
                >
                    <span className="sr-only">Back</span>
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <span className="font-bold text-stone-900 dark:text-white">Quick Log</span>
                <div className="w-6" /> {/* Spacer for balance */}
            </div>

            {/* Main Search */}
            <div className="relative">
                <input
                    type="text"
                    placeholder="Search food, brand, or restaurant..."
                    className="w-full bg-stone-100 dark:bg-stone-800 border-none rounded-xl py-4 pl-12 pr-4 text-lg outline-none focus:ring-2 focus:ring-orange-500 transition-shadow text-stone-900 dark:text-white placeholder-stone-400"
                    autoFocus
                />
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
                <button className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-stone-200 dark:bg-stone-700 rounded-lg text-stone-600 dark:text-stone-300 hover:opacity-80">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 9h2a1 1 0 001-1v-2a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 18h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                    </svg>
                </button>
            </div>

            {/* Barcode Scanner Promo */}
            <button className="w-full bg-gradient-to-r from-stone-900 to-stone-800 text-white rounded-xl p-4 flex items-center justify-center gap-3 shadow-lg shadow-stone-900/10 hover:shadow-stone-900/20 transition-all transform active:scale-95">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 9h2a1 1 0 001-1v-2a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 18h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                </svg>
                <span className="font-bold">Scan Barcode</span>
            </button>

            {/* Favorites Row */}
            <section>
                <h3 className="text-sm font-bold text-stone-500 uppercase tracking-wider mb-3">Favorites</h3>
                <div className="flex gap-4 overflow-x-auto pb-4 -mx-6 px-6 scrollbar-hide">
                    {favorites.map(fav => (
                        <button
                            key={fav.id}
                            onClick={() => onAdd(fav)}
                            className="flex flex-col items-center gap-2 min-w-[80px]"
                        >
                            <div className="w-16 h-16 rounded-2xl bg-orange-50 dark:bg-orange-900/10 flex items-center justify-center text-2xl border-2 border-transparent hover:border-orange-500 transition-colors">
                                {fav.icon}
                            </div>
                            <span className="text-[10px] font-bold text-stone-600 dark:text-stone-300 text-center leading-tight max-w-[80px]">{fav.name}</span>
                        </button>
                    ))}
                    <button className="flex flex-col items-center gap-2 min-w-[80px]">
                        <div className="w-16 h-16 rounded-2xl border-2 border-dashed border-stone-300 dark:border-stone-700 flex items-center justify-center text-stone-400 hover:border-stone-500 hover:text-stone-600 transition-colors">
                            +
                        </div>
                        <span className="text-[10px] font-bold text-stone-400 text-center">New</span>
                    </button>
                </div>
            </section>

            {/* Recent History */}
            <section>
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-bold text-stone-500 uppercase tracking-wider">Recent History</h3>
                    <button className="text-xs font-bold text-orange-500 hover:text-orange-600">View All</button>
                </div>

                <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl divide-y divide-stone-100 dark:divide-stone-800">
                    {recentItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => onAdd(item)}
                            className="w-full flex items-center justify-between p-4 hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors first:rounded-t-2xl last:rounded-b-2xl text-left group"
                        >
                            <div>
                                <p className="font-bold text-stone-900 dark:text-white">{item.name}</p>
                                <p className="text-xs font-mono text-stone-400">{item.macros}</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="font-bold text-stone-900 dark:text-white">{item.cals}</span>
                                <div className="w-6 h-6 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-400 flex items-center justify-center group-hover:bg-orange-500 group-hover:text-white transition-colors">
                                    +
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            </section>
        </div>
    )
}
