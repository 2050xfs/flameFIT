import type { ProgressProps } from '@/lib/types'
import { PhotoCompare } from './PhotoCompare'
import { HistoryList } from './HistoryList'
import { WorkoutLibrary } from './WorkoutLibrary'

export { PhotoCompare, HistoryList, WorkoutLibrary }

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

export function Progress({ data, onMetricChange, onComparePhotos, onLogWeight }: ProgressProps) {
    const searchParams = useSearchParams();
    const tabParam = searchParams.get('tab');

    // Initialize tab from URL or default to 'stats'
    const [activeTab, setActiveTab] = useState<'stats' | 'photos' | 'history' | 'library'>(
        (tabParam === 'library' || tabParam === 'photos' || tabParam === 'history') ? tabParam : 'stats'
    );

    // Sync tab with URL if it changes externally
    useEffect(() => {
        if (tabParam && ['stats', 'photos', 'history', 'library'].includes(tabParam)) {
            setActiveTab(tabParam as any);
        }
    }, [tabParam]);

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20">

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold font-heading text-stone-900 dark:text-white">Progress</h2>
                    <p className="text-stone-500 dark:text-stone-400 text-sm">Track your transformation</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={onLogWeight}
                        className="bg-teal-500/10 text-teal-600 px-4 py-2 rounded-xl text-xs font-bold hover:bg-teal-500/20 transition-all"
                    >
                        Log Weight
                    </button>
                    <div className="flex bg-stone-100 dark:bg-stone-800 p-1 rounded-xl">
                        {['Stats', 'Photos', 'History', 'Library'].map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab.toLowerCase() as any)}
                                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === tab.toLowerCase()
                                    ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-white shadow-sm'
                                    : 'text-stone-500'
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>

            </div>

            {/* Stats View */}
            {activeTab === 'stats' && (
                <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                    {/* Chart Hero */}
                    <div className="bg-stone-900 text-white p-6 rounded-3xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500 blur-[100px] opacity-20 pointer-events-none" />

                        <div className="relative z-10">
                            <div className="flex justify-between items-start mb-8">
                                <div>
                                    <p className="text-stone-400 text-sm font-bold uppercase tracking-wider mb-1">{data.stats[0].label}</p>
                                    <h3 className="text-4xl font-bold font-heading">{data.stats[0].value} <span className="text-lg text-stone-500 font-sans">{data.stats[0].unit}</span></h3>
                                </div>
                                <div className="px-3 py-1 bg-teal-500/10 text-teal-500 rounded-lg text-xs font-bold">
                                    {data.stats[0].trend}
                                </div>
                            </div>

                            {/* Simulated Chart */}
                            <div className="h-48 flex items-end gap-2">
                                {data.charts.weight.map((point, i) => (
                                    <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                                        <div
                                            className="w-full bg-stone-800 rounded-t-xl hover:bg-teal-500 transition-colors relative group-hover:shadow-[0_0_20px_rgba(20,184,166,0.5)]"
                                            style={{ height: `${(point.value / 200) * 100}%` }}
                                        >
                                            <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white text-stone-900 text-xs font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                                {point.value} lbs
                                            </div>
                                        </div>
                                        <span className="text-[10px] text-stone-500 font-mono">{point.date}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Stat Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        {data.stats.slice(1).map((stat, i) => (
                            <div key={i} className="bg-white dark:bg-stone-900 p-5 rounded-2xl border border-stone-200 dark:border-stone-800">
                                <p className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-2">{stat.label}</p>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-2xl font-bold font-heading text-stone-900 dark:text-white">{stat.value}</span>
                                    <span className="text-xs text-stone-500">{stat.unit}</span>
                                </div>
                                {stat.trend && (
                                    <div className={`mt-2 text-xs font-bold ${stat.trendDir === 'up' ? 'text-teal-500' :
                                        stat.trendDir === 'down' ? 'text-rose-500' : 'text-stone-400'
                                        }`}>
                                        {stat.trend}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Photos View */}
            {activeTab === 'photos' && (
                <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                    <div className="grid grid-cols-2 gap-4">
                        {data.photos.map(photo => (
                            <div key={photo.id} className={`aspect-[3/4] rounded-2xl bg-cover bg-center relative group`} style={{ backgroundImage: `url(${photo.url})` }}>
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />
                                <div className="absolute top-3 left-3 bg-black/50 backdrop-blur-md px-2 py-1 rounded text-xs font-bold text-white">
                                    {photo.date}
                                </div>
                            </div>
                        ))}
                        <button className="aspect-[3/4] rounded-2xl border-2 border-dashed border-stone-300 dark:border-stone-700 flex flex-col items-center justify-center text-stone-400 hover:border-orange-500 hover:text-orange-500 transition-colors gap-2">
                            <span className="text-3xl">📷</span>
                            <span className="text-xs font-bold">Add Photo</span>
                        </button>
                    </div>

                    <button
                        onClick={onComparePhotos}
                        className="w-full py-4 bg-stone-900 dark:bg-white text-white dark:text-stone-900 rounded-2xl font-bold shadow-lg"
                    >
                        Compare Side-by-Side
                    </button>
                </div>
            )}

            {/* History View */}
            {activeTab === 'history' && (
                <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
                    {data.history.map(item => (
                        <div key={item.id} className="flex gap-4 items-center">
                            <div className="flex flex-col items-center gap-1 min-w-[3rem]">
                                <span className="text-[10px] font-bold text-stone-400 uppercase">{item.date}</span>
                                <div className="w-2 h-2 rounded-full bg-stone-300 dark:bg-stone-700" />
                                <div className="w-0.5 h-full bg-stone-200 dark:bg-stone-800 -mb-4" />
                            </div>
                            <div className="flex-1 bg-white dark:bg-stone-900 p-4 rounded-2xl border border-stone-200 dark:border-stone-800 flex justify-between items-center group hover:border-orange-500/50 transition-colors">
                                <div>
                                    <h4 className="font-bold text-stone-900 dark:text-white">{item.title}</h4>
                                    <p className="text-xs text-stone-500 mt-1">{item.volume} total volume</p>
                                </div>
                                {item.records > 0 && (
                                    <div className="px-2 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded text-[10px] font-bold uppercase tracking-wider">
                                        {item.records} PRs 🏆
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Library View */}
            {activeTab === 'library' && (
                <WorkoutLibrary />
            )}
        </div>
    )
}
