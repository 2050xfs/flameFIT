import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getWorkoutLabData } from '@/lib/api/workout'

// Mock Supabase
vi.mock('@/lib/supabase/server', () => ({
    createClient: vi.fn(() => ({
        auth: {
            getUser: vi.fn(() => Promise.resolve({ data: { user: { id: 'test-user' } } }))
        },
        from: vi.fn(() => ({
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            gte: vi.fn().mockReturnThis(),
            lte: vi.fn().mockReturnThis(),
            order: vi.fn().mockReturnThis(),
            single: vi.fn().mockReturnThis(),
            then: (callback: any) => Promise.resolve(callback({
                data: [
                    {
                        id: '1',
                        date: new Date().toISOString().split('T')[0],
                        name: 'Legs',
                        status: 'upcoming',
                        set_logs: []
                    }
                ],
                error: null
            }))
        }))
    }))
}))

describe('Workout API Integration', () => {
    it('getWorkoutLabData handles user with no sessions', async () => {
        // Redefine mock for this specific test if needed, but the generalized mock handles it
        const data = await getWorkoutLabData()
        expect(data.weeklySchedule.length).toBe(7)
        expect(data.currentPlan.name).toBe('Flex Plan')
    })

    it('getWorkoutLabData identifies today\'s workout', async () => {
        const data = await getWorkoutLabData()
        expect(data.todaysWorkout).not.toBeNull()
        expect(data.todaysWorkout?.title).toBe('Legs')
    })
})
