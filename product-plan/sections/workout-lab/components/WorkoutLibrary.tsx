import React from 'react'

interface LibraryItem {
    id: string
    title: string
    duration: string
    muscles: string[]
    lastPerformed: string
}

interface WorkoutLibraryProps {
    items: LibraryItem[]
    onBack: () => void
    onSelect: (id: string) => void
}

export function WorkoutLibrary({ items, onBack, onSelect }: WorkoutLibraryProps) {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right duration-500">

            {/* Header */}
            <div className="flex items-center justify-between">
                <button onClick={onBack} className="text-sm font-medium text-stone-500 hover:text-stone-900 dark:hover:text-stone-100">
                    ← Back to Lab
                </button>
                <h2 className="text-xl font-bold font-heading text-stone-900 dark:text-white">Workout Library</h2>
                <div className="w-16" /> {/* Spacer */}
            </div>

            {/* Search / Filter */}
            <div className="flex gap-2">
                <input
                    type="text"
                    placeholder="Search workouts..."
                    className="flex-1 bg-stone-100 dark:bg-stone-800 border-none rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-orange-500"
                />
                <button className="p-3 bg-stone-100 dark:bg-stone-800 rounded-xl text-stone-500">
                    ⚡️
                </button>
            </div>

            {/* Categories */}
            <div className="flex gap-2 overflow-x-auto pb-2 -mx-2 px-2">
                {['All', 'Strength', 'Cardio', 'Mobility', 'Favorites'].map((cat, i) => (
                    <button key={cat} className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap ${i === 0 ? 'bg-orange-500 text-white' : 'bg-stone-100 dark:bg-stone-800 text-stone-500'}`}>
                        {cat}
                    </button>
                ))}
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 gap-4">
                {items.map(item => (
                    <div
                        key={item.id}
                        onClick={() => onSelect(item.id)}
                        className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-5 rounded-2xl flex items-center justify-between group hover:border-orange-500 transition-colors cursor-pointer"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-orange-50 dark:bg-orange-900/10 flex items-center justify-center text-xl">
                                🏋️
                            </div>
                            <div>
                                <h3 className="font-bold text-stone-900 dark:text-white">{item.title}</h3>
                                <div className="flex items-center gap-2 text-xs text-stone-500 mt-1">
                                    <span>{item.duration}</span>
                                    <span>•</span>
                                    <span>{item.muscles.join(', ')}</span>
                                </div>
                            </div>
                        </div>
                        <div className="text-right hidden sm:block">
                            <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Last Run</p>
                            <p className="text-xs font-medium text-stone-600 dark:text-stone-300">{item.lastPerformed}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
