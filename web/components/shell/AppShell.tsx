import React from 'react'
import { MainNav } from './MainNav'
import { UserMenu } from './UserMenu'

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

interface AppShellProps {
    children: React.ReactNode
    navigationItems: NavItem[]
    user?: { name: string; avatarUrl?: string }
    onNavigate?: (href: string) => void
    onLogout?: () => void
}

export function AppShell({
    children,
    navigationItems,
    user,
    onNavigate,
    onLogout
}: AppShellProps) {
    return (
        <div className="min-h-screen bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 font-sans">
            {/* Desktop Sidebar */}
            <aside className="hidden md:flex flex-col fixed inset-y-0 left-0 w-64 border-r border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900">
                <div className="p-6">
                    <h1 className="text-2xl font-bold font-heading text-orange-500 tracking-tight">flameFit</h1>
                </div>

                <div className="flex-1 px-4">
                    <MainNav items={navigationItems} onNavigate={onNavigate} />
                </div>

                <div className="p-4 border-t border-stone-200 dark:border-stone-800">
                    <UserMenu user={user} onLogout={onLogout} />
                </div>
            </aside>

            {/* Mobile Header */}
            <header className="md:hidden flex items-center justify-between p-4 bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800 sticky top-0 z-50">
                <span className="text-xl font-bold font-heading text-orange-500">flameFit</span>
                <UserMenu user={user} onLogout={onLogout} mobile />
            </header>

            {/* Main Content */}
            <main className="md:pl-64 min-h-screen transition-all duration-300">
                <div className="container mx-auto p-4 md:p-8 max-w-7xl">
                    {children}
                </div>
            </main>

            {/* Mobile Bottom Nav */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-stone-900/80 backdrop-blur-md border-t border-stone-200 dark:border-stone-800 pb-safe z-50">
                <MainNav items={navigationItems} onNavigate={onNavigate} mobile />
            </nav>
        </div>
    )
}
