'use client'

import { useQuery } from '@tanstack/react-query'
import { getUserProfile } from '@/lib/api'

export function useUserData() {
    return useQuery({
        queryKey: ['user-profile'],
        queryFn: async () => {
            return getUserProfile()
        },
        staleTime: 1000 * 60 * 5, // 5 minutes
    })
}
