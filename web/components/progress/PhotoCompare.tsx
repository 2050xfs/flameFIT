import React, { useState } from 'react'

interface PhotoCompareProps {
    onBack: () => void
}

export function PhotoCompare({ onBack }: PhotoCompareProps) {
    const [sliderVal, setSliderVal] = useState(50)

    return (
        <div className="min-h-screen bg-black text-white flex flex-col animate-in fade-in zoom-in duration-300 fixed inset-0 z-50">

            {/* Header */}
            <div className="flex items-center justify-between p-4 z-20">
                <button onClick={onBack} className="p-2 bg-white/10 rounded-full hover:bg-white/20">✕</button>
                <span className="font-bold">Comparison Mode</span>
                <div className="w-8" />
            </div>

            {/* Comparison Viewer */}
            <div className="flex-1 relative overflow-hidden my-4 mx-4 rounded-3xl select-none touch-none">

                {/* After Photo (Base) */}
                <div className="absolute inset-0 bg-stone-400 bg-[url('https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center">
                    <div className="absolute bottom-6 right-6 px-3 py-1 bg-black/50 backdrop-blur rounded text-xs font-bold">Today</div>
                </div>

                {/* Before Photo (Clipped) */}
                <div
                    className="absolute inset-0 bg-stone-600 bg-[url('https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center border-r-2 border-white shadow-[0_0_20px_rgba(0,0,0,0.5)]"
                    style={{ width: `${sliderVal}%` }}
                >
                    <div className="absolute bottom-6 left-6 px-3 py-1 bg-black/50 backdrop-blur rounded text-xs font-bold">Jan 1st</div>
                </div>

                {/* Slider Handle */}
                <div
                    className="absolute top-0 bottom-0 w-10 -ml-5 cursor-ew-resize flex items-center justify-center group focus:outline-none"
                    style={{ left: `${sliderVal}%` }}
                    onTouchMove={(e) => {
                        const rect = e.currentTarget.parentElement?.getBoundingClientRect()
                        if (rect) {
                            const x = e.touches[0].clientX - rect.left
                            setSliderVal(Math.max(0, Math.min(100, (x / rect.width) * 100)))
                        }
                    }}
                    onMouseMove={(e) => {
                        if (e.buttons === 1) { // Only drag when mouse is pressed
                            const rect = e.currentTarget.parentElement?.getBoundingClientRect()
                            if (rect) {
                                const x = e.clientX - rect.left
                                setSliderVal(Math.max(0, Math.min(100, (x / rect.width) * 100)))
                            }
                        }
                    }}
                >
                    <div className="w-10 h-10 rounded-full bg-white shadow-xl flex items-center justify-center text-stone-900 pointer-events-none">
                        ↔
                    </div>
                </div>

            </div>

            <div className="p-8 text-center text-stone-500 text-sm">
                Drag slider to compare your progress
            </div>
        </div>
    )
}
