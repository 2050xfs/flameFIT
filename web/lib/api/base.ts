import { createClient } from "@/lib/supabase/client";
import { PostgrestError } from "@supabase/supabase-js";

export class ApiError extends Error {
    constructor(public message: string, public status?: number, public code?: string) {
        super(message);
        this.name = 'ApiError';
    }
}

export async function getSession() {
    const supabase = createClient();
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw new ApiError(error.message);
    return session;
}

export async function getUser() {
    const session = await getSession();
    if (!session?.user) throw new ApiError("Unauthorized", 401);
    return session.user;
}

export async function getUserProfile() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new ApiError("Unauthorized", 401);

    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

    if (error) throw new ApiError(error.message);
    return data;
}

export function handleSupabaseError(error: PostgrestError | null) {
    if (error) {
        console.error("Supabase Error:", error);
        throw new ApiError(error.message, 500, error.code);
    }
}

export const commonHeaders = {
    'Content-Type': 'application/json',
};
