import React from 'react'
import type { ContentItem } from '@/lib/types'
import { Bookmark, BookmarkCheck } from 'lucide-react'

interface ContentRailProps {
    title: string
    items: ContentItem[]
    onViewContent?: (id: string) => void
    onBookmark?: (id: string) => void
}

export function ContentRail({ title, items, onViewContent, onBookmark }: ContentRailProps) {
    const difficultyColors = {
        beginner: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
        intermediate: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
        advanced: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300'
    }

    return (
        <div className="space-y-4">
            <h3 className="text-xl font-bold font-heading text-stone-900 dark:text-white">{title}</h3>

            <div className="overflow-x-auto -mx-6 px-6 pb-4">
                <div className="flex gap-4 min-w-min">
                    {items.map((item) => (
                        <div
                            key={item.id}
                            className="relative group w-[280px] flex-shrink-0"
                        >
                            {/* Thumbnail */}
                            <div
                                className="relative h-[160px] rounded-xl overflow-hidden mb-3 cursor-pointer"
                                onClick={() => onViewContent?.(item.id)}
                            >
                                <div
                                    className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-110"
                                    style={{ backgroundImage: `url(${item.thumbnailUrl})` }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                                {/* Duration Badge */}
                                <div className="absolute top-2 right-2 px-2 py-1 bg-black/70 backdrop-blur-sm text-white text-xs font-bold rounded">
                                    {item.duration}
                                </div>

                                {/* Play Overlay */}
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center">
                                        <div className="w-0 h-0 border-t-8 border-t-transparent border-l-12 border-l-stone-900 border-b-8 border-b-transparent ml-1" />
                                    </div>
                                </div>
                            </div>

                            {/* Content Info */}
                            <div className="space-y-2">
                                <div className="flex items-start justify-between gap-2">
                                    <h4 className="font-bold text-stone-900 dark:text-white line-clamp-2 flex-1 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors cursor-pointer"
                                        onClick={() => onViewContent?.(item.id)}>
                                        {item.title}
                                    </h4>

                                    {/* Bookmark Button */}
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            onBookmark?.(item.id)
                                        }}
                                        className="p-1 hover:bg-stone-100 dark:hover:bg-stone-800 rounded transition-colors"
                                    >
                                        {item.isBookmarked ? (
                                            <BookmarkCheck className="w-4 h-4 text-orange-500 fill-orange-500" />
                                        ) : (
                                            <Bookmark className="w-4 h-4 text-stone-400" />
                                        )}
                                    </button>
                                </div>

                                <p className="text-sm text-stone-500 dark:text-stone-400 line-clamp-2">
                                    {item.description}
                                </p>

                                <div className="flex items-center gap-2">
                                    <span className={`text-[10px] px-2 py-1 rounded font-bold uppercase ${difficultyColors[item.difficulty]}`}>
                                        {item.difficulty}
                                    </span>
                                    <span className="text-xs text-stone-400 capitalize">{item.category}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
