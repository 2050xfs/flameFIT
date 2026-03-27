'use client';

import { useState, useEffect, useRef } from 'react';
import { Send, Trash, Loader2, MessageSquare, Plus, Clock } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

type Message = {
    role: 'user' | 'assistant';
    content: string;
};

type Session = {
    id: string;
    title: string;
    updated_at: string;
};

export default function ChatPage() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [sessionId, setSessionId] = useState<string | null>(null);
    const [sessions, setSessions] = useState<Session[]>([]);
    const [loadingSessions, setLoadingSessions] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const bottomRef = useRef<HTMLDivElement>(null);
    const supabase = createClient();

    const loadSessions = async () => {
        if (!supabase) return;
        setLoadingSessions(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) { setLoadingSessions(false); return; }

        const { data } = await supabase
            .from('chat_sessions')
            .select('id, title, updated_at')
            .eq('user_id', user.id)
            .order('updated_at', { ascending: false })
            .limit(20);

        setSessions(data || []);
        setLoadingSessions(false);
    };

    useEffect(() => { loadSessions(); }, []);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isLoading]);

    const loadSession = async (sid: string) => {
        if (!supabase) return;
        setSessionId(sid);
        setSidebarOpen(false);
        setMessages([]);

        const { data } = await supabase
            .from('chat_messages')
            .select('role, content')
            .eq('session_id', sid)
            .order('created_at', { ascending: true });

        setMessages((data || []).map((m: any) => ({ role: m.role, content: m.content })));
    };

    const startNewSession = () => {
        setSessionId(null);
        setMessages([]);
        setSidebarOpen(false);
    };

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMsg: Message = { role: 'user', content: input };
        const newMessages = [...messages, userMsg];
        setMessages(newMessages);
        setInput('');
        setIsLoading(true);

        try {
            const res = await fetch('/api/ai/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: newMessages, sessionId }),
            });

            if (res.status === 429) {
                const { resetIn } = await res.json();
                setMessages(prev => [...prev, {
                    role: 'assistant',
                    content: `Rate limit reached. Please wait ${resetIn}s before sending another message.`,
                }]);
                return;
            }

            const data = await res.json();
            if (data.error) throw new Error(data.error);

            setMessages(prev => [...prev, { role: 'assistant', content: data.content }]);

            if (data.sessionId && !sessionId) {
                setSessionId(data.sessionId);
                loadSessions();
            }
        } catch {
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: 'Something went wrong. Please try again.',
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const formatRelative = (iso: string) => {
        const diff = (Date.now() - new Date(iso).getTime()) / 1000;
        if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
        if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
        return `${Math.floor(diff / 86400)}d ago`;
    };

    return (
        <div className="flex h-[calc(100vh-80px)] relative">
            {sidebarOpen && (
                <div className="fixed inset-0 bg-black/40 z-20 lg:hidden" onClick={() => setSidebarOpen(false)} />
            )}

            {/* Session Sidebar */}
            <aside className={`
                fixed lg:relative z-30 lg:z-auto top-0 left-0 h-full w-72
                bg-white dark:bg-stone-900 border-r border-stone-200 dark:border-stone-800
                flex flex-col transition-transform lg:transition-none lg:translate-x-0
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <div className="p-4 border-b border-stone-200 dark:border-stone-800">
                    <button
                        onClick={startNewSession}
                        className="w-full flex items-center justify-center gap-2 py-2.5 bg-orange-500 text-white rounded-xl text-sm font-bold hover:bg-orange-600 transition-colors"
                    >
                        <Plus className="w-4 h-4" /> New Chat
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto p-2 space-y-1">
                    {loadingSessions ? (
                        <div className="flex justify-center py-8">
                            <Loader2 className="w-5 h-5 animate-spin text-stone-400" />
                        </div>
                    ) : sessions.length === 0 ? (
                        <p className="text-xs text-stone-400 text-center py-8">No conversations yet</p>
                    ) : sessions.map(s => (
                        <button
                            key={s.id}
                            onClick={() => loadSession(s.id)}
                            className={`w-full text-left px-3 py-2.5 rounded-xl transition-colors ${
                                sessionId === s.id
                                    ? 'bg-orange-50 dark:bg-orange-950'
                                    : 'hover:bg-stone-100 dark:hover:bg-stone-800'
                            }`}
                        >
                            <div className="flex items-start gap-2">
                                <MessageSquare className={`w-4 h-4 mt-0.5 shrink-0 ${sessionId === s.id ? 'text-orange-500' : 'text-stone-400'}`} />
                                <div className="min-w-0">
                                    <p className="text-xs font-medium text-stone-800 dark:text-stone-200 truncate">{s.title}</p>
                                    <p className="text-[10px] text-stone-400 flex items-center gap-1 mt-0.5">
                                        <Clock className="w-2.5 h-2.5" />
                                        {formatRelative(s.updated_at)}
                                    </p>
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            </aside>

            {/* Main */}
            <div className="flex-1 flex flex-col min-w-0">
                <div className="flex items-center justify-between px-4 py-3 border-b border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-950">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="lg:hidden p-2 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800"
                        >
                            <MessageSquare className="w-5 h-5 text-stone-500" />
                        </button>
                        <div>
                            <h1 className="text-lg font-bold font-heading text-stone-900 dark:text-white">Spark AI</h1>
                            <p className="text-xs text-stone-400 hidden sm:block">Your high-performance coach</p>
                        </div>
                    </div>
                    <button onClick={startNewSession} className="p-2 text-stone-400 hover:text-stone-600 transition-colors" title="New Chat">
                        <Trash className="w-4 h-4" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
                    {messages.length === 0 && (
                        <div className="text-center text-stone-400 mt-16 space-y-4">
                            <div className="w-16 h-16 bg-orange-500/10 rounded-2xl flex items-center justify-center mx-auto">
                                <MessageSquare className="w-8 h-8 text-orange-500" />
                            </div>
                            <p className="font-bold text-stone-600 dark:text-stone-300">Ask Spark anything</p>
                            <div className="flex flex-wrap gap-2 justify-center max-w-sm mx-auto">
                                {["What are my macros today?", "Build me a leg workout", "How's my recovery looking?"].map(s => (
                                    <button key={s} onClick={() => setInput(s)} className="text-xs px-3 py-1.5 bg-stone-100 dark:bg-stone-800 rounded-full hover:bg-orange-50 hover:text-orange-600 transition-colors">
                                        {s}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                    {messages.map((m, i) => (
                        <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm whitespace-pre-wrap ${
                                m.role === 'user'
                                    ? 'bg-orange-500 text-white rounded-br-sm'
                                    : 'bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-100 rounded-bl-sm'
                            }`}>
                                {m.content}
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex justify-start">
                            <div className="bg-stone-100 dark:bg-stone-800 rounded-2xl px-4 py-3 rounded-bl-sm flex items-center gap-2 text-sm text-stone-500">
                                <Loader2 className="w-4 h-4 animate-spin" />Spark is thinking...
                            </div>
                        </div>
                    )}
                    <div ref={bottomRef} />
                </div>

                <div className="px-4 py-4 border-t border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-950">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
                            placeholder="Message Spark..."
                            className="flex-1 bg-stone-100 dark:bg-stone-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 dark:text-white"
                            disabled={isLoading}
                        />
                        <button
                            onClick={handleSend}
                            disabled={isLoading || !input.trim()}
                            className="bg-orange-500 text-white p-3 rounded-xl hover:bg-orange-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        >
                            <Send className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
