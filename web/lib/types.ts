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
    subscriptionStatus?: 'free' | 'pro' | 'elite';
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

export interface ReadinessData {
    score: number;
    status: 'Low Recovery' | 'High Readiness' | 'Optimal';
    message: string;
}

export interface TimelineItem {
    id: string;
    time: string;
    title: string;
    type: 'workout' | 'meal';
    status: 'completed' | 'upcoming' | 'missed';
    details: string;
}

export interface DashboardProps {
    readiness: ReadinessData;
    macros: {
        calories: MacroTarget;
        protein: MacroTarget;
        carbs: MacroTarget;
        fats: MacroTarget;
    };
    water: {
        current: number;
        target: number;
    };
    timeline: TimelineItem[];
    insight?: {
        type: 'success' | 'warning' | 'info';
        message: string;
        actionLabel?: string;
    } | null;
    onStartWorkout?: (id: string) => void;
    onLogMeal?: () => void;
    onAddWater?: () => void;
    onViewDetails?: (id: string) => void;
    onInsightAction?: () => void;
}


// Workout Lab Types
export interface WorkoutExercise {
    id: string; // The session-specific log entry or unique grouping id
    exerciseId: string; // The master exercise definition id
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
    status?: 'upcoming' | 'active' | 'completed';
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

export interface ProProgram {
    id: string;
    title: string;
    creator: string;
    description: string;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    durationWeeks: number;
    thumbnailUrl?: string;
    isOwned?: boolean;
}

export interface WorkoutLabProps {
    currentPlan: { name: string; week: number };
    weeklySchedule: WeeklyDay[];
    todaysWorkout: WorkoutDetail | null;
    upcomingWorkouts: WorkoutDetail[];
    proPrograms?: ProProgram[];
    customWorkouts?: any[];
    onStartWorkout?: (id: string) => void;
    onViewDetails?: (id: string) => void;
    onSubscribeToProgram?: (id: string) => void;
    onBrowseLibrary?: () => void;
    onManagePlan?: () => void;
    onCreateCustomWorkout?: () => void;
    onViewProProgram?: (id: string) => void;
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
    isPremium?: boolean;
    slug?: string;
}

export interface Article {
    id: string;
    slug: string;
    title: string;
    description: string;
    content: string;
    category: string;
    thumbnailUrl: string;
    tags: string[];
    wordCount: number;
    isPremium: boolean;
    date: string;
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
    onLogWeight?: () => void;
}
export interface SparkConfig {
    objective: 'hypertrophy' | 'strength' | 'endurance' | 'mobility' | 'fat-loss';
    muscles: string[]; // e.g., 'chest', 'back', 'legs'
    duration: number; // in minutes
    equipment: 'full-gym' | 'dumbbell-only' | 'bodyweight' | 'home-gym';
    intensity: 'low' | 'moderate' | 'high';
}

export interface GeneratedWorkout {
    id: string;
    title: string;
    description: string;
    exercises: WorkoutExercise[];
    stats: {
        volume: number;
        intensity: number; // CNS intensity
        calories: number;
        duration: number;
    };
}

