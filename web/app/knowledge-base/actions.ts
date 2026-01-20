"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function toggleBookmarkAction(contentId: string, isBookmarked: boolean) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    if (isBookmarked) {
        // Remove bookmark
        const { error } = await supabase
            .from('knowledge_base_bookmarks')
            .delete()
            .eq('user_id', user.id)
            .eq('content_id', contentId);

        if (error) throw new Error("Failed to remove bookmark");
    } else {
        // Add bookmark
        const { error } = await supabase
            .from('knowledge_base_bookmarks')
            .upsert({
                user_id: user.id,
                content_id: contentId
            });

        if (error) throw new Error("Failed to add bookmark");
    }

    revalidatePath('/knowledge-base');
    return { success: true };
}

export async function searchContentAction(query: string) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('knowledge_base_content')
        .select('*')
        .ilike('title', `%${query}%`)
        .limit(20);

    if (error) throw new Error("Search failed");
    return data;
}
