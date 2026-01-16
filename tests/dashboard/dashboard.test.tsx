import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { Dashboard } from '@/components/dashboard/Dashboard'
import { DashboardProps } from '@/lib/types'

const mockData: DashboardProps = {
    readiness: {
        score: 85,
        status: 'High Readiness',
        message: 'You are recovered and ready to train.'
    },
    macros: {
        calories: { current: 1500, target: 2500 },
        protein: { current: 120, target: 180 },
        carbs: { current: 150, target: 250 },
        fats: { current: 50, target: 80 }
    },
    timeline: [
        { id: '1', time: '08:00 AM', title: 'Breakfast', type: 'meal', status: 'completed', details: 'Oatmeal & Protein Shake' },
        { id: '2', time: '05:00 PM', title: 'Push Workout', type: 'workout', status: 'upcoming', details: 'Chest & Triceps Focus' }
    ],
    onStartWorkout: vi.fn(),
    onLogMeal: vi.fn(),
    onViewDetails: vi.fn()
}

describe('Dashboard Component', () => {

    it('Flow 1: Check Daily Status - Displays readiness and macros correctly', () => {
        render(<Dashboard {...mockData} />)

        // Verifying Readiness
        expect(screen.getByText('85')).toBeInTheDocument()
        expect(screen.getByText('High Readiness')).toBeInTheDocument()

        // Verifying Macros
        expect(screen.getByText('120')).toBeInTheDocument() // Protein current
        expect(screen.getByText('/ 180g')).toBeInTheDocument() // Protein target
    })

    it('Flow 1: Check Daily Status - Displays timeline correctly', () => {
        render(<Dashboard {...mockData} />)

        expect(screen.getByText('Breakfast')).toBeInTheDocument()
        expect(screen.getByText('Push Workout')).toBeInTheDocument()
        expect(screen.getByText('completed')).toBeInTheDocument()
        expect(screen.getByText('upcoming')).toBeInTheDocument()
    })

    it('Flow 2: Quick Add Action - Fires callbacks correctly', () => {
        render(<Dashboard {...mockData} />)

        const quickAddBtn = screen.getByText('Quick Add')
        fireEvent.click(quickAddBtn)
        expect(mockData.onLogMeal).toHaveBeenCalled()

        const startWorkoutBtn = screen.getByText('Start Workout')
        fireEvent.click(startWorkoutBtn)
        expect(mockData.onStartWorkout).toHaveBeenCalled()
    })

    it('Empty State: Displays 0s and empty message', () => {
        const emptyData = {
            ...mockData,
            readiness: { ...mockData.readiness, score: 0, status: 'Low Recovery' as const },
            macros: {
                calories: { current: 0, target: 2500 },
                protein: { current: 0, target: 180 },
                carbs: { current: 0, target: 250 },
                fats: { current: 0, target: 80 }
            },
            timeline: []
        }

        render(<Dashboard {...emptyData} />)

        // Check that readiness shows 0
        expect(screen.getAllByText('0').length).toBeGreaterThan(0)

        // Check that empty state message is shown for timeline
        expect(screen.getByText('Nothing Scheduled')).toBeInTheDocument()
        expect(screen.getByText('Your day is wide open. Add a workout or meal to get started.')).toBeInTheDocument()
    })
})
