
import React from 'react';
import { getProProgramById } from '@/lib/api/programs';
import { ProProgramDetail } from '@/components/workouts/pro/ProProgramDetail';
import { notFound } from 'next/navigation';

interface PageProps {
    params: {
        id: string;
    };
}

export default async function ProgramDetailPage({ params }: PageProps) {
    const { id } = await params;
    const program = await getProProgramById(id);

    if (!program) {
        notFound();
    }

    return <ProProgramDetail program={program} />;
}
