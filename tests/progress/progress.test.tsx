import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { vi, describe, it, expect } from 'vitest'
import { Progress } from '@/components/progress/Progress'
import { ProgressProps } from '@/lib/types'

const mockData: ProgressProps['data'] = {
    charts: {
        weight: [
            { date: 'Jan 1', value: 180 },
            { date: 'Jan 8', value: 178 }
        ]
    },
    stats: [
        { label: 'Current Weight', value: '178', unit: 'lbs', trend: '-2', trendDir: 'up' },
        { label: 'Body Fat', value: '15', unit: '%' }
    ],
    photos: [
        { id: '1', url: '/p1.jpg', date: 'Jan 1' },
        { id: '2', url: '/p2.jpg', date: 'Jan 8' }
    ],
    history: [
        { id: '1', date: 'Today', title: 'Leg Day', volume: '10k', records: 1 }
    ]
}

describe('Progress Component', () => {

    it('renders stats tab by default', () => {
        render(<Progress data={mockData} />)
        expect(screen.getByText('Current Weight')).toBeInTheDocument()
        expect(screen.getByText('178')).toBeInTheDocument()
        expect(screen.getByText('Body Fat')).toBeInTheDocument()
    })

    it('switches to photos tab', () => {
        render(<Progress data={mockData} />)
        fireEvent.click(screen.getByText('Photos'))
        expect(screen.getByText('Jan 1')).toBeInTheDocument()
        expect(screen.getByText('Compare Side-by-Side')).toBeInTheDocument()
    })

    it('switches to history tab', () => {
        render(<Progress data={mockData} />)
        fireEvent.click(screen.getByText('History'))
        expect(screen.getByText('Leg Day')).toBeInTheDocument()
        expect(screen.getByText('1 PRs 🏆')).toBeInTheDocument()
    })

    it('calls onComparePhotos when clicking compare button', () => {
        const onCompare = vi.fn()
        render(<Progress data={mockData} onComparePhotos={onCompare} />)

        // Go to Photos tab first
        fireEvent.click(screen.getByText('Photos'))

        fireEvent.click(screen.getByText('Compare Side-by-Side'))
        expect(onCompare).toHaveBeenCalled()
    })

})
