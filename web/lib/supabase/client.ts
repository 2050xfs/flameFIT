import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/lib/api/supabase-types'

export function createClient() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
        // Only warn on client side to avoid build noise
        if (typeof window !== 'undefined') {
            console.warn('Missing Supabase environment variables')
        }
        // Return a dummy client to prevent crashes
        return null as any
    }

    return createBrowserClient<Database>(
        supabaseUrl,
        supabaseAnonKey
    )
}

