'use client'

import { useState } from 'react'
import { ChevronRight } from 'lucide-react'
import { motion } from 'framer-motion'

interface SubItem {
    label: string
    href: string
    isActive?: boolean
}

interface NavItem {
    label: string
    href: string
    isActive?: boolean
    icon?: any
    subItems?: SubItem[]
}

interface MainNavProps {
    items: NavItem[]
    onNavigate?: (href: string) => void
    mobile?: boolean
}

export function MainNav({ items, onNavigate, mobile }: MainNavProps) {
    const [hoveredItem, setHoveredItem] = useState<string | null>(null)

    if (mobile) {
        return (
            <div className="flex justify-around items-center p-2">
                {items.map((item) => (
                    <motion.button
                        key={item.href}
                        onClick={() => onNavigate?.(item.href)}
                        whileTap={{ scale: 0.9 }}
                        className={`flex flex-col items-center justify-center w-full p-2 rounded-lg transition-colors relative ${item.isActive
                            ? 'text-orange-500'
                            : 'text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
                            }`}
                    >
                        {item.isActive && (
                            <motion.div
                                layoutId="mobile-nav-indicator"
                                className="absolute inset-0 bg-orange-500/5 dark:bg-orange-500/10 rounded-xl"
                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                            />
                        )}
                        {item.icon && <item.icon className="w-5 h-5 mb-1 relative z-10" />}
                        <span className="text-[10px] font-medium relative z-10">{item.label}</span>
                    </motion.button>
                ))}
            </div>
        )
    }

    return (
        <nav className="space-y-1">
            {items.map((item) => (
                <div
                    key={item.href}
                    className="relative"
                    onMouseEnter={() => item.subItems && item.subItems.length > 0 && setHoveredItem(item.href)}
                    onMouseLeave={() => setHoveredItem(null)}
                >
                    <motion.button
                        onClick={() => onNavigate?.(item.href)}
                        whileHover={{ x: 4 }}
                        whileTap={{ scale: 0.98 }}
                        className={`flex items-center w-full px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 group relative ${item.isActive
                            ? 'text-orange-600 dark:text-orange-400'
                            : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 hover:text-stone-900 dark:hover:text-stone-200'
                            }`}
                    >
                        {item.isActive && (
                            <motion.div
                                layoutId="active-nav-bg"
                                className="absolute inset-0 bg-orange-50 dark:bg-orange-500/10 rounded-xl"
                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                            />
                        )}
                        {item.icon && <item.icon className="w-5 h-5 mr-3 relative z-10" />}
                        <span className="flex-1 text-left relative z-10">{item.label}</span>
                        {item.subItems && item.subItems.length > 0 && (
                            <ChevronRight className={`w-4 h-4 transition-transform relative z-10 ${hoveredItem === item.href ? 'rotate-90' : ''}`} />
                        )}
                    </motion.button>


                    {/* Submenu - appears on hover only */}
                    {item.subItems && item.subItems.length > 0 && hoveredItem === item.href && (
                        <div className="absolute left-full top-0 ml-2 w-56 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl shadow-lg overflow-hidden z-50">
                            <div className="py-2">
                                {item.subItems.map((subItem) => (
                                    <button
                                        key={subItem.href}
                                        onClick={() => onNavigate?.(subItem.href)}
                                        className={`flex items-center w-full px-4 py-2 text-sm transition-colors ${subItem.isActive
                                            ? 'bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 font-medium'
                                            : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
                                            }`}
                                    >
                                        {subItem.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </nav>
    )
}
