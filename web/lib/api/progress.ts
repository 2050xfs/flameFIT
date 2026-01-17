import { ProgressData } from "../types";

export const getProgressData = async (): Promise<ProgressData> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    return {
        charts: {
            weight: [
                { date: 'Jan 1', value: 195 },
                { date: 'Jan 8', value: 194 },
                { date: 'Jan 15', value: 192.5 },
                { date: 'Jan 22', value: 191 },
                { date: 'Jan 29', value: 190 },
                { date: 'Feb 5', value: 188.5 },
                { date: 'Feb 12', value: 187 },
                { date: 'Feb 19', value: 186 },
                { date: 'Feb 26', value: 185 }
            ]
        },
        stats: [
            {
                label: 'Current Weight',
                value: '185.0',
                unit: 'lbs',
                trend: '-0.5 lbs this week',
                trendDir: 'up' // up in this context might mean good progress, but usually weight down is green. The component uses teal for up... let's check.
                // Component: trendDir === 'up' ? 'text-teal-500'. So we want 'up' for good things.
            },
            {
                label: 'Body Fat',
                value: '18.5',
                unit: '%',
                trend: '-1.2% this month',
                trendDir: 'up'
            },
            {
                label: 'Muscle Mass',
                value: '142.5',
                unit: 'lbs',
                trend: '+2.1 lbs this month',
                trendDir: 'up'
            },
            {
                label: 'Weekly Volume',
                value: '42.5k',
                unit: 'lbs',
                trend: '+5% vs last week',
                trendDir: 'up'
            },
            {
                label: 'Workouts',
                value: '12',
                unit: '/mo',
                trend: 'On track',
                trendDir: 'up'
            }
        ],
        photos: [
            { id: '1', url: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=2070&auto=format&fit=crop', date: 'Today' },
            { id: '2', url: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=2070&auto=format&fit=crop', date: 'Jan 12' },
            { id: '3', url: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=2070&auto=format&fit=crop', date: 'Dec 15' },
        ],
        history: [
            { id: '1', date: 'Today', title: 'Leg Day (Hypertrophy)', volume: '18,500 lbs', records: 2 },
            { id: '2', date: 'Yesterday', title: 'Pull Day', volume: '14,200 lbs', records: 0 },
            { id: '3', date: 'Jan 13', title: 'Push Day', volume: '16,800 lbs', records: 1 },
            { id: '4', date: 'Jan 11', title: 'Leg Day', volume: '17,900 lbs', records: 1 },
            { id: '5', date: 'Jan 10', title: 'Cardio', volume: '0 lbs', records: 0 },
        ]
    };
};
