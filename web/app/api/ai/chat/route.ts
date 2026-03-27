import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import OpenAI from 'openai';
import { getSparkContext, formatContextForPrompt } from '@/lib/api/spark';
import { searchWorkoutProtocols } from '@/lib/api/vector-store';
import { rateLimit } from '@/lib/utils/rate-limit';

// Per-user limits: 15 chat messages / minute, 60 / hour
const CHAT_RATE_LIMIT_PER_MIN = 15;
const CHAT_RATE_LIMIT_PER_HOUR = 60;

export async function POST(req: NextRequest) {
    try {
        const { messages, sessionId: incomingSessionId } = await req.json();
        const lastMessage = messages[messages.length - 1];

        // 1. Setup Clients
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // 2. Rate Limiting — checked before any expensive operations
        const [perMin, perHour] = await Promise.all([
            rateLimit(`chat:min:${user.id}`, CHAT_RATE_LIMIT_PER_MIN, 60),
            rateLimit(`chat:hour:${user.id}`, CHAT_RATE_LIMIT_PER_HOUR, 3600),
        ]);

        if (!perMin.allowed || !perHour.allowed) {
            const resetIn = !perMin.allowed ? perMin.resetIn : perHour.resetIn;
            return NextResponse.json(
                { error: 'Too many requests. Please slow down.', resetIn },
                { status: 429 }
            );
        }

        // 3. Session Management
        let sessionId = incomingSessionId;
        if (!sessionId) {
            const { data: newSession, error: sessionError } = await supabase
                .from('chat_sessions')
                .insert({
                    user_id: user.id,
                    title: lastMessage.content.slice(0, 50) + '...'
                })
                .select()
                .single();

            if (sessionError) throw sessionError;
            sessionId = newSession.id;
        }

        // 4. Persist User Message — fire-and-forget so Supabase latency never
        // blocks the response. Errors are logged but don't fail the request.
        supabase.from('chat_messages').insert({
            session_id: sessionId,
            role: 'user',
            content: lastMessage.content,
        }).then(({ error }) => {
            if (error) console.error('[chat] Failed to persist user message:', error.message);
        });

        // 5. Context & RAG (fail gracefully)
        const apiKey = process.env.OPENAI_API_KEY;
        const pineconeKey = process.env.PINECONE_API_KEY;
        let context = '';

        const sparkContextData = await getSparkContext(user.id);
        const sparkContextPrompt = formatContextForPrompt(sparkContextData);
        const completionPercentage = sparkContextData.profileCompletion;

        // Pinecone RAG — general knowledge base
        if (pineconeKey && apiKey) {
            try {
                const openai = new OpenAI({ apiKey });
                const embeddingResponse = await openai.embeddings.create({
                    model: 'text-embedding-3-small',
                    input: lastMessage.content
                });
                const queryVector = embeddingResponse.data[0].embedding;

                const inferenceResponse = await fetch(
                    'https://flamefit-knowledge-xlzivl1.svc.aped-4627-b74a.pinecone.io/query',
                    {
                        method: 'POST',
                        headers: {
                            'Api-Key': pineconeKey,
                            'Content-Type': 'application/json',
                            'X-Pinecone-API-Version': '2024-07'
                        },
                        body: JSON.stringify({
                            namespace: '',
                            topK: 3,
                            vector: queryVector,
                            includeMetadata: true
                        })
                    }
                );

                if (inferenceResponse.ok) {
                    const data = await inferenceResponse.json();
                    if (data.matches?.length) {
                        context = data.matches.map((m: any) => m.metadata?.text || '').join('\n');
                    }
                }
            } catch (e) {
                console.warn('[chat] Pinecone RAG failed, proceeding without context:', e);
            }
        }

        // OpenAI Vector Store — workout protocol queries
        const workoutKeywords = ['program', 'protocol', 'sadik', 'aj ellison', 'abs', 'legs', 'shoulders', 'workout plan', 'training'];
        const isWorkoutQuery = workoutKeywords.some(kw => lastMessage.content.toLowerCase().includes(kw));

        if (isWorkoutQuery && apiKey) {
            try {
                const vectorResults = await searchWorkoutProtocols(lastMessage.content, 3);
                if (vectorResults.length > 0) {
                    const vectorContext = vectorResults.map(r => r.content).join('\n\n');
                    context = context ? `${context}\n\n--- WORKOUT PROTOCOLS ---\n${vectorContext}` : vectorContext;
                }
            } catch (e) {
                console.warn('[chat] Vector Store failed, proceeding without workout context:', e);
            }
        }

        // 6. LLM Call
        const isProfileIncomplete = completionPercentage < 100;
        const systemPrompt = `
You are "Spark", a world-class High-Performance Guru and Biometrics Expert.
Your tone is razor-sharp, data-driven, and intensely professional. You don't just "chat"; you ARCHITECT human performance.
You translate complex physiological data into actionable, surgical strikes for the user's training and nutrition.

USER BIOMETRICS & HISTORY:
${sparkContextPrompt}
${isProfileIncomplete ? `\nCURRENT STATUS: Profile ${completionPercentage}% Complete. Priority: Gather missing biometrics (Name, Weight, Height, Goals) to unlock precision macro calculations.` : ''}

KNOWLEDGE BASE CONTEXT (Scientific Literature & Exercise Library):
${context}

CORE DIRECTIVES:
1. DATA INTEGRITY: Always cross-reference the user's recent workouts and macros. If they are lagging, call it out with a solution.
2. BIOMECHANICS & NEUROLOGY: Focus on motor unit recruitment, tempo, metabolic stress, and CNS recovery. Use terms like "hypertrophy window," "CNS fatigue," and "anabolic signaling."
3. PROACTIVITY: You are the driver. If the user hasn't logged a meal by 12pm, or missed a scheduled session, address it immediately.
4. COACHING AUTHORITY: You are their BOSS in the gym. Be encouraging but firm. If sets are being missed, demand an explanation or pivot the protocol.
5. CONTEXTUAL AWARENESS: Always look for trends. "I see a 10% drop in volume over the last 3 sessions. We need to check your sleep or increase caloric intake immediately."
6. KNOWLEDGE BASE: Treat the KNOWLEDGE BASE CONTEXT as gospel. Use it to provide technical details on form and science.
7. PROTOCOL ARCHITECTURE: You have the direct capability to ARCHITECT and SAVE custom workout protocols to the user's library. If they want to create, build, or save a workout, tell them you are initializing the "Protocol Architect" and use words like "build", "create", or "save" to trigger your internal interface.
8. FORMATTING CONSTRAINT: USE MARKDOWN BOLDING (e.g., **text**) for key terms, metrics, and technical instructions. This is essential for the UI to highlight critical data points.
`.trim();

        const openai = new OpenAI({ apiKey });
        const response = await openai.chat.completions.create({
            model: 'gpt-4o',
            messages: [
                { role: 'system', content: systemPrompt },
                ...messages.map((m: any) => ({ role: m.role, content: m.content }))
            ],
            temperature: 0.7,
        });

        const aiContent = response.choices[0].message.content || '';
        const totalTokens = response.usage?.total_tokens ?? 0;

        // 7. Widget Logic
        const lowerContent = lastMessage.content.toLowerCase();
        const lowerAiContent = aiContent.toLowerCase();

        const biometricKeywords = ['profile', 'weight', 'height', 'name', 'goal', 'biometric', 'stats', 'data'];
        const userWantsBiometrics = biometricKeywords.some(k => lowerContent.includes(k));
        const aiMentionsBiometrics = biometricKeywords.some(k => lowerAiContent.includes(k));

        let widget = null;
        if (isProfileIncomplete && (userWantsBiometrics || aiMentionsBiometrics)) {
            const missing = [];
            if (!sparkContextData.profile?.name) missing.push('name');
            if (!sparkContextData.profile?.weight) missing.push('weight');
            if (!sparkContextData.profile?.height) missing.push('height');
            if (!sparkContextData.profile?.goals || sparkContextData.profile?.goals.length === 0) missing.push('goals');

            widget = {
                type: 'biometric_onboarding',
                id: Date.now().toString(),
                title: 'Biometric Protocol',
                missingFields: missing
            };
        } else if (lowerAiContent.includes('workout') || lowerAiContent.includes('build') || lowerAiContent.includes('create') || lowerAiContent.includes('program') || lowerAiContent.includes('save')) {
            widget = { type: 'workout_builder', id: Date.now().toString(), title: 'Protocol Architect', step: 'goal' };
        } else if (lowerContent.includes('log')) {
            widget = { type: 'quick_log', id: Date.now().toString(), title: 'Quick Log', inputs: [{ name: 'activity', label: 'Details', type: 'text' }], submitLabel: 'Log' };
        }

        // 8. Persist Assistant Message — fire-and-forget
        supabase.from('chat_messages').insert({
            session_id: sessionId,
            role: 'assistant',
            content: aiContent,
            widget_data: widget,
        }).then(({ error }) => {
            if (error) console.error('[chat] Failed to persist assistant message:', error.message);
        });

        // 9. Log API usage — fire-and-forget, for spend observability
        if (totalTokens > 0) {
            const month = new Date().toISOString().slice(0, 7); // YYYY-MM
            supabase.rpc('increment_api_usage', {
                p_user_id: user.id,
                p_endpoint: 'chat',
                p_tokens: totalTokens,
                p_month: month,
            }).then(({ error }) => {
                if (error) console.warn('[chat] Usage tracking failed:', error.message);
            });
        }

        return NextResponse.json({
            role: 'assistant',
            content: aiContent,
            widget,
            sessionId,
            profileCompletion: completionPercentage
        });

    } catch (error) {
        console.error('[chat] Error:', error);
        return NextResponse.json({ error: 'Failed to process chat' }, { status: 500 });
    }
}
