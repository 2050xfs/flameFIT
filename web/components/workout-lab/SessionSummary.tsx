"use client";

import React from 'react'

interface SessionSummaryProps {
    onHome: () => void
    onShare?: () => void
    duration?: number
    volume?: number
    sets?: number
}

export function SessionSummary({ onHome, onShare, duration = 0, volume = 0, sets = 0 }: SessionSummaryProps) {
    return (
        <div className="min-h-[80vh] bg-stone-900 text-white flex flex-col relative overflow-hidden animate-in fade-in duration-700 rounded-3xl">

            {/* Background FX */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-orange-500/10 via-stone-900/50 to-stone-900 pointer-events-none" />

            <div className="flex-1 flex flex-col items-center justify-center p-8 relative z-10 text-center mt-12">

                <div className="w-24 h-24 bg-orange-500 rounded-full flex items-center justify-center mb-8 shadow-[0_0_60px_-10px_rgba(249,115,22,0.5)] animate-in zoom-in duration-500 delay-200">
                    <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                </div>

                <h1 className="text-4xl md:text-5xl font-bold font-heading mb-2 bg-gradient-to-br from-white to-stone-400 bg-clip-text text-transparent">Session Complete</h1>
                <p className="text-stone-400 font-medium mb-12">Great work! You crushed it.</p>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4 w-full max-w-sm mb-12">
                    <div className="bg-white/5 border border-white/10 p-5 rounded-2xl backdrop-blur-sm">
                        <p className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-1">Duration</p>
                        <p className="text-2xl font-bold font-mono">{duration}m</p>
                    </div>
                    <div className="bg-white/5 border border-white/10 p-5 rounded-2xl backdrop-blur-sm">
                        <p className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-1">Volume</p>
                        <p className="text-2xl font-bold font-mono">{volume} <span className="text-sm text-stone-500">lbs</span></p>
                    </div>
                    <div className="bg-white/5 border border-white/10 p-5 rounded-2xl backdrop-blur-sm">
                        <p className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-1">Sets</p>
                        <p className="text-2xl font-bold font-mono">{sets}</p>
                    </div>
                    <div className="bg-white/5 border border-white/10 p-5 rounded-2xl backdrop-blur-sm">
                        <p className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-1">Intensity</p>
                        <p className="text-2xl font-bold font-mono text-orange-500">High</p>
                    </div>
                </div>

                {/* Records (Mock for now) */}
                <div className="w-full max-w-sm bg-gradient-to-r from-orange-500/10 to-rose-500/10 border border-orange-500/20 rounded-2xl p-4 flex items-center gap-4 mb-8">
                    <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center text-xl">
                        🏆
                    </div>
                    <div className="text-left">
                        <p className="text-xs font-bold text-orange-400 uppercase tracking-wider">Session Achievement</p>
                        <p className="font-bold text-sm">Consistency is Key: Weekly Goal Met!</p>
                    </div>
                </div>

            </div>

            <div className="p-8 w-full max-w-md mx-auto space-y-3 relative z-10">
                <button
                    onClick={onHome}
                    className="w-full py-4 bg-orange-500 hover:bg-orange-600 text-white rounded-2xl font-bold text-lg shadow-xl shadow-orange-500/20 transition-all hover:scale-[1.02]"
                >
                    Return to Dashboard
                </button>
            </div>
        </div>
    )
}
