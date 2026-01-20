import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { calculateProfileCompletion } from '@/lib/api/spark';

export async function GET() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

    return NextResponse.json({
        profileCompletion: calculateProfileCompletion(profile),
        name: profile?.name
    });
}
