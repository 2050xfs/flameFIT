import type { DashboardProps } from '@/lib/types'
import { SparkInsight } from './SparkInsight'
import { ReadinessCard } from './ReadinessCard'
import { HydrationWidget } from './HydrationWidget'
import { QuickActions } from './QuickActions'
import { NutritionTarget } from './NutritionTarget'
import { TodayTimeline } from './TodayTimeline'

export function Dashboard({
    readiness,
    macros,
    water,
    timeline,
    insight,
    onStartWorkout,
    onLogMeal,
    onAddWater,
    onViewDetails,
    onInsightAction
}: DashboardProps & { onInsightAction?: () => void }) {

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Spark Insight Card */}
            {insight && (
                <SparkInsight
                    insight={{
                        ...insight,
                        onAction: onInsightAction
                    }}
                />
            )}

            {/* Header Area */}
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <ReadinessCard readiness={readiness} />
                <HydrationWidget water={water} onAddWater={onAddWater} />
                <QuickActions onStartWorkout={onStartWorkout} onLogMeal={onLogMeal} />
            </section>

            {/* Macro Rings */}
            <NutritionTarget macros={macros} onLogMeal={onLogMeal} />

            {/* Timeline */}
            <TodayTimeline
                timeline={timeline}
                onStartWorkout={onStartWorkout}
                onLogMeal={onLogMeal}
                onViewDetails={onViewDetails}
            />
        </div>
    )
}
