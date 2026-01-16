import React from 'react'

interface SessionSummaryProps {
    onHome: () => void
    onShare?: () => void
}

export function SessionSummary({ onHome, onShare }: SessionSummaryProps) {
    return (
        <div className="min-h-screen bg-stone-900 text-white flex flex-col relative overflow-hidden animate-in fade-in duration-700">

            {/* Background FX */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-orange-500/20 via-stone-900/50 to-stone-900 pointer-events-none" />
            <div className="absolute top-[-20%] left-[-20%] w-[140%] h-[140%] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none" />

            <div className="flex-1 flex flex-col items-center justify-center p-8 relative z-10 text-center">

                <div className="w-24 h-24 bg-orange-500 rounded-full flex items-center justify-center mb-8 shadow-[0_0_60px_-10px_rgba(249,115,22,0.5)] animate-in zoom-in duration-500 delay-200">
                    <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                </div>

                <h1 className="text-4xl md:text-5xl font-bold font-heading mb-2 bg-gradient-to-br from-white to-stone-400 bg-clip-text text-transparent">Session Complete</h1>
                <p className="text-stone-400 font-medium mb-12">Great work, Eddie! You crushed it.</p>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4 w-full max-w-sm mb-12">
                    <div className="bg-white/5 border border-white/10 p-5 rounded-2xl backdrop-blur-sm">
                        <p className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-1">Duration</p>
                        <p className="text-2xl font-bold font-mono">1h 12m</p>
                    </div>
                    <div className="bg-white/5 border border-white/10 p-5 rounded-2xl backdrop-blur-sm">
                        <p className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-1">Volume</p>
                        <p className="text-2xl font-bold font-mono">12,450 <span className="text-sm text-stone-500">lbs</span></p>
                    </div>
                    <div className="bg-white/5 border border-white/10 p-5 rounded-2xl backdrop-blur-sm">
                        <p className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-1">Sets</p>
                        <p className="text-2xl font-bold font-mono">24</p>
                    </div>
                    <div className="bg-white/5 border border-white/10 p-5 rounded-2xl backdrop-blur-sm">
                        <p className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-1">Intensity</p>
                        <p className="text-2xl font-bold font-mono text-orange-500">High</p>
                    </div>
                </div>

                {/* Records */}
                <div className="w-full max-w-sm bg-gradient-to-r from-orange-500/10 to-rose-500/10 border border-orange-500/20 rounded-2xl p-4 flex items-center gap-4 mb-8">
                    <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center text-xl">
                        🏆
                    </div>
                    <div className="text-left">
                        <p className="text-xs font-bold text-orange-400 uppercase tracking-wider">New Record</p>
                        <p className="font-bold">Bench Press: 225 lbs x 5</p>
                    </div>
                </div>

            </div>

            <div className="p-8 w-full max-w-md mx-auto space-y-3 relative z-10">
                <button
                    onClick={onHome}
                    className="w-full py-4 bg-orange-500 hover:bg-orange-600 text-white rounded-2xl font-bold text-lg shadow-xl shadow-orange-500/20 transition-all hover:scale-[1.02]"
                >
                    Done
                </button>
                <button
                    onClick={onShare}
                    className="w-full py-4 bg-stone-800 hover:bg-stone-700 text-white rounded-2xl font-bold text-sm transition-colors"
                >
                    Share Summary
                </button>
            </div>
        </div>
    )
}
