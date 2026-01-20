import type { DashboardProps } from '@/lib/types'
import { MotionDiv, scaleIn } from '@/components/ui/motion'

interface ReadinessCardProps {
    readiness: DashboardProps['readiness']
}

export function ReadinessCard({ readiness }: ReadinessCardProps) {
    return (
        <MotionDiv variants={scaleIn} className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <div className="w-32 h-32 rounded-full bg-orange-500 blur-2xl"></div>
            </div>

            <div className="flex flex-col items-center justify-center py-4">
                {/* Readiness Ring */}
                <div className="relative w-40 h-40">
                    <svg className="w-full h-full transform -rotate-90">
                        {/* Background Ring */}
                        <circle cx="80" cy="80" r="70" fill="none" stroke="currentColor" strokeWidth="12" className="text-stone-100 dark:text-stone-800" />
                        {/* Progress Ring */}
                        <circle
                            cx="80"
                            cy="80"
                            r="70"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="12"
                            className="text-orange-500"
                            strokeDasharray={2 * Math.PI * 70}
                            strokeDashoffset={2 * Math.PI * 70 * (1 - readiness.score / 100)}
                            strokeLinecap="round"
                        />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-4xl font-bold font-heading text-stone-900 dark:text-white">{readiness.score}</span>
                        <span className="text-xs font-bold uppercase text-stone-400">Readiness</span>
                    </div>
                </div>

                <div className="mt-4 text-center">
                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-orange-100 dark:bg-orange-500/20 text-orange-700 dark:text-orange-300 text-xs font-bold uppercase mb-2">
                        {readiness.status}
                    </div>
                    <p className="text-sm text-stone-600 dark:text-stone-400 max-w-[200px] leading-relaxed mx-auto">{readiness.message}</p>
                </div>
            </div>
        </MotionDiv>
    )
}
