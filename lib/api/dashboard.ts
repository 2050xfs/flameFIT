import { DashboardProps } from "@/lib/types";

export async function getDashboardData(): Promise<Omit<DashboardProps, 'onStartWorkout' | 'onLogMeal' | 'onViewDetails'>> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    return {
        readiness: {
            score: 88,
            status: 'Optimal',
            message: 'Your recovery is excellent. Great day for a heavy lift.'
        },
        macros: {
            calories: { current: 1250, target: 2800 },
            protein: { current: 110, target: 200 },
            carbs: { current: 140, target: 300 },
            fats: { current: 45, target: 90 }
        },
        timeline: [
            {
                id: '1',
                time: '08:00',
                title: 'Oatmeal & Eggs',
                type: 'meal',
                status: 'completed',
                details: '600 kcal · 40g Protein'
            },
            {
                id: '2',
                time: '12:30',
                title: 'Chicken Salad',
                type: 'meal',
                status: 'completed',
                details: '450 kcal · 35g Protein'
            },
            {
                id: '3',
                time: '17:00',
                title: 'Pull Day (Back & Biceps)',
                type: 'workout',
                status: 'upcoming',
                details: 'Scheduled · 60 min'
            },
            {
                id: '4',
                time: '19:00',
                title: 'Post-Workout Shake',
                type: 'meal',
                status: 'upcoming',
                details: '300 kcal · 30g Protein'
            }
        ]
    };
}
