"use client";

import React, { useState } from "react";
import { KnowledgeBase } from "@/components/knowledge-base";
import { KnowledgeBaseProps } from "@/lib/types";

// Pick only the data props, as callbacks are handled here
type KnowledgeBaseData = Omit<KnowledgeBaseProps, "onViewContent" | "onSearch" | "onBookmark">;

export function KnowledgeBaseClient({ initialData }: { initialData: KnowledgeBaseData }) {
    const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(
        new Set(initialData.bookmarked.map(item => item.id))
    );

    const handleViewContent = (id: string) => {
        // Navigate to content detail page
        console.log("View content:", id);
        // In the future: router.push(`/knowledge-base/${id}`);
    };

    const handleSearch = (query: string) => {
        // Perform search
        console.log("Search query:", query);
        // In the future: fetch search results and update state
    };

    const handleBookmark = (id: string) => {
        // Toggle bookmark state
        setBookmarkedIds(prev => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
                console.log("Removed from bookmarks:", id);
            } else {
                newSet.add(id);
                console.log("Added to bookmarks:", id);
            }
            return newSet;
        });
    };

    // Update bookmarked status for all items
    const updateBookmarkStatus = (data: KnowledgeBaseData) => {
        const updateItems = (items: typeof initialData.featured) =>
            items.map(item => ({ ...item, isBookmarked: bookmarkedIds.has(item.id) }));

        return {
            featured: updateItems(data.featured),
            categories: {
                strength: updateItems(data.categories.strength),
                cardio: updateItems(data.categories.cardio),
                mobility: updateItems(data.categories.mobility),
                nutrition: updateItems(data.categories.nutrition),
                recovery: updateItems(data.categories.recovery)
            },
            bookmarked: updateItems(data.bookmarked).filter(item => bookmarkedIds.has(item.id))
        };
    };

    const updatedData = updateBookmarkStatus(initialData);

    return (
        <KnowledgeBase
            {...updatedData}
            onViewContent={handleViewContent}
            onSearch={handleSearch}
            onBookmark={handleBookmark}
        />
    );
}
