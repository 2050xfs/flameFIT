
"use client";

import React from 'react';
import { GeneratedWorkout } from '@/lib/types';
import { Play, Sparkles, BarChart3, Clock, History, MoreVertical } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { WorkoutStatsSheet } from './WorkoutStatsSheet';


export function WorkoutLibrary() {
    const router = useRouter();
    const [savedWorkouts, setSavedWorkouts] = React.useState<GeneratedWorkout[]>([]);
    const [selectedWorkout, setSelectedWorkout] = React.useState<GeneratedWorkout | null>(null);
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchWorkouts = async () => {
            try {
                const { getGeneratedWorkoutsAction } = await import('@/lib/api/workout-actions');
                const result = await getGeneratedWorkoutsAction();

                if (!result.success || !result.data) throw new Error(result.error);

                const workouts = result.data;

                // Map Supabase data to GeneratedWorkout type
                const mapped = workouts.map((w: any) => ({
                    id: w.id,
                    title: w.title,
                    description: w.description || '',
                    exercises: w.exercises || [],
                    stats: {
                        volume: w.total_volume || 0,
                        intensity: parseFloat(w.cns_intensity) || 0,
                        calories: w.estimated_calories || 0,
                        duration: w.estimated_duration || 0
                    }
                }));

                setSavedWorkouts(mapped);
            } catch (error) {
                console.error('Failed to fetch generated workouts:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchWorkouts();
    }, []);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500" />
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
            {/* Header / Filter placeholder */}
            <div className="flex items-center justify-between">
                <h3 className="font-bold text-lg flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-orange-500" />
                    Spark Blueprints
                </h3>
                <span className="text-xs text-stone-500 uppercase font-bold tracking-wider">{savedWorkouts.length} Saved</span>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {savedWorkouts.map((workout) => (
                    <div key={workout.id} className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-5 hover:border-orange-500/50 transition-all group relative">
                        {/* Card Header */}
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h4 className="font-bold font-heading text-lg text-stone-900 dark:text-white group-hover:text-orange-500 transition-colors">
                                    {workout.title}
                                </h4>
                                <p className="text-xs text-stone-500 line-clamp-1 dark:text-stone-400">{workout.description}</p>
                            </div>
                            <button className="p-1 hover:bg-stone-100 dark:hover:bg-stone-800 rounded">
                                <MoreVertical className="w-4 h-4 text-stone-400" />
                            </button>
                        </div>

                        {/* Stats Rail */}
                        <div className="flex gap-4 mb-6">
                            <div className="flex items-center gap-1.5 text-xs text-stone-500 dark:text-stone-400">
                                <Clock className="w-3.5 h-3.5" />
                                {workout.stats.duration}m
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-stone-500 dark:text-stone-400">
                                <BarChart3 className="w-3.5 h-3.5" />
                                {workout.stats.volume > 0 ? `${(workout.stats.volume / 1000).toFixed(1)}k kg` : 'N/A'}
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-stone-500 dark:text-stone-400">
                                <History className="w-3.5 h-3.5" />
                                3 runs
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3">
                            <button
                                onClick={() => setSelectedWorkout(workout)}
                                className="flex-1 py-2.5 bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 rounded-xl text-xs font-bold hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors"
                            >
                                View Stats
                            </button>
                            <button
                                onClick={() => router.push('/workouts')}
                                className="flex-1 py-2.5 bg-stone-900 dark:bg-white text-white dark:text-stone-900 rounded-xl text-xs font-bold hover:opacity-90 transition-colors flex items-center justify-center gap-2 shadow-sm"
                            >
                                <Play className="w-3 h-3 fill-current" />
                                Deploy
                            </button>
                        </div>
                    </div>
                ))}

                {/* Add New Card */}
                <button
                    onClick={() => router.push('/workouts/create')}
                    className="border-2 border-dashed border-stone-200 dark:border-stone-800 rounded-2xl p-5 flex flex-col items-center justify-center gap-3 text-stone-400 hover:text-orange-500 hover:border-orange-500 transition-colors min-h-[180px]"
                >
                    <div className="w-12 h-12 rounded-full bg-stone-100 dark:bg-stone-900 flex items-center justify-center">
                        <Sparkles className="w-6 h-6" />
                    </div>
                    <span className="font-bold text-sm">Create New Spark</span>
                </button>
            </div>

            <WorkoutStatsSheet
                workout={selectedWorkout}
                onClose={() => setSelectedWorkout(null)}
            />
        </div>
    );
}
