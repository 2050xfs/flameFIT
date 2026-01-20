"use client";

import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Sparkles, User, Loader2 } from 'lucide-react';
import { ChatWidget } from '@/types/chat-widgets';
import { QuickLogWidgetComponent } from './widgets/QuickLogWidget';
import { WorkoutCarouselWidgetComponent } from './widgets/WorkoutCarouselWidget';
import { WorkoutDetailWidgetComponent } from './widgets/WorkoutDetailWidget';
import { SessionSchedulerWidgetComponent } from './widgets/SessionSchedulerWidget';
import { ProgressSnapshotWidgetComponent } from './widgets/ProgressSnapshotWidget';
import { BiometricWidgetComponent } from './widgets/BiometricWidget';
import { WorkoutBuilderWidgetComponent } from './widgets/WorkoutBuilderWidget';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
    widget?: ChatWidget;
}

export function SparkChat() {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState('');
    const [sessionId, setSessionId] = useState<string | null>(null);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            role: 'assistant',
            content: "Hello! I'm The Spark, your AI fitness companion. How can I help you with your training or nutrition today?",
            timestamp: new Date(),
        }
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const [profileCompletion, setProfileCompletion] = useState<number>(100);
    const scrollRef = useRef<HTMLDivElement>(null);

    const fetchStatus = async () => {
        try {
            const res = await fetch('/api/user/status');
            if (res.ok) {
                const data = await res.json();
                setProfileCompletion(data.profileCompletion);
            }
        } catch (e) {
            console.error("Failed to fetch user status", e);
        }
    };

    useEffect(() => {
        fetchStatus();
    }, []);

    const renderContent = (content: string) => {
        if (!content) return null;

        // Split by lines to handle block-level elements
        const lines = content.split('\n');

        return (
            <div className="space-y-3">
                {lines.map((line, lineIdx) => {
                    const trimmedLine = line.trim();
                    if (!trimmedLine) return <div key={lineIdx} className="h-2" />;

                    // 1. Headers (### Header)
                    if (trimmedLine.startsWith('### ')) {
                        return (
                            <h3 key={lineIdx} className="text-base font-black text-stone-900 dark:text-white uppercase tracking-tight mt-4 mb-2 flex items-center gap-2">
                                <div className="w-1 h-4 bg-orange-500 rounded-full" />
                                {renderInlines(trimmedLine.slice(4))}
                            </h3>
                        );
                    }

                    // 2. List Items (- Item)
                    if (trimmedLine.startsWith('- ')) {
                        return (
                            <div key={lineIdx} className="flex gap-3 pl-1 mb-1">
                                <div className="w-1.5 h-1.5 rounded-full bg-orange-500/50 mt-1.5 flex-shrink-0" />
                                <p className="text-sm font-medium text-stone-600 dark:text-stone-300">
                                    {renderInlines(trimmedLine.slice(2))}
                                </p>
                            </div>
                        );
                    }

                    // 3. Numbered/Keyed points (e.g., "1. Point")
                    const match = trimmedLine.match(/^(\d+\.)\s+(.*)/);
                    if (match) {
                        return (
                            <div key={lineIdx} className="flex gap-3 pl-1 mb-1">
                                <span className="text-[10px] font-black text-orange-500 mt-0.5">{match[1]}</span>
                                <p className="text-sm font-medium text-stone-600 dark:text-stone-300">
                                    {renderInlines(match[2])}
                                </p>
                            </div>
                        );
                    }

                    // 4. Regular paragraph
                    return (
                        <p key={lineIdx} className="text-sm leading-relaxed text-stone-600 dark:text-stone-300">
                            {renderInlines(trimmedLine)}
                        </p>
                    );
                })}
            </div>
        );
    };

    const renderInlines = (text: string) => {
        // Handle bolding (**text**)
        const parts = text.split(/(\*\*.*?\*\*)/g);
        return parts.map((part, i) => {
            if (part.startsWith('**') && part.endsWith('**')) {
                return (
                    <strong key={i} className="font-black text-stone-900 dark:text-white underline decoration-orange-500/10 underline-offset-2">
                        {part.slice(2, -2)}
                    </strong>
                );
            }
            return part;
        });
    };

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: input,
            timestamp: new Date(),
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await fetch('/api/ai/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: [...messages, userMessage],
                    sessionId: sessionId // Send existing session ID if any
                }),
            });

            if (!response.ok) throw new Error('Failed to fetch AI response');

            const data = await response.json();

            // capture session ID for future turns
            if (data.sessionId && !sessionId) {
                setSessionId(data.sessionId);
            }

            if (data.profileCompletion !== undefined) {
                setProfileCompletion(data.profileCompletion);
            }

            const aiMessage: Message = {
                id: Date.now().toString(),
                role: 'assistant',
                content: data.content,
                widget: data.widget,
                timestamp: new Date(),
            };

            setMessages(prev => [...prev, aiMessage]);
        } catch (error) {
            console.error('Failed to send message:', error);
            const errorMessage: Message = {
                id: Date.now().toString(),
                role: 'assistant',
                content: "I'm having a bit of trouble connecting to my brain right now. Please try again in a moment!",
                timestamp: new Date(),
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSuggestionClick = (suggestion: string) => {
        setInput(suggestion);
    };

    const suggestions = profileCompletion < 100
        ? ["Complete my profile", "What's my status?", "Log a session"]
        : ["Analyze my day", "Log a high-protein meal", "Suggest a finisher", "Check recovery"];

    // Auto-submit suggestion
    useEffect(() => {
        if (input && suggestions.includes(input)) {
            const fakeEvent = { preventDefault: () => { } } as React.FormEvent;
            handleSendMessage(fakeEvent);
        }
    }, [input]);

    return (
        <>
            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 p-4 bg-orange-500 text-white rounded-full shadow-2xl hover:bg-orange-600 transition-all hover:scale-110 z-40 group"
            >
                <Sparkles className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                <span className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-stone-900 text-white text-xs font-bold py-2 px-3 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                    Chat with The Spark
                </span>
            </button>

            {/* Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 md:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Chat Panel */}
            <div className={`fixed inset-y-0 right-0 w-full sm:w-[450px] bg-white dark:bg-stone-900 shadow-2xl z-50 transform transition-transform duration-500 ease-out border-l border-stone-200 dark:border-stone-800 flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>

                {/* Header */}
                <div className="p-6 border-b border-stone-100 dark:border-stone-800 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/20">
                            <Sparkles className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold font-heading text-stone-900 dark:text-white leading-tight">The Spark</h2>
                            <div className="flex items-center gap-1.5">
                                <div className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
                                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Always Active</span>
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="p-2 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-xl transition-colors text-stone-400"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Messages Area */}
                <div
                    ref={scrollRef}
                    className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth"
                >
                    {profileCompletion < 100 && (
                        <div className="bg-orange-50 dark:bg-orange-950/20 rounded-2xl p-4 border border-orange-100 dark:border-orange-900/30 mb-2">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-xs font-bold text-orange-700 dark:text-orange-400 uppercase tracking-wider">Profile Protocol</span>
                                <span className="text-xs font-mono font-bold text-orange-600">{profileCompletion}% Complete</span>
                            </div>
                            <div className="w-full bg-orange-200 dark:bg-orange-900/50 h-1.5 rounded-full overflow-hidden">
                                <div
                                    className="bg-orange-500 h-full transition-all duration-1000"
                                    style={{ width: `${profileCompletion}%` }}
                                />
                            </div>
                            <p className="text-[10px] text-orange-600/70 mt-2 font-medium italic">
                                * Complete biometrics to unlock precision coaching.
                            </p>
                        </div>
                    )}

                    {messages.map((msg) => (
                        <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                                <div className={`w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center mt-1 shadow-sm ${msg.role === 'user' ? 'bg-stone-100 dark:bg-stone-800' : 'bg-orange-500 text-white'
                                    }`}>
                                    {msg.role === 'user' ? <User className="w-4 h-4 text-stone-500" /> : <Sparkles className="w-4 h-4" />}
                                </div>
                                <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${msg.role === 'user'
                                    ? 'bg-stone-900 text-white dark:bg-stone-800 dark:border dark:border-stone-700 rounded-tr-none'
                                    : 'bg-white dark:bg-stone-900 border border-stone-100 dark:border-stone-800 text-stone-600 dark:text-stone-300 rounded-tl-none'
                                    }`}>
                                    {renderContent(msg.content)}

                                    {/* Widget Rendering Logic */}
                                    {msg.widget && (
                                        <div className="mt-4">
                                            {msg.widget.type === 'quick_log' && <QuickLogWidgetComponent widget={msg.widget} />}
                                            {msg.widget.type === 'workout_carousel' && <WorkoutCarouselWidgetComponent widget={msg.widget} />}
                                            {msg.widget.type === 'workout_detail' && <WorkoutDetailWidgetComponent widget={msg.widget} />}
                                            {msg.widget.type === 'session_scheduler' && <SessionSchedulerWidgetComponent widget={msg.widget} />}
                                            {msg.widget.type === 'progress_snapshot' && <ProgressSnapshotWidgetComponent widget={msg.widget} />}
                                            {msg.widget.type === 'biometric_onboarding' && (
                                                <BiometricWidgetComponent
                                                    widget={msg.widget}
                                                    onComplete={() => {
                                                        // Optionally re-fetch user status or send a confirmation
                                                        fetchStatus();
                                                    }}
                                                />
                                            )}
                                            {msg.widget.type === 'workout_builder' && (
                                                <WorkoutBuilderWidgetComponent
                                                    widget={msg.widget}
                                                    onComplete={(data) => {
                                                        console.log("Workout Architecture Generated:", data);
                                                    }}
                                                />
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex justify-start">
                            <div className="flex gap-3 max-w-[85%]">
                                <div className="w-8 h-8 rounded-lg bg-orange-500 text-white flex items-center justify-center shadow-sm">
                                    <Sparkles className="w-4 h-4" />
                                </div>
                                <div className="p-4 rounded-2xl rounded-tl-none bg-stone-50 dark:bg-stone-800/50 flex items-center gap-2">
                                    <Loader2 className="w-4 h-4 text-stone-400 animate-spin" />
                                    <span className="text-xs font-medium text-stone-400">Spark is thinking...</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Input Area */}
                <div className="p-6 bg-white dark:bg-stone-900 border-t border-stone-100 dark:border-stone-800">
                    {/* Suggestions */}
                    <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar">
                        {suggestions.map((s) => (
                            <button
                                key={s}
                                onClick={() => handleSuggestionClick(s)}
                                className="whitespace-nowrap px-4 py-2 bg-stone-100 dark:bg-stone-800 hover:bg-orange-100 dark:hover:bg-orange-900/30 hover:text-orange-600 dark:hover:text-orange-400 text-stone-600 dark:text-stone-400 rounded-full text-xs font-bold transition-all border border-transparent hover:border-orange-500/20"
                            >
                                {s}
                            </button>
                        ))}
                    </div>

                    <form onSubmit={handleSendMessage} className="relative">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask Spark anything..."
                            className="w-full bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700 rounded-2xl py-4 pl-4 pr-16 text-sm text-stone-900 dark:text-white placeholder-stone-400 focus:outline-none focus:ring-2 ring-orange-500 transition-all"
                        />
                        <button
                            type="submit"
                            disabled={!input.trim() || isLoading}
                            className={`absolute right-2 top-2 bottom-2 w-12 flex items-center justify-center rounded-xl transition-all ${input.trim() && !isLoading
                                ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20'
                                : 'bg-stone-100 dark:bg-stone-800 text-stone-400'
                                }`}
                        >
                            <Send className="w-5 h-5" />
                        </button>
                    </form>
                    <p className="text-[10px] text-center text-stone-400 mt-4 uppercase tracking-widest font-bold opacity-50">
                        The Spark AI • V2 Powered
                    </p>
                </div>
            </div>
        </>
    );
}
