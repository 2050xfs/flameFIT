'use client'

import { useState } from 'react'
import { useChat } from '@/lib/hooks/useChat'
import { Send, Trash, Loader2 } from 'lucide-react'

type Message = {
    role: 'user' | 'assistant'
    content: string
}

export default function ChatPage() {
    const [messages, setMessages] = useState<Message[]>([])
    const [input, setInput] = useState('')
    const { sendMessage, isLoading, clearSession } = useChat()

    const handleSend = () => {
        if (!input.trim()) return

        const userMsg = { role: 'user' as const, content: input }
        setMessages(prev => [...prev, userMsg])
        setInput('')

        sendMessage(input, {
            onSuccess: (data) => {
                setMessages(prev => [...prev, { role: 'assistant', content: data.response }])
            },
            onError: () => {
                // Remove user message or show error
                alert('Failed to send message')
            }
        })
    }

    const handleClear = () => {
        clearSession()
        setMessages([])
    }

    return (
        <div className="flex flex-col h-[calc(100vh-100px)] max-w-2xl mx-auto p-4">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold font-heading text-neutral-900">FlameFit Chat</h1>
                <button
                    onClick={handleClear}
                    className="p-2 text-neutral-500 hover:text-red-500 transition-colors"
                    title="New Chat"
                >
                    <Trash className="w-5 h-5" />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 mb-4 p-4 bg-white/50 rounded-2xl border border-white/20 shadow-sm">
                {messages.length === 0 && (
                    <div className="text-center text-neutral-400 mt-20">
                        <p>Ask me about your workouts or nutrition!</p>
                        <p className="text-sm mt-2">"What are my macros for today?"</p>
                    </div>
                )}
                {messages.map((m, i) => (
                    <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${m.role === 'user'
                                ? 'bg-primary-500 text-white rounded-br-sm'
                                : 'bg-neutral-100 text-neutral-800 rounded-bl-sm'
                            }`}>
                            {m.content}
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex justify-start">
                        <div className="bg-neutral-100 rounded-2xl px-4 py-3 rounded-bl-sm flex items-center">
                            <Loader2 className="w-4 h-4 animate-spin mr-2" />
                            Thinking...
                        </div>
                    </div>
                )}
            </div>

            <div className="flex gap-2">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Type a message..."
                    className="flex-1 bg-white border border-neutral-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                    disabled={isLoading}
                />
                <button
                    onClick={handleSend}
                    disabled={isLoading || !input.trim()}
                    className="bg-primary-500 text-white p-3 rounded-xl hover:bg-primary-600 disabled:opacity-50 transition-colors"
                >
                    <Send className="w-5 h-5" />
                </button>
            </div>
        </div>
    )
}
