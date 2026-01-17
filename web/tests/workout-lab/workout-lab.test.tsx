import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { WorkoutLab } from '@/components/workout-lab/WorkoutLab'
import { WorkoutLabProps } from '@/lib/types'

const mockDataWithWorkout: WorkoutLabProps = {
    currentPlan: {
        name: "Push Pull Legs",
        week: 4
    },
    weeklySchedule: [
        { day: "MON", date: "13", code: "PUSH", status: "completed" },
        { day: "TUE", date: "14", code: "PULL", status: "completed" },
        { day: "WED", date: "15", code: "LEGS", status: "active" },
        { day: "THU", date: "16", code: "REST", status: "upcoming" },
        { day: "FRI", date: "17", code: "PUSH", status: "upcoming" },
        { day: "SAT", date: "18", code: "PULL", status: "upcoming" },
        { day: "SUN", date: "19", code: "REST", status: "upcoming" }
    ],
    todaysWorkout: {
        id: "1",
        title: "Leg Day (Hypertrophy)",
        intensity: "High",
        duration: "75 min",
        muscles: ["Quads", "Hamstrings", "Glutes", "Calves"],
        exercises: [
            { name: "Barbell Squat", sets: 4, reps: "8-10" },
            { name: "Romanian Deadlift", sets: 3, reps: "10-12" },
            { name: "Bulgarian Split Squat", sets: 3, reps: "12/leg" }
        ]
    },
    upcomingWorkouts: [
        {
            id: "2",
            title: "Push Day (Strength)",
            intensity: "High",
            duration: "60 min",
            muscles: ["Chest", "Shoulders", "Triceps"],
            exercises: [
                { name: "Bench Press", sets: 4, reps: "6-8" }
            ],
            date: "17"
        }
    ],
    onStartWorkout: vi.fn(),
    onViewDetails: vi.fn()
}

const mockDataRestDay: WorkoutLabProps = {
    ...mockDataWithWorkout,
    todaysWorkout: null,
    upcomingWorkouts: []
}

describe('WorkoutLab Component', () => {

    it('Flow 1: Start Scheduled Workout - Displays today\'s workout correctly', () => {
        render(<WorkoutLab {...mockDataWithWorkout} />)

        // Verify workout title is visible
        expect(screen.getByText('Leg Day (Hypertrophy)')).toBeInTheDocument()

        // Verify intensity and duration
        expect(screen.getByText(/high intensity/i)).toBeInTheDocument()
        expect(screen.getByText('75 min')).toBeInTheDocument()

        // Verify exercises are shown
        expect(screen.getByText('Barbell Squat')).toBeInTheDocument()
        expect(screen.getByText('Romanian Deadlift')).toBeInTheDocument()
    })

    it('Flow 1: Start Scheduled Workout - Calls onStartWorkout with correct ID', () => {
        render(<WorkoutLab {...mockDataWithWorkout} />)

        const startButton = screen.getByRole('button', { name: /start workout/i })
        fireEvent.click(startButton)

        expect(mockDataWithWorkout.onStartWorkout).toHaveBeenCalledWith('1')
    })

    it('Flow 2: View Plan - Weekly schedule displays correctly', () => {
        render(<WorkoutLab {...mockDataWithWorkout} />)

        // Check all days are displayed
        expect(screen.getByText('MON')).toBeInTheDocument()
        expect(screen.getByText('TUE')).toBeInTheDocument()
        expect(screen.getByText('WED')).toBeInTheDocument()
        expect(screen.getByText('THU')).toBeInTheDocument()

        // Check dates
        expect(screen.getByText('13')).toBeInTheDocument()
        expect(screen.getByText('15')).toBeInTheDocument()

        // Check codes (using getAllByText since PUSH appears multiple times)
        expect(screen.getAllByText('PUSH').length).toBeGreaterThan(0)
        expect(screen.getAllByText('PULL').length).toBeGreaterThan(0)
        expect(screen.getByText('LEGS')).toBeInTheDocument()
        expect(screen.getAllByText('REST').length).toBeGreaterThan(0)
    })

    it('Flow 2: View Details - Calls onViewDetails when clicking View Details button', () => {
        render(<WorkoutLab {...mockDataWithWorkout} />)

        const viewButton = screen.getByRole('button', { name: /view details/i })
        fireEvent.click(viewButton)

        expect(mockDataWithWorkout.onViewDetails).toHaveBeenCalledWith('1')
    })

    it('Upcoming workouts section - Displays upcoming workouts', () => {
        render(<WorkoutLab {...mockDataWithWorkout} />)

        expect(screen.getByText('On Deck')).toBeInTheDocument()
        expect(screen.getByText('Push Day (Strength)')).toBeInTheDocument()
        expect(screen.getByText('⏱ 60 min')).toBeInTheDocument()
    })

    it('Upcoming workouts section - Calls onViewDetails when clicking workout card', () => {
        render(<WorkoutLab {...mockDataWithWorkout} />)

        const upcomingCard = screen.getByText('Push Day (Strength)').closest('div')
        if (upcomingCard) {
            fireEvent.click(upcomingCard)
            expect(mockDataWithWorkout.onViewDetails).toHaveBeenCalledWith('2')
        }
    })

    it('Empty State: Rest Day - Displays rest day message when no workout scheduled', () => {
        render(<WorkoutLab {...mockDataRestDay} />)

        expect(screen.getByText('Rest Day')).toBeInTheDocument()
        expect(screen.getByText(/Recovery is just as important as training/i)).toBeInTheDocument()

        // Check that rest day actions are available
        expect(screen.getByRole('button', { name: /browse library/i })).toBeInTheDocument()
        expect(screen.getByRole('button', { name: /create custom workout/i })).toBeInTheDocument()
    })

    it('Empty State: Rest Day - Does not display upcoming section when empty', () => {
        render(<WorkoutLab {...mockDataRestDay} />)

        expect(screen.queryByText('On Deck')).not.toBeInTheDocument()
    })

    it('Plan info - Displays current plan and week', () => {
        render(<WorkoutLab {...mockDataWithWorkout} />)

        expect(screen.getByText(/Push Pull Legs/i)).toBeInTheDocument()
        expect(screen.getByText(/Week 4/i)).toBeInTheDocument()
    })
})
