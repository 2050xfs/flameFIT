# flameFit — Product Overview

## Summary

A premium, AI-powered fitness command center that evolves with you. flameFit combines intelligent workout generation, precision nutrient tracking, and a rich video library into a unified, high-performance interface for dedicated athletes and fitness enthusiasts.

## Planned Sections

1. **Dashboard** — The central command center showing daily readiness, upcoming workouts, and a snapshot of nutrition targets.
2. **Workout Lab** — A comprehensive workspace to build routines, view the AI-generated schedule, and track active training sessions.
3. **Kitchen** — Advanced nutrition management interface for logging meals, tracking macros, and planning daily intake.
4. **Knowledge Base** — A visual library of exercises and educational content, filterable by muscle group and difficulty.
5. **Progress** — Deep-dive analytics dashboard visualizing strength trends, body composition changes, and consistency streaks.

## Data Model

- User
- WorkoutSession
- Exercise
- SetLog
- NutrientLog
- FoodItem

## Design System

**Colors:**
- Primary: orange
- Secondary: rose
- Neutral: stone

**Typography:**
- Heading: Outfit
- Body: Inter
- Mono: JetBrains Mono

## Implementation Sequence

Build this product in milestones:

1. **Foundation** — Set up design tokens, data model types, and application shell
2. **Dashboard** — Central hub for daily status and quick actions.
3. **Workout Lab** — Core training functionality.
4. **Kitchen** — Nutrition tracking and planning.
5. **Knowledge Base** — Educational content hub.
6. **Progress** — Analytics and long-term tracking.

Each milestone has a dedicated instruction document in `product-plan/instructions/`.
