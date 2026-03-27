import { describe, it, expect, vi } from 'vitest'
import { getKitchenData } from '@/lib/api/kitchen'

// Mock Supabase
vi.mock('@/lib/supabase/server', () => ({
    createClient: vi.fn(() => ({
        auth: {
            getUser: vi.fn(() => Promise.resolve({ data: { user: { id: 'test-user' } } }))
        },
        from: vi.fn((table) => ({
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            single: vi.fn().mockReturnThis(),
            maybeSingle: vi.fn().mockReturnThis(),
            then: (callback: any) => {
                if (table === 'nutrient_logs') {
                    return Promise.resolve(callback({ data: [], error: null }))
                }
                if (table === 'water_logs') {
                    return Promise.resolve(callback({ data: { amount: 5 }, error: null }))
                }
                if (table === 'profiles') {
                    return Promise.resolve(callback({ data: { weight: 90 }, error: null }))
                }
                return Promise.resolve(callback({ data: null, error: null }))
            }
        }))
    }))
}))

describe('Kitchen API Integration', () => {
    it('getKitchenData calculates macro targets based on weight', async () => {
        const data = await getKitchenData()
        // weight 90kg * 35 cal/kg = 3150
        expect(data.macros.calories.target).toBe(3150)
    })

    it('getKitchenData fetches real water intake', async () => {
        const data = await getKitchenData()
        expect(data.waterIntake).toBe(5)
    })
})
