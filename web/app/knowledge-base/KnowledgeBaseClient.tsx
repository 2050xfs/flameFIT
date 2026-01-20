"use client";

import React, { useState } from "react";
import { KnowledgeBase } from "@/components/knowledge-base";
import { KnowledgeBaseProps, ContentItem } from "@/lib/types";


// Pick only the data props, as callbacks are handled here
type KnowledgeBaseData = Omit<KnowledgeBaseProps, "onViewContent" | "onSearch" | "onBookmark">;

export function KnowledgeBaseClient({ initialData }: { initialData: KnowledgeBaseData }) {
    const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(
        new Set(initialData.bookmarked.map(item => item.id))
    );
    const [searchResults, setSearchResults] = useState<ContentItem[] | null>(null);
    const [isSearching, setIsSearching] = useState(false);

    const handleViewContent = (id: string) => {
        console.log("View content:", id);
        // Navigate or open modal
    };

    const handleSearch = async (query: string) => {
        if (!query.trim()) {
            setSearchResults(null);
            return;
        }

        setIsSearching(true);
        try {
            const { searchContentAction } = await import("./actions");
            const results = await searchContentAction(query);
            setSearchResults(results as ContentItem[]);
        } catch (err) {
            console.error("Search failed:", err);
        } finally {
            setIsSearching(false);
        }
    };

    const handleBookmark = async (id: string) => {
        const isCurrentlyBookmarked = bookmarkedIds.has(id);

        // Optimistic Update
        setBookmarkedIds(prev => {
            const newSet = new Set(prev);
            if (isCurrentlyBookmarked) newSet.delete(id);
            else newSet.add(id);
            return newSet;
        });

        try {
            const { toggleBookmarkAction } = await import("./actions");
            await toggleBookmarkAction(id, isCurrentlyBookmarked);
        } catch (err) {
            console.error("Bookmark sync failed:", err);
            // Revert on error
            setBookmarkedIds(prev => {
                const newSet = new Set(prev);
                if (isCurrentlyBookmarked) newSet.add(id);
                else newSet.delete(id);
                return newSet;
            });
        }
    };

    // Helper to inject isBookmarked state into items
    const mapWithBookmarkStatus = (items: ContentItem[]) =>
        items.map(item => ({ ...item, isBookmarked: bookmarkedIds.has(item.id) }));

    const displayData = {
        featured: mapWithBookmarkStatus(initialData.featured),
        categories: {
            strength: mapWithBookmarkStatus(initialData.categories.strength),
            cardio: mapWithBookmarkStatus(initialData.categories.cardio),
            mobility: mapWithBookmarkStatus(initialData.categories.mobility),
            nutrition: mapWithBookmarkStatus(initialData.categories.nutrition),
            recovery: mapWithBookmarkStatus(initialData.categories.recovery)
        },
        bookmarked: mapWithBookmarkStatus(initialData.bookmarked).filter(item => bookmarkedIds.has(item.id))
    };

    // If we have search results, we could overlay or prepend. 
    // Let's pass search results as a special rail if present.
    const searchData = searchResults ? mapWithBookmarkStatus(searchResults) : [];

    return (
        <React.Fragment>
            {searchResults && (
                <div className="mb-12 animate-in fade-in slide-in-from-top-4 duration-300">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold font-heading">Search Results ({searchData.length})</h3>
                        <button
                            onClick={() => setSearchResults(null)}
                            className="text-stone-500 hover:text-stone-900 text-sm font-medium"
                        >
                            Clear Results
                        </button>
                    </div>
                    {searchData.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {searchData.map(item => (
                                <div key={item.id} className="bg-white dark:bg-stone-900 rounded-3xl overflow-hidden border border-stone-200 dark:border-stone-800 group transition-all hover:shadow-xl">
                                    <div className="aspect-video relative overflow-hidden">
                                        <img src={item.thumbnailUrl} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                        <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md p-2 rounded-xl text-white">
                                            <button onClick={() => handleBookmark(item.id)}>
                                                <svg className={`w-5 h-5 ${bookmarkedIds.has(item.id) ? 'fill-orange-500 text-orange-500' : 'text-white'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="text-[10px] font-bold uppercase tracking-wider text-orange-500">{item.category}</span>
                                            <span className="text-stone-300">•</span>
                                            <span className="text-[10px] font-bold text-stone-500">{item.duration}</span>
                                        </div>
                                        <h4 className="font-bold text-lg mb-2 line-clamp-1">{item.title}</h4>
                                        <p className="text-sm text-stone-500 line-clamp-2 mb-4">{item.description}</p>
                                        <button
                                            onClick={() => handleViewContent(item.id)}
                                            className="w-full py-3 bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-white rounded-xl font-bold hover:bg-orange-500 hover:text-white transition-all text-sm"
                                        >
                                            View Details
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 bg-stone-100 dark:bg-stone-900 rounded-3xl">
                            <p className="text-stone-500">No matches found for your search.</p>
                        </div>
                    )}
                </div>
            )}

            <KnowledgeBase
                {...displayData}
                onViewContent={handleViewContent}
                onSearch={handleSearch}
                onBookmark={handleBookmark}
            />
        </React.Fragment>
    );
}

