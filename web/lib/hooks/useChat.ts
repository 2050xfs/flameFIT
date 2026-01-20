'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'

export function useChat() {
    const [sessionId, setSessionId] = useState<string | null>(null)
    const queryClient = useQueryClient()

    const { mutate: sendMessage, isPending: isLoading } = useMutation({
        mutationFn: async (message: string) => {
            const res = await fetch('/api/chat', {
                method: 'POST',
                body: JSON.stringify({ message, sessionId }),
            })
            if (!res.ok) throw new Error('Failed to send message')
            return res.json()
        },
        onSuccess: (data) => {
            if (data.sessionId && !sessionId) {
                setSessionId(data.sessionId)
            }
            // Invalidate/Refetch messages if we had a query for them
            // For now, we rely on the component to update local state or re-fetch
        }
    })

    const clearSession = () => {
        setSessionId(null)
        // Optionally clear UI state in component
    }

    return {
        sessionId,
        sendMessage,
        isLoading,
        clearSession
    }
}
