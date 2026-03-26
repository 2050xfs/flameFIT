"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function logWeightAction(weight: number, bodyFat?: number) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    const today = new Date().toISOString().split('T')[0];

    // Upsert into weight_logs (one entry per user per day)
    const { error } = await supabase
        .from('weight_logs')
        .upsert(
            { user_id: user.id, date: today, weight_kg: weight },
            { onConflict: 'user_id,date' }
        );

    if (error) {
        console.error("Log Weight Error:", error);
        throw new Error("Failed to log weight");
    }

    // Keep profile current weight in sync
    await supabase
        .from('profiles')
        .update({ weight })
        .eq('id', user.id);

    revalidatePath('/progress');
    revalidatePath('/dashboard');
    return { success: true };
}

export async function uploadProgressPhotoAction(formData: FormData): Promise<{ url: string; id: string }> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    const file = formData.get('photo') as File;
    if (!file || file.size === 0) throw new Error("No file provided");

    const maxSize = 10 * 1024 * 1024; // 10 MB
    if (file.size > maxSize) throw new Error("File too large (max 10 MB)");

    const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const allowed = ['jpg', 'jpeg', 'png', 'webp', 'heic'];
    if (!allowed.includes(ext)) throw new Error("Unsupported file type");

    const date = new Date().toISOString().split('T')[0];
    const storagePath = `${user.id}/${date}-${Date.now()}.${ext}`;

    const { error: uploadError } = await supabase.storage
        .from('progress-photos')
        .upload(storagePath, file, { contentType: file.type, upsert: false });

    if (uploadError) {
        console.error("Upload Error:", uploadError);
        throw new Error("Upload failed — ensure storage bucket exists");
    }

    const { data: { publicUrl } } = supabase.storage
        .from('progress-photos')
        .getPublicUrl(storagePath);

    const label = (formData.get('label') as string) || null;
    const photoDate = (formData.get('photo_date') as string) || date;

    const { data: record, error: dbError } = await supabase
        .from('progress_photos')
        .insert({
            user_id: user.id,
            storage_path: storagePath,
            public_url: publicUrl,
            photo_date: photoDate,
            label,
        })
        .select('id')
        .single();

    if (dbError) {
        console.error("DB insert error:", dbError);
        // Not fatal — URL still available
    }

    revalidatePath('/progress');
    return { url: publicUrl, id: record?.id || '' };
}

export async function getProgressPhotosAction(): Promise<{ id: string; url: string; date: string; label: string | null }[]> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
        .from('progress_photos')
        .select('id, public_url, photo_date, label')
        .eq('user_id', user.id)
        .order('photo_date', { ascending: false })
        .limit(20);

    if (error || !data) return [];

    return data.map(p => ({
        id: p.id,
        url: p.public_url,
        date: p.photo_date,
        label: p.label,
    }));
}
