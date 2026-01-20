import { describe, it, expect, vi } from 'vitest'
import { getKnowledgeBaseData } from '@/lib/api/knowledge-base'

// Mock Supabase
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
            then: (callback: any) => {
                if (table === 'knowledge_base_content') {
                    return Promise.resolve(callback({
                        data: [
                            {
                                id: 'kb1',
                                title: 'DB Exercise',
                                category: 'strength',
                                description: 'Test',
                                created_at: new Date().toISOString()
                            }
                        ],
                        error: null
                    }))
                }
                if (table === 'knowledge_base_bookmarks') {
                    return Promise.resolve(callback({
                        data: [{ content_id: 'kb1' }],
                        error: null
                    }))
                }
                return Promise.resolve(callback({ data: [], error: null }))
            }
        }))
    }))
}))

describe('Knowledge Base API Integration', () => {
    it('getKnowledgeBaseData fetches and marks bookmarked content', async () => {
        const data = await getKnowledgeBaseData()
        expect(data.categories.strength[0].title).toBe('DB Exercise')
        expect(data.categories.strength[0].isBookmarked).toBe(true)
    })

    it('getKnowledgeBaseData handles categories correctly', async () => {
        const data = await getKnowledgeBaseData()
        expect(data.categories.strength.length).toBe(1)
        expect(data.categories.nutrition.length).toBe(0)
    })
})
