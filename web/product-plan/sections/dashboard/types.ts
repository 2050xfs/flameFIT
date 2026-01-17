export interface ReadinessData {
    score: number
    status: string
    message: string
}

export interface MacroData {
    current: number
    target: number
}

export interface DailyMacros {
    calories: MacroData
    protein: MacroData
    carbs: MacroData
    fats: MacroData
}

export interface TimelineItem {
    id: string
    time: string
    type: 'meal' | 'workout'
    title: string
    status: 'completed' | 'upcoming' | 'pending'
    details: string
}

export interface DashboardProps {
    readiness: ReadinessData
    macros: DailyMacros
    timeline: TimelineItem[]
    onStartWorkout?: (id: string) => void
    onLogMeal?: (id?: string) => void
    onViewDetails?: (type: string) => void
}
