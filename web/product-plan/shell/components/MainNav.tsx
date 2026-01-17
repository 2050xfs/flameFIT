import React from 'react'

interface NavItem {
    label: string
    href: string
    isActive?: boolean
    icon?: any
}

interface MainNavProps {
    items: NavItem[]
    onNavigate?: (href: string) => void
    mobile?: boolean
}

export function MainNav({ items, onNavigate, mobile }: MainNavProps) {
    if (mobile) {
        return (
            <div className="flex justify-around items-center p-2">
                {items.map((item) => (
                    <button
                        key={item.href}
                        onClick={() => onNavigate?.(item.href)}
                        className={`flex flex-col items-center justify-center w-full p-2 rounded-lg transition-colors ${item.isActive
                                ? 'text-orange-500'
                                : 'text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
                            }`}
                    >
                        {/* Placeholder Icon */}
                        <div className={`w-6 h-6 mb-1 rounded-full ${item.isActive ? 'bg-orange-100 dark:bg-orange-900/30' : 'bg-transparent'}`} />
                        <span className="text-[10px] font-medium">{item.label}</span>
                    </button>
                ))}
            </div>
        )
    }

    return (
        <nav className="space-y-1">
            {items.map((item) => (
                <button
                    key={item.href}
                    onClick={() => onNavigate?.(item.href)}
                    className={`flex items-center w-full px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 group ${item.isActive
                            ? 'bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400'
                            : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 hover:text-stone-900 dark:hover:text-stone-200'
                        }`}
                >
                    {/* Placeholder Icon */}
                    <div className={`w-5 h-5 mr-3 rounded-md ${item.isActive ? 'bg-orange-500' : 'bg-stone-300 dark:bg-stone-700 group-hover:bg-stone-400'}`} />
                    {item.label}
                </button>
            ))}
        </nav>
    )
}
