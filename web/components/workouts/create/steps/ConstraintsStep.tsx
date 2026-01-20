
import React from 'react';
import { SparkConfig } from '@/lib/types';
import { Clock, Dumbbell, Zap, ChevronLeft } from 'lucide-react';
import { Slider } from '@/components/ui/slider';

interface ConstraintsStepProps {
    config: SparkConfig;
    updateConfig: (updates: Partial<SparkConfig>) => void;
    onGenerate: () => void;
    onBack: () => void;
}

export function ConstraintsStep({ config, updateConfig, onGenerate, onBack }: ConstraintsStepProps) {
    const equipmentOptions = [
        { id: 'full-gym', label: 'Full Gym', desc: 'Barbells, cables, machine' },
        { id: 'dumbbell-only', label: 'Dumbbell Only', desc: 'Minimal equipment' },
        { id: 'home-gym', label: 'Home Gym', desc: 'Rack & Bench' },
        { id: 'bodyweight', label: 'Bodyweight', desc: 'No equipment' },
    ];

    const intensities = [
        { id: 'low', label: 'Low', color: 'bg-green-500' },
        { id: 'moderate', label: 'Moderate', color: 'bg-orange-500' },
        { id: 'high', label: 'High', color: 'bg-red-500' },
    ];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="space-y-2">
                <h2 className="text-3xl font-bold font-heading">Set Constraints</h2>
                <p className="text-stone-400">Tailor the session to your environment and energy.</p>
            </div>

            {/* Time Slider */}
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <h3 className="font-bold flex items-center gap-2">
                        <Clock className="w-5 h-5 text-orange-500" />
                        Time Available
                    </h3>
                    <span className="text-xl font-bold font-heading">{config.duration} min</span>
                </div>
                <Slider
                    defaultValue={[config.duration]}
                    min={15}
                    max={90}
                    step={5}
                    onValueChange={(val) => updateConfig({ duration: val[0] })}
                />
                <div className="flex justify-between text-xs text-stone-500">
                    <span>15m (Express)</span>
                    <span>90m (Marathon)</span>
                </div>
            </div>

            {/* Equipment */}
            <div className="space-y-4">
                <h3 className="font-bold flex items-center gap-2">
                    <Dumbbell className="w-5 h-5 text-orange-500" />
                    Equipment
                </h3>
                <div className="grid grid-cols-2 gap-3">
                    {equipmentOptions.map((eq) => (
                        <button
                            key={eq.id}
                            onClick={() => updateConfig({ equipment: eq.id as any })}
                            className={`p-3 rounded-xl border text-left transition-all ${config.equipment === eq.id
                                ? 'bg-orange-500/10 border-orange-500 text-orange-500'
                                : 'bg-stone-900 border-stone-800 text-stone-400 hover:border-stone-700'
                                }`}
                        >
                            <div className="font-bold text-sm">{eq.label}</div>
                            <div className="text-[10px] opacity-70">{eq.desc}</div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Intensity */}
            <div className="space-y-4">
                <h3 className="font-bold flex items-center gap-2">
                    <Zap className="w-5 h-5 text-orange-500" />
                    Intensity
                </h3>
                <div className="flex bg-stone-900 p-1 rounded-xl">
                    {intensities.map((int) => (
                        <button
                            key={int.id}
                            onClick={() => updateConfig({ intensity: int.id as any })}
                            className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${config.intensity === int.id
                                ? `${int.color} text-white shadow-lg`
                                : 'text-stone-500 hover:text-stone-300'
                                }`}
                        >
                            {int.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex gap-4 mt-8">
                <button
                    onClick={onBack}
                    className="flex-1 py-4 bg-stone-800 hover:bg-stone-700 text-white font-bold rounded-xl transition-colors"
                >
                    Back
                </button>
                <button
                    onClick={onGenerate}
                    className="flex-[2] py-4 bg-orange-500 hover:bg-orange-600 text-stone-950 font-bold rounded-xl transition-colors shadow-lg shadow-orange-500/20"
                >
                    Generate Spark
                </button>
            </div>
        </div>
    );
}
