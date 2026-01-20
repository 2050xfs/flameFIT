'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { getAuthErrorMessage, isValidEmail } from '@/lib/utils/auth-errors'
import { X, Mail, Loader2 } from 'lucide-react'

interface ForgotPasswordModalProps {
    isOpen: boolean
    onClose: () => void
}

export function ForgotPasswordModal({ isOpen, onClose }: ForgotPasswordModalProps) {
    const [email, setEmail] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)
    const supabase = createClient()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setIsLoading(true)

        // Validate email
        if (!isValidEmail(email)) {
            setError('Please enter a valid email address')
            setIsLoading(false)
            return
        }

        if (!supabase) {
            setError('Authentication service is not available')
            setIsLoading(false)
            return
        }

        try {
            const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/auth/reset-password`,
            })

            if (resetError) {
                const authError = getAuthErrorMessage(resetError)
                setError(authError.message)
            } else {
                setSuccess(true)
            }
        } catch (err) {
            setError('An unexpected error occurred. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    const handleClose = () => {
        setEmail('')
        setError(null)
        setSuccess(false)
        onClose()
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
            <div className="w-full max-w-md bg-white dark:bg-stone-900 rounded-3xl shadow-2xl border border-stone-200 dark:border-stone-800 animate-in zoom-in duration-300">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-stone-200 dark:border-stone-800">
                    <h2 className="text-xl font-heading font-bold text-stone-900 dark:text-white">
                        Reset Password
                    </h2>
                    <button
                        onClick={handleClose}
                        className="text-stone-500 hover:text-stone-700 dark:hover:text-stone-300 transition-colors"
                        aria-label="Close"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    {success ? (
                        <div className="text-center space-y-4">
                            <div className="w-16 h-16 mx-auto bg-emerald-100 dark:bg-emerald-900/20 rounded-full flex items-center justify-center">
                                <Mail className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-stone-900 dark:text-white mb-2">
                                    Check your email
                                </h3>
                                <p className="text-sm text-stone-600 dark:text-stone-400">
                                    We've sent a password reset link to <span className="font-medium text-stone-900 dark:text-white">{email}</span>
                                </p>
                                <p className="text-xs text-stone-500 dark:text-stone-500 mt-2">
                                    The link will expire in 1 hour
                                </p>
                            </div>
                            <button
                                onClick={handleClose}
                                className="w-full py-3 bg-stone-900 dark:bg-white text-white dark:text-stone-900 rounded-xl font-bold hover:opacity-90 transition-opacity"
                            >
                                Got it
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <p className="text-sm text-stone-600 dark:text-stone-400">
                                Enter your email address and we'll send you a link to reset your password.
                            </p>

                            <div>
                                <label className="block text-xs font-bold text-stone-500 uppercase mb-1">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all font-medium"
                                    placeholder="you@example.com"
                                    disabled={isLoading}
                                />
                            </div>

                            {error && (
                                <div className="p-3 bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 text-sm font-medium rounded-xl flex items-center gap-2">
                                    ⚠️ {error}
                                </div>
                            )}

                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={handleClose}
                                    className="flex-1 py-3 bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-white rounded-xl font-bold hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors"
                                    disabled={isLoading}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="flex-1 py-3 bg-stone-900 dark:bg-white text-white dark:text-stone-900 rounded-xl font-bold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                                    Send Reset Link
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    )
}
