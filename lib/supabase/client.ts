import { createClient as createClientJS } from '@supabase/supabase-js'
import type { Database } from '@/lib/api/supabase-types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
    // Only warn on client side to avoid build noise
    if (typeof window !== 'undefined') {
        console.warn('Missing Supabase environment variables')
    }
}

export function createClient() {
    return createClientJS<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL || '',
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    )
}
