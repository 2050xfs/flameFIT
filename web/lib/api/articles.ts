
import { createClient } from "@/lib/supabase/server";
import { Article, ContentItem } from "@/lib/types";

export async function getArticleBySlug(slugOrId: string): Promise<Article | null> {
    const supabase = await createClient();

    // First try knowledge_base_articles by slug (canonical route)
    const { data: articleData } = await supabase
        .from('knowledge_base_articles')
        .select('*')
        .eq('slug', slugOrId)
        .maybeSingle();

    if (articleData) {
        return {
            id: articleData.id,
            slug: articleData.slug,
            title: articleData.title,
            description: articleData.description || '',
            content: articleData.content || '',
            category: articleData.category || 'strength',
            thumbnailUrl: articleData.thumbnail_url || '',
            tags: articleData.tags || [],
            wordCount: articleData.word_count || 0,
            isPremium: articleData.is_premium || false,
            date: articleData.date
        };
    }

    // Fallback: look up knowledge_base_content by ID (used when navigating from content grid)
    const { data: contentData } = await supabase
        .from('knowledge_base_content')
        .select('id, title, description, category, thumbnail_url, tags, difficulty, duration, video_url, created_at')
        .eq('id', slugOrId)
        .maybeSingle();

    if (contentData) {
        const wordCount = (contentData.description || '').split(' ').length * 10; // Estimate
        return {
            id: contentData.id,
            slug: contentData.id,
            title: contentData.title,
            description: contentData.description || '',
            content: contentData.description || 'Full article content coming soon.',
            category: contentData.category || 'strength',
            thumbnailUrl: contentData.thumbnail_url || '',
            tags: contentData.tags || [],
            wordCount,
            isPremium: false,
            date: contentData.created_at || new Date().toISOString()
        };
    }

    return null;
}

export async function getLatestArticles(limit: number = 6): Promise<ContentItem[]> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('knowledge_base_articles')
        .select('id, title, description, category, thumbnail_url, tags, is_premium, slug')
        .order('date', { ascending: false })
        .limit(limit);

    if (error || !data || data.length === 0) {
        // Fallback to knowledge_base_content
        const { data: contentData } = await supabase
            .from('knowledge_base_content')
            .select('id, title, description, category, thumbnail_url, tags, difficulty, duration')
            .order('created_at', { ascending: false })
            .limit(limit);

        return (contentData || []).map((item: any) => ({
            id: item.id,
            title: item.title,
            description: item.description || '',
            category: (item.category as any) || 'strength',
            tags: item.tags || [],
            duration: item.duration || '5 min read',
            difficulty: item.difficulty || 'intermediate',
            thumbnailUrl: item.thumbnail_url || '',
        }));
    }

    return data.map((item: any) => ({
        id: item.id,
        title: item.title,
        description: item.description || '',
        category: (item.category as any) || 'strength',
        tags: item.tags || [],
        duration: '5 min read',
        difficulty: 'intermediate',
        thumbnailUrl: item.thumbnail_url || '',
        isPremium: item.is_premium,
        slug: item.slug
    }));
}

export async function getRelatedArticles(category: string, currentId: string, limit: number = 3): Promise<ContentItem[]> {
    const supabase = await createClient();

    const { data } = await supabase
        .from('knowledge_base_content')
        .select('id, title, description, category, thumbnail_url, tags, difficulty, duration')
        .eq('category', category)
        .neq('id', currentId)
        .limit(limit);

    return (data || []).map((item: any) => ({
        id: item.id,
        title: item.title,
        description: item.description || '',
        category: (item.category as any) || 'strength',
        tags: item.tags || [],
        duration: item.duration || '5 min read',
        difficulty: item.difficulty || 'intermediate',
        thumbnailUrl: item.thumbnail_url || '',
    }));
}
