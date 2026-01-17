'use client'

import { createClient } from '@/lib/supabase/client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'

export function LoginClient() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [mode, setMode] = useState<'signin' | 'signup'>('signin')
    const router = useRouter()
    const supabase = createClient()

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError(null)

        if (!supabase) {
            setError('Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to continue.')
            setIsLoading(false)
            return
        }

        if (mode === 'signup') {
            const { error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    emailRedirectTo: `${location.origin}/auth/callback`,
                },
            })
            if (error) setError(error.message)
            else setError('Check your email for the confirmation link.')
        } else {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            })
            if (error) setError(error.message)
            else router.refresh()
        }
        setIsLoading(false)
    }

    const handleOAuth = async (provider: 'google' | 'github') => {
        if (!supabase) {
            setError('Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to continue.')
            return
        }

        setIsLoading(true)
        await supabase.auth.signInWithOAuth({
            provider,
            options: {
                redirectTo: `${location.origin}/auth/callback`,
            },
        })
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-stone-50 dark:bg-stone-950 p-4">
            <div className="w-full max-w-md bg-white dark:bg-stone-900 rounded-3xl shadow-xl overflow-hidden border border-stone-100 dark:border-stone-800 animate-in fade-in zoom-in duration-300">

                {/* Header */}
                <div className="bg-gradient-to-br from-orange-500 to-rose-500 p-8 text-white text-center">
                    <h1 className="text-3xl font-bold font-heading mb-2">flameFit</h1>
                    <p className="opacity-90 text-sm">Your AI-Powered Pitness Companion</p>
                </div>

                {/* content */}
                <div className="p-8">
                    <div className="flex gap-2 mb-8 bg-stone-100 dark:bg-stone-800 p-1 rounded-xl">
                        <button
                            onClick={() => setMode('signin')}
                            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${mode === 'signin' ? 'bg-white dark:bg-stone-700 shadow text-stone-900 dark:text-white' : 'text-stone-500'}`}
                        >
                            Sign In
                        </button>
                        <button
                            onClick={() => setMode('signup')}
                            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${mode === 'signup' ? 'bg-white dark:bg-stone-700 shadow text-stone-900 dark:text-white' : 'text-stone-500'}`}
                        >
                            Create Account
                        </button>
                    </div>

                    <form onSubmit={handleAuth} className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-stone-500 uppercase mb-1">Email</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all font-medium"
                                placeholder="you@example.com"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-stone-500 uppercase mb-1">Password</label>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all font-medium"
                                placeholder="••••••••"
                            />
                        </div>

                        {error && (
                            <div className="p-3 bg-rose-50 dark:bg-rose-900/20 text-rose-500 text-sm font-bold rounded-xl flex items-center gap-2">
                                ⚠️ {error}
                            </div>
                        )}

                        <button
                            disabled={isLoading}
                            className="w-full py-4 bg-stone-900 dark:bg-white text-white dark:text-stone-900 rounded-xl font-bold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                            {mode === 'signin' ? 'Sign In' : 'Sign Up'}
                        </button>
                    </form>

                    <div className="mt-8">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-stone-200 dark:border-stone-800" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-white dark:bg-stone-900 px-2 text-stone-500">Or continue with</span>
                            </div>
                        </div>

                        <div className="mt-6 grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={() => handleOAuth('github')}
                                className="flex items-center justify-center gap-2 px-4 py-3 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl font-bold text-sm hover:bg-stone-100 dark:hover:bg-stone-700 transition-colors"
                            >
                                GH
                                <span className="sr-only">GitHub</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => handleOAuth('google')}
                                className="flex items-center justify-center gap-2 px-4 py-3 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl font-bold text-sm hover:bg-stone-100 dark:hover:bg-stone-700 transition-colors"
                            >
                                G
                                <span className="sr-only">Google</span>
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}
