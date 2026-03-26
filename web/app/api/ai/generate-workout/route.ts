import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import OpenAI from 'openai';
import { SparkConfig, GeneratedWorkout, WorkoutExercise } from '@/lib/types';

const EQUIPMENT_MAP: Record<string, string> = {
    'full-gym': 'full commercial gym with barbells, cables, machines, and free weights',
    'dumbbell-only': 'dumbbells only',
    'bodyweight': 'bodyweight only — no equipment',
    'home-gym': 'home gym with dumbbells, a pull-up bar, and resistance bands',
};

const OBJECTIVE_MAP: Record<string, string> = {
    hypertrophy: 'muscle hypertrophy (3–4 sets of 8–12 reps, moderate load)',
    strength: 'maximal strength (4–6 sets of 1–5 reps, heavy load)',
    endurance: 'muscular endurance (2–4 sets of 15–25 reps, lighter load)',
    mobility: 'mobility and flexibility (dynamic stretching, holds, correctives)',
    'fat-loss': 'fat loss via metabolic conditioning (supersets, short rest, compound movements)',
};

export async function POST(req: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const apiKey = process.env.OPENAI_API_KEY;
        if (!apiKey) {
            return NextResponse.json({ error: 'OpenAI not configured' }, { status: 500 });
        }

        const config: SparkConfig = await req.json();

        // Pull user profile for context
        const { data: profile } = await supabase
            .from('profiles')
            .select('name, weight, height, goals')
            .eq('id', user.id)
            .single();

        const muscleTarget = config.muscles.length > 0
            ? `Target muscles: ${config.muscles.join(', ')}.`
            : 'Full body or the most appropriate muscle groups.';

        const profileContext = profile
            ? `User: ${profile.name || 'athlete'}, weight ~${profile.weight || 75}kg, height ~${profile.height || 175}cm.`
            : '';

        const prompt = `You are an elite strength & conditioning coach. Generate a complete workout protocol in JSON.

${profileContext}
Objective: ${OBJECTIVE_MAP[config.objective] || config.objective}
Duration: ${config.duration} minutes
Equipment: ${EQUIPMENT_MAP[config.equipment] || config.equipment}
${muscleTarget}
Intensity: ${config.intensity}

Return ONLY valid JSON matching this exact schema (no markdown, no explanation):
{
  "title": "Short memorable protocol name",
  "description": "2-3 sentences describing the protocol rationale",
  "exercises": [
    {
      "id": "ex-1",
      "exerciseId": "ex-1",
      "name": "Exercise Name",
      "sets": 4,
      "reps": "8-10",
      "notes": "optional cue"
    }
  ],
  "stats": {
    "volume": 15000,
    "intensity": 7.5,
    "calories": 380,
    "duration": ${config.duration}
  }
}

Include 5–8 exercises appropriate for the goal. Use real exercise names. Ensure sets × reps × estimated load gives a realistic volume in kg. Intensity is a CNS demand score 1–10.`;

        const openai = new OpenAI({ apiKey });

        const completion = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.8,
            max_tokens: 1200,
            response_format: { type: 'json_object' },
        });

        const raw = completion.choices[0]?.message?.content;
        if (!raw) {
            throw new Error('Empty response from OpenAI');
        }

        const parsed = JSON.parse(raw);

        // Ensure exercises have proper IDs
        const exercises: WorkoutExercise[] = (parsed.exercises || []).map((ex: any, i: number) => ({
            id: ex.id || `ex-${i + 1}`,
            exerciseId: ex.exerciseId || `ex-${i + 1}`,
            name: ex.name || 'Unknown',
            sets: ex.sets || 3,
            reps: ex.reps?.toString() || '10',
        }));

        const workout: GeneratedWorkout = {
            id: `spark-${Date.now()}`,
            title: parsed.title || 'AI Generated Protocol',
            description: parsed.description || '',
            exercises,
            stats: {
                volume: parsed.stats?.volume || 0,
                intensity: parsed.stats?.intensity || 7,
                calories: parsed.stats?.calories || 300,
                duration: config.duration,
            },
        };

        return NextResponse.json(workout);
    } catch (error: any) {
        console.error('Workout generation error:', error);
        return NextResponse.json({ error: error.message || 'Generation failed' }, { status: 500 });
    }
}
