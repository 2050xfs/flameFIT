
"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { DetailedProProgram, getProPrograms } from '@/lib/api/programs';
import { motion } from 'framer-motion';
import { Star, ChevronRight, Lock, Crown } from 'lucide-react';
import Image from 'next/image';

export function ProProgramList() {
    const [programs, setPrograms] = useState<DetailedProProgram[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            const data = await getProPrograms();
            setPrograms(data);
            setLoading(false);
        }
        load();
    }, []);

    if (loading) {
        return <div className="p-8 text-center text-stone-500 animate-pulse">Loading Premium Content...</div>;
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Gallery Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {programs.map((program) => (
                    <Link
                        key={program.id}
                        href={`/workouts/pro/${program.id}`}
                        className="group relative block aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl transition-transform hover:scale-[1.02]"
                    >
                        {/* Background Image */}
                        <div className="absolute inset-0">
                            <Image
                                src={program.thumbnailUrl || '/placeholder-program.jpg'}
                                alt={program.title}
                                fill
                                className="object-cover group-hover:scale-110 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/50 to-transparent" />
                        </div>

                        {/* Content Overlay */}
                        <div className="absolute inset-0 p-6 flex flex-col justify-end">
                            <div className="flex justify-between items-end">
                                <div>
                                    <div className="flex gap-2 mb-2">
                                        <div className="bg-orange-500 text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider flex items-center gap-1">
                                            <Crown className="w-3 h-3 fill-current" />
                                            PRO
                                        </div>
                                        <div className="bg-white/10 backdrop-blur-md text-white/80 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">
                                            {program.durationWeeks} Weeks
                                        </div>
                                    </div>

                                    <h3 className="text-3xl font-bold font-heading text-white mb-1 leading-none shadow-black/50 drop-shadow-lg">
                                        {program.title}
                                    </h3>
                                    <p className="text-sm text-stone-300 font-medium flex items-center gap-2">
                                        By {program.author.name}
                                    </p>
                                </div>

                                <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white transform translate-x-10 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
                                    <ChevronRight className="w-6 h-6" />
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
