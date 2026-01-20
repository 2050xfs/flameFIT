export type WidgetType = 'quick_log' | 'workout_carousel' | 'workout_detail' | 'session_scheduler' | 'progress_snapshot' | 'biometric_onboarding' | 'workout_builder';

export interface BaseWidget {
    type: WidgetType;
    id: string;
    title?: string;
}

export interface QuickLogWidget extends BaseWidget {
    type: 'quick_log';
    inputs: {
        name: string;
        label: string;
        type: 'text' | 'number' | 'select';
        value?: string;
        options?: string[];
    }[];
    submitLabel: string;
}

export interface WorkoutCarouselItem {
    id: string;
    title: string;
    meta: string; // e.g., "20m • High Intensity"
    image: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
}

export interface WorkoutCarouselWidget extends BaseWidget {
    type: 'workout_carousel';
    items: WorkoutCarouselItem[];
}

export interface WorkoutDetailWidget extends BaseWidget {
    type: 'workout_detail';
    videoUrl?: string; // YouTube or other embed
    stats: {
        duration: string;
        burn: string;
        difficulty: string;
    };
    equipment: string[];
    description: string;
}

export interface SessionSchedulerWidget extends BaseWidget {
    type: 'session_scheduler';
    coachName: string;
    availableSlots: string[]; // ISO Date strings
}

export interface ProgressSnapshotWidget extends BaseWidget {
    type: 'progress_snapshot';
    metrics: {
        label: string;
        value: string;
        change?: string; // e.g. "+2%"
        trend: 'up' | 'down' | 'neutral';
    }[];
}

export interface BiometricOnboardingWidget extends BaseWidget {
    type: 'biometric_onboarding';
    missingFields: string[];
}

export interface WorkoutBuilderWidget extends BaseWidget {
    type: 'workout_builder';
    step: 'goal' | 'muscles' | 'difficulty' | 'equipment';
}

export type ChatWidget =
    | QuickLogWidget
    | WorkoutCarouselWidget
    | WorkoutDetailWidget
    | SessionSchedulerWidget
    | ProgressSnapshotWidget
    | BiometricOnboardingWidget
    | WorkoutBuilderWidget;
