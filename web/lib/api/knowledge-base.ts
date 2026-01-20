import { KnowledgeBaseProps, ContentItem } from "@/lib/types";
import { createClient } from "../supabase/server";

const mockContent: ContentItem[] = [
    {
        id: '1',
        title: 'Perfect Barbell Squat Form',
        description: 'Master the fundamental movement pattern for lower body strength. Learn proper depth, bar position, and breathing.',
        category: 'strength',
        tags: ['squat', 'legs', 'form'],
        duration: '12:30',
        difficulty: 'intermediate',
        thumbnailUrl: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&h=400&fit=crop',
        videoUrl: '/videos/squat-form.mp4'
    },
    {
        id: '4',
        title: 'Macro Counting 101',
        description: 'Learn how to track macronutrients effectively. Understand protein, carbs, and fats for optimal body composition.',
        category: 'nutrition',
        tags: ['nutrition', 'macros', 'diet'],
        duration: '18:45',
        difficulty: 'beginner',
        thumbnailUrl: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600&h=400&fit=crop',
        videoUrl: '/videos/macro-counting.mp4'
    }
];

// Deprecated or can be kept as aggregation service
// We'll update it to fetch from the new table
export async function getKnowledgeBaseData(): Promise<Omit<KnowledgeBaseProps, 'onViewContent' | 'onSearch' | 'onBookmark'>> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Fetch content from new table
    const { data: dbContent } = await supabase
        .from('knowledge_base_articles')
        .select('id, title, description, category, thumbnail_url, tags, is_premium, slug')
        .order('date', { ascending: false });

    // Fetch user bookmarks
    const { data: bookmarks } = user ? await supabase
        .from('knowledge_base_bookmarks')
        .select('content_id')
        .eq('user_id', user.id) : { data: [] };

    const bookmarkIds = new Set((bookmarks || []).map(b => b.content_id));

    // Map DB content
    const items: ContentItem[] = (dbContent || []).map((c: any) => ({
        id: c.id,
        title: c.title,
        description: c.description || '',
        category: c.category || 'strength',
        tags: c.tags || [],
        duration: '5 min read',
        difficulty: 'intermediate',
        thumbnailUrl: c.thumbnail_url || '',
        videoUrl: undefined,
        isBookmarked: bookmarkIds.has(c.id),
        isPremium: c.is_premium,
        slug: c.slug
    }));

    // Use mock if DB is empty (fallback)
    if (items.length === 0) {
        return {
            featured: mockContent,
            categories: {
                strength: mockContent.filter(c => c.category === 'strength'),
                cardio: mockContent.filter(c => c.category === 'cardio'),
                mobility: mockContent.filter(c => c.category === 'mobility'),
                nutrition: mockContent.filter(c => c.category === 'nutrition'),
                recovery: mockContent.filter(c => c.category === 'recovery')
            },
            bookmarked: []
        };
    }

    const categorized = {
        strength: items.filter(c => c.category === 'strength'),
        cardio: items.filter(c => c.category === 'cardio'),
        mobility: items.filter(c => c.category === 'mobility'),
        nutrition: items.filter(c => c.category === 'nutrition'),
        recovery: items.filter(c => c.category === 'recovery')
    };

    return {
        featured: items.slice(0, 1),
        categories: categorized,
        bookmarked: items.filter(c => c.isBookmarked)
    };
}

