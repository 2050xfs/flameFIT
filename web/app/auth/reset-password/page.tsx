'use client'

import { Suspense } from 'react'

// ... existing imports ...
import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { getAuthErrorMessage } from '@/lib/utils/auth-errors'
import { PasswordStrengthIndicator } from '@/components/auth/PasswordStrengthIndicator'
import { Loader2, CheckCircle, Eye, EyeOff } from 'lucide-react'

function ResetPasswordContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const supabase = createClient()

    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)

    // Check if we have a valid session/token
    useEffect(() => {
        const checkSession = async () => {
            if (!supabase) return

            const { data: { session } } = await supabase.auth.getSession()
            if (!session) {
                setError('Invalid or expired reset link. Please request a new password reset.')
            }
        }

        checkSession()
    }, [supabase])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)

        // Validation
        if (password.length < 8) {
            setError('Password must be at least 8 characters long')
            return
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match')
            return
        }

        if (!supabase) {
            setError('Authentication service is not available')
            return
        }

        setIsLoading(true)

        try {
            const { error: updateError } = await supabase.auth.updateUser({
                password: password
            })

            if (updateError) {
                const authError = getAuthErrorMessage(updateError)
                setError(authError.message)
            } else {
                setSuccess(true)
                // Redirect to login after 2 seconds
                setTimeout(() => {
                    router.push('/login')
                }, 2000)
            }
        } catch (err) {
            setError('An unexpected error occurred. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-stone-50 dark:bg-stone-950 p-4">
            <div className="w-full max-w-md bg-white dark:bg-stone-900 rounded-3xl shadow-xl overflow-hidden border border-stone-100 dark:border-stone-800 animate-in fade-in zoom-in duration-300">
                {/* Header */}
                <div className="bg-gradient-to-br from-orange-500 to-rose-500 p-8 text-white text-center">
                    <h1 className="text-3xl font-bold font-heading mb-2">flameFit</h1>
                    <p className="opacity-90 text-sm">Reset Your Password</p>
                </div>

                {/* Content */}
                <div className="p-8">
                    {success ? (
                        <div className="text-center space-y-4">
                            <div className="w-16 h-16 mx-auto bg-emerald-100 dark:bg-emerald-900/20 rounded-full flex items-center justify-center">
                                <CheckCircle className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-stone-900 dark:text-white mb-2">
                                    Password Reset Successful
                                </h2>
                                <p className="text-sm text-stone-600 dark:text-stone-400">
                                    Your password has been updated. Redirecting to login...
                                </p>
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <p className="text-sm text-stone-600 dark:text-stone-400 mb-6">
                                Enter your new password below. Make sure it's strong and secure.
                            </p>

                            {/* New Password */}
                            <div>
                                <label className="block text-xs font-bold text-stone-500 uppercase mb-1">
                                    New Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all font-medium"
                                        placeholder="••••••••"
                                        disabled={isLoading}
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

                            {/* Password Strength Indicator */}
                            {password && (
                                <div className="bg-stone-50 dark:bg-stone-800 rounded-xl p-4">
                                    <PasswordStrengthIndicator password={password} />
                                </div>
                            )}

                            {/* Confirm Password */}
                            <div>
                                <label className="block text-xs font-bold text-stone-500 uppercase mb-1">
                                    Confirm Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        required
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all font-medium"
                                        placeholder="••••••••"
                                        disabled={isLoading}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-700 dark:hover:text-stone-300"
                                    >
                                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                                {confirmPassword && password !== confirmPassword && (
                                    <p className="text-xs text-rose-500 mt-1">Passwords do not match</p>
                                )}
                            </div>

                            {/* Error Message */}
                            {error && (
                                <div className="p-3 bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 text-sm font-medium rounded-xl flex items-center gap-2">
                                    ⚠️ {error}
                                </div>
                            )}

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isLoading || password !== confirmPassword || password.length < 8}
                                className="w-full py-4 bg-stone-900 dark:bg-white text-white dark:text-stone-900 rounded-xl font-bold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                                Reset Password
                            </button>

                            {/* Back to Login */}
                            <div className="text-center">
                                <button
                                    type="button"
                                    onClick={() => router.push('/login')}
                                    className="text-sm text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white transition-colors"
                                >
                                    Back to Login
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    )
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin" /></div>}>
            <ResetPasswordContent />
        </Suspense>
    )
}
