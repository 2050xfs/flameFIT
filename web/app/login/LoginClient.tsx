'use client'

import { createClient } from '@/lib/supabase/client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Eye, EyeOff } from 'lucide-react'
import { ForgotPasswordModal } from '@/components/auth/ForgotPasswordModal'
import { PasswordStrengthIndicator } from '@/components/auth/PasswordStrengthIndicator'
import { getAuthErrorMessage } from '@/lib/utils/auth-errors'

export function LoginClient() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<{ message: string; hint?: string } | null>(null)
    const [mode, setMode] = useState<'signin' | 'signup'>('signin')
    const [showForgotPassword, setShowForgotPassword] = useState(false)
    const router = useRouter()
    const supabase = createClient()

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError(null)

        if (!supabase) {
            setError({
                message: 'Authentication service unavailable',
                hint: 'Please check your configuration and try again'
            })
            setIsLoading(false)
            return
        }

        if (mode === 'signup') {
            const { error: signupError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    emailRedirectTo: `${location.origin}/auth/callback`,
                },
            })
            if (signupError) {
                setError(getAuthErrorMessage(signupError))
            } else {
                // Show success message for signup
                setError({
                    message: 'Account created! Check your email to verify your account.',
                    hint: undefined
                })
                // Still redirect to dashboard - user can verify later
                setTimeout(() => {
                    router.push('/dashboard')
                    router.refresh()
                }, 2000)
            }
        } else {
            const { error: signinError } = await supabase.auth.signInWithPassword({
                email,
                password,
            })
            if (signinError) {
                setError(getAuthErrorMessage(signinError))
            } else {
                router.push('/dashboard')
                router.refresh()
            }
        }
        setIsLoading(false)
    }

    const handleOAuth = async (provider: 'google' | 'github') => {
        if (!supabase) {
            setError({
                message: 'Authentication service unavailable',
                hint: 'Please check your configuration and try again'
            })
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
        <>
            <div className="min-h-screen flex items-center justify-center bg-stone-50 dark:bg-stone-950 p-4">
                <div className="w-full max-w-md bg-white dark:bg-stone-900 rounded-3xl shadow-xl overflow-hidden border border-stone-100 dark:border-stone-800 animate-in fade-in zoom-in duration-300">

                    {/* Header */}
                    <div className="bg-gradient-to-br from-orange-500 to-rose-500 p-8 text-white text-center">
                        <h1 className="text-3xl font-bold font-heading mb-2">flameFit</h1>
                        <p className="opacity-90 text-sm">Your AI-Powered Fitness Companion</p>
                    </div>

                    {/* content */}
                    <div className="p-8">
                        <div className="flex gap-2 mb-8 bg-stone-100 dark:bg-stone-800 p-1 rounded-xl">
                            <button
                                onClick={() => {
                                    setMode('signin')
                                    setError(null)
                                }}
                                className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${mode === 'signin' ? 'bg-white dark:bg-stone-700 shadow text-stone-900 dark:text-white' : 'text-stone-500'}`}
                            >
                                Sign In
                            </button>
                            <button
                                onClick={() => {
                                    setMode('signup')
                                    setError(null)
                                }}
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
                                <div className="flex items-center justify-between mb-1">
                                    <label className="block text-xs font-bold text-stone-500 uppercase">Password</label>
                                    {mode === 'signin' && (
                                        <button
                                            type="button"
                                            onClick={() => setShowForgotPassword(true)}
                                            className="text-xs text-orange-500 hover:text-orange-600 dark:text-orange-400 dark:hover:text-orange-300 font-medium transition-colors"
                                        >
                                            Forgot Password?
                                        </button>
                                    )}
                                </div>
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        required
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all font-medium"
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-700 dark:hover:text-stone-300"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>

                            {/* Password Strength Indicator for Signup */}
                            {mode === 'signup' && password && (
                                <div className="bg-stone-50 dark:bg-stone-800 rounded-xl p-4">
                                    <PasswordStrengthIndicator password={password} showRequirements={true} />
                                </div>
                            )}

                            {error && (
                                <div className={`p-3 rounded-xl flex flex-col gap-1 ${error.message.includes('created') || error.message.includes('Check your email')
                                        ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400'
                                        : 'bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400'
                                    }`}>
                                    <div className="text-sm font-bold flex items-center gap-2">
                                        {error.message.includes('created') ? '✓' : '⚠️'} {error.message}
                                    </div>
                                    {error.hint && (
                                        <div className="text-xs opacity-80">{error.hint}</div>
                                    )}
                                </div>
                            )}

                            <button
                                disabled={isLoading}
                                className="w-full py-4 bg-stone-900 dark:bg-white text-white dark:text-stone-900 rounded-xl font-bold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                                {mode === 'signin' ? 'Sign In' : 'Create Account'}
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

            {/* Forgot Password Modal */}
            <ForgotPasswordModal
                isOpen={showForgotPassword}
                onClose={() => setShowForgotPassword(false)}
            />
        </>
    )
}
