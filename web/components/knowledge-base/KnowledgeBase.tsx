import React, { useState } from 'react'
import type { KnowledgeBaseProps } from '@/lib/types'
import { ContentRail } from './ContentRail'
import { SearchIcon, Bookmark } from 'lucide-react'
import Link from 'next/link'

export function KnowledgeBase({
    featured,
    categories,
    bookmarked,
    onViewContent,
    onSearch,
    onBookmark
}: KnowledgeBaseProps) {
    const [searchQuery, setSearchQuery] = useState('')
    const [isSearching, setIsSearching] = useState(false)

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        if (searchQuery.trim()) {
            setIsSearching(true)
            onSearch?.(searchQuery)
        }
    }

    const categoryData = [
        { id: 'strength', label: 'Strength Training', items: categories.strength },
        { id: 'cardio', label: 'Cardio & Conditioning', items: categories.cardio },
        { id: 'mobility', label: 'Mobility & Flexibility', items: categories.mobility },
        { id: 'nutrition', label: 'Nutrition Guides', items: categories.nutrition },
        { id: 'recovery', label: 'Recovery & Wellness', items: categories.recovery }
    ]

    return (
        <div className="space-y-8 pb-12">

            {/* Header & Search */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold font-heading text-stone-900 dark:text-white">Knowledge Base</h2>
                    <p className="text-stone-500 dark:text-stone-400 mt-1">Learn techniques, nutrition, and recovery</p>
                </div>

                {/* Search Bar */}
                <form onSubmit={handleSearch} className="relative max-w-md w-full">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search exercises, nutrition tips..."
                        className="w-full px-4 py-3 pl-12 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl text-stone-900 dark:text-white placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                    <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                </form>
            </div>

            {/* Featured Hero */}
            {featured.length > 0 && (
                <div className="relative h-[400px] rounded-3xl overflow-hidden group">
                    <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url(${featured[0].thumbnailUrl})` }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                    </div>

                    <div className="relative h-full flex items-end p-8 md:p-12">
                        <div className="max-w-2xl">
                            <div className="flex items-center gap-3 mb-4">
                                <span className="px-3 py-1 bg-orange-500 text-white text-xs font-bold uppercase rounded">Featured</span>
                                <span className="text-sm text-white/80">{featured[0].duration}</span>
                                <span className="text-sm text-white/80 capitalize">{featured[0].difficulty}</span>
                            </div>
                            <h3 className="text-4xl font-bold font-heading text-white mb-3">{featured[0].title}</h3>
                            <p className="text-lg text-white/90 mb-6 line-clamp-2">{featured[0].description}</p>
                            <div className="flex gap-3">
                                {featured[0].slug ? (
                                    <Link
                                        href={`/knowledge-base/articles/${featured[0].slug}`}
                                        className="px-6 py-3 bg-white text-stone-900 rounded-xl font-bold hover:bg-stone-100 transition-colors flex items-center justify-center"
                                    >
                                        ▶ Read Now
                                    </Link>
                                ) : (
                                    <button
                                        onClick={() => onViewContent?.(featured[0].id)}
                                        className="px-6 py-3 bg-white text-stone-900 rounded-xl font-bold hover:bg-stone-100 transition-colors"
                                    >
                                        ▶ Play Now
                                    </button>
                                )}
                                <button
                                    onClick={() => onBookmark?.(featured[0].id)}
                                    className="px-6 py-3 bg-white/10 backdrop-blur-sm text-white rounded-xl font-medium hover:bg-white/20 transition-colors flex items-center gap-2"
                                >
                                    <Bookmark className="w-4 h-4" />
                                    Save
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Bookmarked Content */}
            {bookmarked.length > 0 && (
                <ContentRail
                    title="Your Library"
                    items={bookmarked}
                    onViewContent={onViewContent}
                    onBookmark={onBookmark}
                />
            )}

            {/* Category Rails */}
            {categoryData.map(cat => cat.items.length > 0 && (
                <ContentRail
                    key={cat.id}
                    title={cat.label}
                    items={cat.items}
                    onViewContent={onViewContent}
                    onBookmark={onBookmark}
                />
            ))}

            {/* Empty State */}
            {featured.length === 0 && bookmarked.length === 0 &&
                categoryData.every(cat => cat.items.length === 0) && (
                    <div className="text-center py-20">
                        <div className="text-6xl mb-4">📚</div>
                        <h3 className="text-2xl font-bold font-heading text-stone-900 dark:text-white mb-2">
                            No Content Available
                        </h3>
                        <p className="text-stone-500 dark:text-stone-400">
                            Check back soon for educational content and tutorials.
                        </p>
                    </div>
                )}
        </div>
    )
}
