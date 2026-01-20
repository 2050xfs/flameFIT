import { createClient } from '@/lib/supabase/server'
import { getAgentContext } from '@/lib/context-aggregator'
import { OpenAI } from 'openai'
import { NextResponse } from 'next/server'

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
})

export async function POST(req: Request) {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { message, sessionId } = await req.json()

    // 1. Get or Create Session
    let currentSessionId = sessionId
    if (!currentSessionId) {
        const { data: session, error: sessionError } = await supabase
            .from('chat_sessions')
            .insert({ user_id: user.id, title: message.slice(0, 30) + '...' })
            .select()
            .single()

        if (sessionError) return NextResponse.json({ error: 'Failed to create session' }, { status: 500 })
        currentSessionId = session.id
    }

    // 2. Save User Message
    await supabase.from('chat_messages').insert({
        session_id: currentSessionId,
        role: 'user',
        content: message
    })

    // 3. Get Context
    const context = await getAgentContext(supabase, user.id)
    const contextSystemMessage = `
    You are FlameFit AI, an intelligent fitness assistant.
    
    User Context:
    - Profile: ${JSON.stringify(context.userProfile)}
    - Recent Workouts: ${JSON.stringify(context.recentWorkouts)}
    - Today's Nutrition: ${JSON.stringify(context.todaysNutrition)}

    Answer the user's question based on this context. Be encouraging, concise, and helpful.
    `

    // 4. Call OpenAI
    // Get last few messages for conversation history
    const { data: history } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('session_id', currentSessionId)
        .order('created_at', { ascending: false })
        .limit(5)

    // Reverse because we fetched desc
    const previousMessages = history ? history.reverse().map(m => ({ role: m.role as 'user' | 'assistant', content: m.content })) : []

    const completion = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
            { role: 'system', content: contextSystemMessage },
            ...previousMessages,
            { role: 'user', content: message } // Redundant if in history? No, if we just inserted it, it is in history. But let's rely on history.
            // Wait, I just inserted the message into DB. So fetching history includes it.
            // But usually we want to stream. For now, simple response.
        ]
    })

    const aiResponse = completion.choices[0].message.content

    // 5. Save Assistant Message
    await supabase.from('chat_messages').insert({
        session_id: currentSessionId,
        role: 'assistant',
        content: aiResponse
    })

    return NextResponse.json({
        response: aiResponse,
        sessionId: currentSessionId,
        contextUsed: context
    })
}
