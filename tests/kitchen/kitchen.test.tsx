import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { Kitchen } from '@/components/kitchen/Kitchen'
import { KitchenProps } from '@/lib/types'

const mockDataWithMeals: KitchenProps = {
    macros: {
        calories: { current: 1250, target: 2800 },
        protein: { current: 110, target: 200 },
        carbs: { current: 140, target: 300 },
        fats: { current: 45, target: 90 }
    },
    meals: [
        {
            id: '1',
            time: '08:00',
            mealType: 'breakfast',
            foodName: 'Oatmeal with Berries & Protein',
            calories: 450,
            protein: 35,
            carbs: 55,
            fats: 12,
            servingSize: '1 bowl'
        },
        {
            id: '2',
            time: '13:00',
            mealType: 'lunch',
            foodName: 'Grilled Chicken Salad',
            calories: 400,
            protein: 40,
            carbs: 30,
            fats: 15,
            servingSize: '300g'
        }
    ],
    waterIntake: 5,
    waterTarget: 8,
    onLogFood: vi.fn(),
    onScanBarcode: vi.fn(),
    onAddWater: vi.fn(),
    onViewMeal: vi.fn()
}

const mockDataEmpty: KitchenProps = {
    ...mockDataWithMeals,
    macros: {
        calories: { current: 0, target: 2800 },
        protein: { current: 0, target: 200 },
        carbs: { current: 0, target: 300 },
        fats: { current: 0, target: 90 }
    },
    meals: [],
    waterIntake: 0
}

describe('Kitchen Component', () => {

    it('Flow 1: Log a Meal - Displays macro headboard correctly', () => {
        render(<Kitchen {...mockDataWithMeals} />)

        // Verify macro headboard is visible
        expect(screen.getByText("Today's Macros")).toBeInTheDocument()

        // Verify macro values
        expect(screen.getByText('1250')).toBeInTheDocument() // calories current
        expect(screen.getByText('110')).toBeInTheDocument() // protein current
        expect(screen.getByText('140')).toBeInTheDocument() // carbs current
        expect(screen.getByText('45')).toBeInTheDocument() // fats current
    })

    it('Flow 1: Log a Meal - Displays meal stream with entries', () => {
        render(<Kitchen {...mockDataWithMeals} />)

        // Verify meal stream header
        expect(screen.getByText('Meal Stream')).toBeInTheDocument()
        expect(screen.getByText('2 entries today')).toBeInTheDocument()

        // Verify meals are displayed
        expect(screen.getByText('Oatmeal with Berries & Protein')).toBeInTheDocument()
        expect(screen.getByText('Grilled Chicken Salad')).toBeInTheDocument()

        // Verify meal details
        expect(screen.getByText('450 cal')).toBeInTheDocument()
        expect(screen.getByText('400 cal')).toBeInTheDocument()
    })

    it('Flow 1: Log a Meal - Calls onLogFood when clicking Smart Add', () => {
        render(<Kitchen {...mockDataWithMeals} />)

        const smartAddButton = screen.getByRole('button', { name: /smart add/i })
        fireEvent.click(smartAddButton)

        expect(mockDataWithMeals.onLogFood).toHaveBeenCalled()
    })

    it('Flow 1: Log a Meal - Calls onViewMeal when clicking meal entry', () => {
        render(<Kitchen {...mockDataWithMeals} />)

        const mealEntry = screen.getByText('Oatmeal with Berries & Protein')
        fireEvent.click(mealEntry)

        expect(mockDataWithMeals.onViewMeal).toHaveBeenCalledWith('1')
    })

    it('Barcode scan - Calls onScanBarcode when clicking Scan button', () => {
        render(<Kitchen {...mockDataWithMeals} />)

        const scanButton = screen.getByRole('button', { name: /scan/i })
        fireEvent.click(scanButton)

        expect(mockDataWithMeals.onScanBarcode).toHaveBeenCalled()
    })

    it('Flow 2: Check Hydration - Displays water tracker correctly', () => {
        render(<Kitchen {...mockDataWithMeals} />)

        // Verify water tracker is visible
        expect(screen.getByText(/hydration/i)).toBeInTheDocument()
        expect(screen.getByText(/5\/8 glasses/i)).toBeInTheDocument()

        // Verify glasses remaining message
        expect(screen.getByText(/3 more glasses to go!/i)).toBeInTheDocument()
    })

    it('Flow 2: Check Hydration - Calls onAddWater when clicking Add Glass', () => {
        render(<Kitchen {...mockDataWithMeals} />)

        const addWaterButton = screen.getByRole('button', { name: /add glass/i })
        fireEvent.click(addWaterButton)

        expect(mockDataWithMeals.onAddWater).toHaveBeenCalled()
    })

    it('Flow 2: Check Hydration - Shows goal reached message when target met', () => {
        const dataWithFullWater = {
            ...mockDataWithMeals,
            waterIntake: 8
        }

        render(<Kitchen {...dataWithFullWater} />)

        expect(screen.getByText(/hydration goal reached!/i)).toBeInTheDocument()
    })

    it('Quick Stats - Displays meals logged count', () => {
        render(<Kitchen {...mockDataWithMeals} />)

        expect(screen.getByText('Quick Stats')).toBeInTheDocument()
        expect(screen.getByText('Meals Logged')).toBeInTheDocument()
        expect(screen.getByText('2')).toBeInTheDocument()
    })

    it('Quick Stats - Calculates average meal size correctly', () => {
        render(<Kitchen {...mockDataWithMeals} />)

        expect(screen.getByText('Avg Meal Size')).toBeInTheDocument()
        // 1250 total calories / 2 meals = 625 cal per meal
        expect(screen.getByText('625 cal')).toBeInTheDocument()
    })

    it('Empty State: New Day - Shows no meals logged message', () => {
        render(<Kitchen {...mockDataEmpty} />)

        expect(screen.getByText('No Meals Logged')).toBeInTheDocument()
        expect(screen.getByText(/Start tracking your nutrition/i)).toBeInTheDocument()
    })

    it('Empty State: New Day - Shows log first meal button', () => {
        render(<Kitchen {...mockDataEmpty} />)

        const logButton = screen.getByRole('button', { name: /log first meal/i })
        expect(logButton).toBeInTheDocument()

        fireEvent.click(logButton)
        expect(mockDataEmpty.onLogFood).toHaveBeenCalled()
    })

    it('Empty State: New Day - Shows 0/Target for all macros', () => {
        render(<Kitchen {...mockDataEmpty} />)

        // Verify macros show 0
        expect(screen.getByText('0/2800kcal')).toBeInTheDocument()
        expect(screen.getByText('0/200g')).toBeInTheDocument()
        expect(screen.getByText('0/300g')).toBeInTheDocument()
        expect(screen.getByText('0/90g')).toBeInTheDocument()
    })

    it('Empty State: New Day - Shows water tracker at 0', () => {
        render(<Kitchen {...mockDataEmpty} />)

        expect(screen.getByText(/0\/8 glasses/i)).toBeInTheDocument()
    })

    it('Meal type badges - Display correct colors and labels', () => {
        render(<Kitchen {...mockDataWithMeals} />)

        expect(screen.getByText('breakfast')).toHaveClass('bg-amber-100')
        expect(screen.getByText('lunch')).toHaveClass('bg-emerald-100')
    })
})
