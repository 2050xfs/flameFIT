import type { DashboardProps } from '@/lib/types'
import { MotionDiv, scaleIn } from '@/components/ui/motion'

interface HydrationWidgetProps {
    water: DashboardProps['water']
    onAddWater?: () => void
}

export function HydrationWidget({ water, onAddWater }: HydrationWidgetProps) {
    return (
        <MotionDiv variants={scaleIn} className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 flex flex-col items-center justify-between group">
            <div className="w-full flex justify-between items-center mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-400">Hydration</span>
                <span className="text-xs font-mono text-stone-500">{water.current}/{water.target} glasses</span>
            </div>

            <div className="relative w-32 h-32 my-2 cursor-pointer hover:scale-105 transition-transform" onClick={onAddWater}>
                <div className="absolute inset-0 rounded-full border-4 border-stone-100 dark:border-stone-800" />
                <div className="absolute inset-0 flex items-end justify-center overflow-hidden rounded-full">
                    <div
                        className="w-full bg-gradient-to-t from-blue-500 to-cyan-400 transition-all duration-700 ease-out"
                        style={{ height: `${Math.min((water.current / water.target) * 100, 100)}%` }}
                    />
                </div>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold font-heading text-stone-900 dark:text-white">{water.current}</span>
                    <span className="text-[10px] font-medium text-stone-500 uppercase">glasses</span>
                </div>
            </div>

            <button
                onClick={onAddWater}
                className="w-full py-2 bg-blue-500/10 hover:bg-blue-500 text-blue-600 hover:text-white rounded-xl text-xs font-bold transition-all border border-blue-500/20"
            >
                💧 Add Glass
            </button>
        </MotionDiv>
    )
}
