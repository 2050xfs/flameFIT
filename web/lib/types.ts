export interface User {
    id: string;
    name: string;
    email: string;
    height: number; // in cm
    weight: number; // in kg
    goals: string[];
    preferences: {
        theme: 'light' | 'dark' | 'system';
        units: 'metric' | 'imperial';
    };
}

export interface Exercise {
    id: string;
    name: string;
    muscleGroups: string[];
    videoUrl?: string;
    description?: string;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export interface SetLog {
    id: string;
    exerciseId: string;
    weight: number;
    reps: number;
    rpe?: number; // Rate of Perceived Exertion (1-10)
    completedAt: string; // ISO date string
}

export interface WorkoutSession {
    id: string;
    userId: string;
    date: string; // ISO date string
    duration: number; // in minutes
    name: string;
    status: 'planned' | 'active' | 'completed';
    sets: SetLog[];
}

export interface FoodItem {
    id: string;
    name: string;
    brand?: string;
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
    servingSize: string;
}

export interface NutrientLog {
    id: string;
    userId: string;
    date: string; // ISO date string
    mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
    items: {
        foodItemId: string;
        quantity: number; // multiplier of serving size
        foodItem: FoodItem; // embed for easier access
    }[];
    totalCalories: number;
    totalProtein: number;
    totalCarbs: number;
    totalFats: number;
}

export interface MacroTarget {
    current: number;
    target: number;
}

export interface DashboardProps {
    readiness: {
        score: number;
        status: 'Low Recovery' | 'High Readiness' | 'Optimal';
        message: string;
    };
    macros: {
        calories: MacroTarget;
        protein: MacroTarget;
        carbs: MacroTarget;
        fats: MacroTarget;
    };
    timeline: {
        id: string;
        time: string;
        title: string;
        type: 'workout' | 'meal';
        status: 'completed' | 'upcoming' | 'missed';
        details: string;
    }[];
    onStartWorkout?: (id: string) => void;
    onLogMeal?: () => void;
    onViewDetails?: (id: string) => void;
}

// Workout Lab Types
export interface WorkoutExercise {
    name: string;
    sets: number;
    reps: string;
}

export interface WorkoutDetail {
    id: string;
    title: string;
    intensity: 'Low' | 'Moderate' | 'High';
    duration: string;
    muscles: string[];
    exercises: WorkoutExercise[];
    date?: string;
}

export interface WeeklyDay {
    day: string;
    date: string;
    code: string;
    status: 'completed' | 'active' | 'upcoming';
}

export interface CurrentPlan {
    name: string;
    week: number;
}

export interface WorkoutLabProps {
    currentPlan: CurrentPlan;
    weeklySchedule: WeeklyDay[];
    todaysWorkout: WorkoutDetail | null;
    upcomingWorkouts: WorkoutDetail[];
    onStartWorkout?: (id: string) => void;
    onViewDetails?: (id: string) => void;
}

// Kitchen Types
export interface MealEntry {
    id: string;
    time: string;
    mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
    foodName: string;
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
    servingSize: string;
}

export interface MacroTargets {
    calories: MacroTarget;
    protein: MacroTarget;
    carbs: MacroTarget;
    fats: MacroTarget;
}

export interface KitchenProps {
    macros: MacroTargets;
    meals: MealEntry[];
    waterIntake: number;
    waterTarget: number;
    onLogFood?: () => void;
    onScanBarcode?: () => void;
    onAddWater?: () => void;
    onViewMeal?: (id: string) => void;
}

// Knowledge Base Types
export interface ContentItem {
    id: string;
    title: string;
    description: string;
    category: 'strength' | 'cardio' | 'mobility' | 'nutrition' | 'recovery';
    tags: string[];
    duration: string;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    thumbnailUrl: string;
    videoUrl?: string;
    isBookmarked?: boolean;
}

export interface KnowledgeBaseProps {
    featured: ContentItem[];
    categories: {
        strength: ContentItem[];
        cardio: ContentItem[];
        mobility: ContentItem[];
        nutrition: ContentItem[];
        recovery: ContentItem[];
    };
    bookmarked: ContentItem[];
    onViewContent?: (id: string) => void;
    onSearch?: (query: string) => void;
    onBookmark?: (id: string) => void;
}

// Progress Types
export interface WeightChartPoint {
    date: string;
    value: number;
}

export interface StatItem {
    label: string;
    value: string;
    unit: string;
    trend?: string;
    trendDir?: 'up' | 'down';
}

export interface PhotoItem {
    id: string;
    url: string;
    date: string;
}

export interface HistoryItem {
    id: string;
    date: string;
    title: string;
    volume: string;
    records: number;
}

export interface ProgressData {
    charts: {
        weight: WeightChartPoint[];
    };
    stats: StatItem[];
    photos: PhotoItem[];
    history: HistoryItem[];
}

export interface ProgressProps {
    data: ProgressData;
    onMetricChange?: (metric: string) => void;
    onComparePhotos?: () => void;
}
