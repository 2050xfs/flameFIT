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
