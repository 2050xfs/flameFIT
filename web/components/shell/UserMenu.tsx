import React from 'react'

interface UserMenuProps {
    user?: { name: string; avatarUrl?: string; role?: string }
    onLogout?: () => void
    mobile?: boolean
}

import { motion } from 'framer-motion'

export function UserMenu({ user, onLogout, mobile }: UserMenuProps) {
    if (!user) return null

    if (mobile) {
        return (
            <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={onLogout}
                className="w-8 h-8 rounded-full bg-stone-200 dark:bg-stone-700 flex items-center justify-center text-xs font-bold text-stone-600 dark:text-stone-300">
                {user.name.charAt(0)}
            </motion.button>
        )
    }

    return (
        <motion.div
            whileHover={{ backgroundColor: 'rgba(0,0,0,0.05)' }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-3 p-2 rounded-xl transition-colors cursor-pointer"
            onClick={onLogout}
        >
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-rose-500 flex items-center justify-center text-white font-bold shadow-sm">
                {user.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-stone-900 dark:text-stone-100 truncate">
                        {user.name}
                    </p>
                    {user.role === 'admin' && (
                        <span className="px-1.5 py-0.5 rounded-md bg-orange-100 dark:bg-orange-900/30 text-[10px] font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wider border border-orange-200 dark:border-orange-800">
                            Admin
                        </span>
                    )}
                </div>
                <p className="text-xs text-stone-500 dark:text-stone-400 truncate">
                    Sign Out
                </p>
            </div>
        </motion.div>
    )
}

