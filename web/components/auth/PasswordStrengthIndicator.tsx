'use client'

import { validatePasswordStrength } from '@/lib/utils/auth-errors'
import { Check, X } from 'lucide-react'

interface PasswordStrengthIndicatorProps {
    password: string
    showRequirements?: boolean
}

const STRENGTH_LABELS = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong']
const STRENGTH_COLORS = [
    'bg-rose-500',
    'bg-orange-500',
    'bg-amber-500',
    'bg-emerald-500',
    'bg-green-600'
]

export function PasswordStrengthIndicator({ password, showRequirements = true }: PasswordStrengthIndicatorProps) {
    if (!password) return null

    const strength = validatePasswordStrength(password)
    const strengthLabel = STRENGTH_LABELS[strength.score]
    const strengthColor = STRENGTH_COLORS[strength.score]

    const requirements = [
        { label: 'At least 8 characters', met: password.length >= 8 },
        { label: 'Uppercase letter', met: /[A-Z]/.test(password) },
        { label: 'Lowercase letter', met: /[a-z]/.test(password) },
        { label: 'Number', met: /\d/.test(password) },
        { label: 'Special character', met: /[!@#$%^&*(),.?":{}|<>]/.test(password) },
    ]

    return (
        <div className="space-y-2">
            {/* Strength bar */}
            <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                    <span className="text-stone-500 dark:text-stone-400 font-medium">Password Strength</span>
                    <span className={`font-bold ${strength.isValid ? 'text-emerald-600 dark:text-emerald-400' : 'text-stone-600 dark:text-stone-400'}`}>
                        {strengthLabel}
                    </span>
                </div>
                <div className="flex gap-1 h-1.5">
                    {[0, 1, 2, 3, 4].map((index) => (
                        <div
                            key={index}
                            className={`flex-1 rounded-full transition-colors ${index <= strength.score
                                    ? strengthColor
                                    : 'bg-stone-200 dark:bg-stone-700'
                                }`}
                        />
                    ))}
                </div>
            </div>

            {/* Requirements checklist */}
            {showRequirements && (
                <div className="space-y-1 pt-1">
                    {requirements.map((req, index) => (
                        <div
                            key={index}
                            className={`flex items-center gap-2 text-xs transition-colors ${req.met
                                    ? 'text-emerald-600 dark:text-emerald-400'
                                    : 'text-stone-500 dark:text-stone-400'
                                }`}
                        >
                            {req.met ? (
                                <Check className="w-3 h-3" />
                            ) : (
                                <X className="w-3 h-3 opacity-40" />
                            )}
                            <span className={req.met ? 'font-medium' : ''}>{req.label}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
