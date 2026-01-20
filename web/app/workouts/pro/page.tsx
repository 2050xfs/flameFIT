
import React from 'react';
import { ProProgramList } from '@/components/workouts/pro/ProProgramList';
import { Crown } from 'lucide-react';

export default function ProProgramsPage() {
    return (
        <div className="min-h-screen bg-stone-950 pb-20">
            <div className="p-6 md:p-8 space-y-8 max-w-5xl mx-auto">
                {/* Header */}
                <div className="space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 text-orange-500 text-xs font-bold uppercase tracking-wider">
                        <Crown className="w-3 h-3 fill-current" />
                        Flame Fit Premium
                    </div>
                    <div>
                        <h1 className="text-4xl md:text-5xl font-bold font-heading text-white">Signature Series</h1>
                        <p className="text-stone-400 mt-2 max-w-xl text-lg">
                            World-class programs designed by elite athletes. Unlock your ultimate potential with these complete blueprints.
                        </p>
                    </div>
                </div>

                <ProProgramList />
            </div>
        </div>
    );
}
