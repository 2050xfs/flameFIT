import React from 'react'

interface UserMenuProps {
    user?: { name: string; avatarUrl?: string }
    onLogout?: () => void
    mobile?: boolean
}

export function UserMenu({ user, onLogout, mobile }: UserMenuProps) {
    if (!user) return null

    if (mobile) {
        return (
            <button
                onClick={onLogout}
                className="w-8 h-8 rounded-full bg-stone-200 dark:bg-stone-700 flex items-center justify-center text-xs font-bold text-stone-600 dark:text-stone-300">
                {user.name.charAt(0)}
            </button>
        )
    }

    return (
        <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer" onClick={onLogout}>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-rose-500 flex items-center justify-center text-white font-bold shadow-sm">
                {user.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-stone-900 dark:text-stone-100 truncate">
                    {user.name}
                </p>
                <p className="text-xs text-stone-500 dark:text-stone-400 truncate">
                    View Profile
                </p>
            </div>
        </div>
    )
}
