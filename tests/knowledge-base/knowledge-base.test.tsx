import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { vi, describe, it, expect } from 'vitest'
import { KnowledgeBase } from '@/components/knowledge-base/KnowledgeBase'
import { KnowledgeBaseProps } from '@/lib/types'

const mockContentItem = {
    id: '1',
    title: 'How to Squat',
    description: 'Learn proper form for the squat.',
    category: 'strength' as const,
    tags: ['legs', 'compound'],
    duration: '5 min',
    difficulty: 'beginner' as const,
    thumbnailUrl: '/thumbnails/squat.jpg',
    videoUrl: '/videos/squat.mp4',
    isBookmarked: false
}

const mockData: KnowledgeBaseProps = {
    featured: [mockContentItem],
    categories: {
        strength: [mockContentItem],
        cardio: [],
        mobility: [],
        nutrition: [],
        recovery: []
    },
    bookmarked: [],
    onViewContent: vi.fn(),
    onSearch: vi.fn(),
    onBookmark: vi.fn()
}

describe('KnowledgeBase Component', () => {

    it('renders featured content correctly', () => {
        render(<KnowledgeBase {...mockData} />)
        expect(screen.getAllByText('How to Squat')[0]).toBeInTheDocument()
        expect(screen.getAllByText('Learn proper form for the squat.')[0]).toBeInTheDocument()
        expect(screen.getByText('Featured')).toBeInTheDocument()
    })

    it('renders category rails correctly', () => {
        render(<KnowledgeBase {...mockData} />)
        expect(screen.getByText('Strength Training')).toBeInTheDocument()
        // Should find the item in the rail as well (might be duplicate text if featured is same, so check strict context if needed, but simple check is okay for now)
    })

    it('fires onSearch callback', () => {
        render(<KnowledgeBase {...mockData} />)
        const input = screen.getByPlaceholderText(/search/i)
        fireEvent.change(input, { target: { value: 'deadlift' } })
        fireEvent.submit(input)
        expect(mockData.onSearch).toHaveBeenCalledWith('deadlift')
    })

    it('fires onViewContent callback', () => {
        render(<KnowledgeBase {...mockData} />)
        const playBtns = screen.getAllByText(/Play Now/i)
        fireEvent.click(playBtns[0])
        expect(mockData.onViewContent).toHaveBeenCalledWith('1')
    })

    it('fires onBookmark callback', () => {
        render(<KnowledgeBase {...mockData} />)
        const saveBtns = screen.getAllByText(/Save/i)
        fireEvent.click(saveBtns[0]) // Click first save button (featured)
        expect(mockData.onBookmark).toHaveBeenCalledWith('1')
    })
})
