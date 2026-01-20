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
            then: (callback: any) => {
                if (table === 'nutrient_logs') {
                    return Promise.resolve(callback({ data: [], error: null }))
                }
                if (table === 'water_logs') {
                    return Promise.resolve(callback({ data: { amount: 5 }, error: null }))
                }
                if (table === 'profiles') {
                    return Promise.resolve(callback({ data: { weight_lbs: 200 }, error: null }))
                }
                return Promise.resolve(callback({ data: null, error: null }))
            }
        }))
    }))
}))

describe('Kitchen API Integration', () => {
    it('getKitchenData calculates macro targets based on weight', async () => {
        const data = await getKitchenData()
        // weight 200 * 15 = 3000
        expect(data.macros.calories.target).toBe(3000)
    })

    it('getKitchenData fetches real water intake', async () => {
        const data = await getKitchenData()
        expect(data.waterIntake).toBe(5)
    })
})
