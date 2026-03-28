import { describe, it, expect, vi } from 'vitest'
import { getProgressData } from '@/lib/api/progress'

// Mock Supabase with a more flexible structure
vi.mock('@/lib/supabase/server', () => ({
    createClient: vi.fn(() => ({
        auth: {
            getUser: vi.fn(() => Promise.resolve({ data: { user: { id: 'test-user' } } }))
        },
        from: vi.fn((table) => ({
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            order: vi.fn().mockReturnThis(),
            limit: vi.fn().mockReturnThis(),
            single: vi.fn().mockReturnThis(),
            maybeSingle: vi.fn().mockReturnThis(),
            then: (callback: any) => {
                if (table === 'weight_logs') {
                    const data = [
                        { weight_kg: 190, date: '2024-01-10' },
                        { weight_kg: 185, date: '2024-01-17' }
                    ];
                    return Promise.resolve(callback({ data: data, error: null }))
                }
                if (table === 'body_stats') {
                    const data = [
                        { body_fat_pct: 15.5, date: '2024-01-10' },
                    ];
                    return Promise.resolve(callback({ data: data, error: null }))
                }
                if (table === 'workout_sessions') {
                    return Promise.resolve(callback({
                        data: [
                            {
                                id: 'w1',
                                name: 'Leg Day',
                                date: '2024-01-16',
                                set_logs: [
                                    { weight: 100, reps: 10 },
                                    { weight: 100, reps: 10 }
                                ]
                            }
                        ],
                        error: null
                    }))
                }
                return Promise.resolve(callback({ data: [], error: null }))
            }
        }))
    }))
}))

describe('Progress API Integration', () => {
    it('getProgressData aggregates workout volume correctly', async () => {
        const data = await getProgressData()
        expect(data.history[0].volume).toBe('2,000 lbs')
    })

    it('getProgressData fetches weight chart points', async () => {
        const data = await getProgressData()
        expect(data.charts.weight.length).toBeGreaterThan(0)
        expect(data.charts.weight[0].value).toBe(190)
    })
})
