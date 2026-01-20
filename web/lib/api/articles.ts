
import { createClient } from "@/lib/supabase/client";
import { Article, ContentItem } from "@/lib/types";

export async function getArticleBySlug(slug: string): Promise<Article | null> {
    const supabase = createClient();
    if (!supabase) return null;

    const { data, error } = await supabase
        .from('knowledge_base_articles')
        .select('*')
        .eq('slug', slug)
        .single();

    if (error) {
        console.error('Error fetching article:', error);
        return null;
    }

    return {
        id: data.id,
        slug: data.slug,
        title: data.title,
        description: data.description || '',
        content: data.content || '',
        category: data.category || 'strength',
        thumbnailUrl: data.thumbnail_url || '',
        tags: data.tags || [],
        wordCount: data.word_count || 0,
        isPremium: data.is_premium || false,
        date: data.date
    };
}

export async function getLatestArticles(limit: number = 6): Promise<ContentItem[]> {
    const supabase = createClient();
    if (!supabase) return [];

    const { data, error } = await supabase
        .from('knowledge_base_articles')
        .select('id, title, description, category, thumbnail_url, tags, is_premium, slug')
        .order('date', { ascending: false })
        .limit(limit);

    if (error) {
        console.error('Error fetching latest articles:', error);
        return [];
    }

    return data.map((item: any) => ({
        id: item.id,
        title: item.title,
        description: item.description || '',
        category: (item.category as any) || 'strength',
        tags: item.tags || [],
        duration: '5 min read', // Estimate or store
        difficulty: 'intermediate',
        thumbnailUrl: item.thumbnail_url || '',
        isPremium: item.is_premium,
        slug: item.slug
    }));
}

export async function getRelatedArticles(category: string, currentId: string, limit: number = 3): Promise<ContentItem[]> {
    const supabase = createClient();
    if (!supabase) return [];

    const { data, error } = await supabase
        .from('knowledge_base_articles')
        .select('id, title, description, category, thumbnail_url, tags, is_premium, slug')
        .eq('category', category)
        .neq('id', currentId)
        .limit(limit);

    if (error) {
        console.error('Error fetching related articles:', error);
        return [];
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
