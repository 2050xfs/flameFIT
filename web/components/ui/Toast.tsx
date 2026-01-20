'use client'

import { useEffect, useState } from 'react'
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface ToastProps {
    message: string
    type?: ToastType
    duration?: number
    onClose?: () => void
    hint?: string
}

const ICONS = {
    success: CheckCircle,
    error: AlertCircle,
    warning: AlertTriangle,
    info: Info,
}

const STYLES = {
    success: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
    error: 'bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800',
    warning: 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800',
    info: 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800',
}

export function Toast({ message, type = 'info', duration = 5000, onClose, hint }: ToastProps) {
    const [isVisible, setIsVisible] = useState(true)
    const [isExiting, setIsExiting] = useState(false)

    useEffect(() => {
        if (duration > 0) {
            const timer = setTimeout(() => {
                handleClose()
            }, duration)

            return () => clearTimeout(timer)
        }
    }, [duration])

    const handleClose = () => {
        setIsExiting(true)
        setTimeout(() => {
            setIsVisible(false)
            onClose?.()
        }, 300)
    }

    if (!isVisible) return null

    const Icon = ICONS[type]

    return (
        <div
            className={`
                fixed top-4 right-4 z-50 max-w-md w-full
                ${isExiting ? 'animate-out fade-out slide-out-to-right' : 'animate-in fade-in slide-in-from-right'}
            `}
        >
            <div className={`
                flex items-start gap-3 p-4 rounded-xl border shadow-lg
                ${STYLES[type]}
            `}>
                <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm">{message}</p>
                    {hint && (
                        <p className="text-xs mt-1 opacity-80">{hint}</p>
                    )}
                </div>
                <button
                    onClick={handleClose}
                    className="flex-shrink-0 opacity-60 hover:opacity-100 transition-opacity"
                    aria-label="Close notification"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
        </div>
    )
}

// Toast container for managing multiple toasts
export interface ToastMessage extends ToastProps {
    id: string
}

export function ToastContainer({ toasts }: { toasts: ToastMessage[] }) {
    return (
        <div className="fixed top-4 right-4 z-50 space-y-2 max-w-md w-full">
            {toasts.map((toast, index) => (
                <div
                    key={toast.id}
                    style={{ transform: `translateY(${index * 8}px)` }}
                    className="transition-transform"
                >
                    <Toast {...toast} />
                </div>
            ))}
        </div>
    )
}
