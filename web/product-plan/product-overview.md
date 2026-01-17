# flameFit — Product Overview

## Summary

A premium, AI-powered fitness command center that evolves with you. flameFit combines intelligent workout generation, precision nutrient tracking, and a rich video library into a unified, high-performance interface for dedicated athletes and fitness enthusiasts.

## Vision & Principles

- **Single source of truth** for training, nutrition, and recovery decisions.
- **Actionable at a glance**: every screen should answer "what should I do next?"
- **Data credibility**: surface when data is inferred vs. recorded.
- **Minimal friction**: the fastest path to logging must never be more than 2 taps.
- **AI as the body**: the system senses, predicts, and reacts on the user’s behalf.

## Primary Personas

1. **Dedicated Lifter**: Trains 4–6x/week, wants hypertrophy progress, relies on structured programs.
2. **Performance Hybrid**: Mixes strength + conditioning, cares about readiness and fatigue.
3. **Nutrition-First Athlete**: Macro tracking is primary, workouts are consistent but secondary.

## Planned Sections

1. **Dashboard** — The central command center showing daily readiness, upcoming workouts, and a snapshot of nutrition targets.
2. **Workout Lab** — A comprehensive workspace to build routines, view the AI-generated schedule, and track active training sessions.
3. **Kitchen** — Advanced nutrition management interface for logging meals, tracking macros, and planning daily intake.
4. **Knowledge Base** — A visual library of exercises and educational content, filterable by muscle group and difficulty.
5. **Progress** — Deep-dive analytics dashboard visualizing strength trends, body composition changes, and consistency streaks.

## Success Metrics

- **Daily active usage**: ≥ 3 meaningful interactions/day (log, view, start).
- **Logging speed**: food log completed in < 20 seconds for frequent items.
- **Workout adherence**: > 70% of scheduled sessions started within 2 hours of schedule.
- **Retention**: 40% weekly retention within first 30 days.

## Data Model

- User
- WorkoutSession
- Exercise
- SetLog
- NutrientLog
- FoodItem

## Data Sources & Dependencies

- **Supabase**: primary datastore for user content and logs.
- **Nutrition API**: CalorieNinjas for nutrient lookup; cache results in FoodItem.
- **Workout content**: `/workout inspo` PDF source; needs extraction + normalization.
- **AI adaptation**: see `product-plan/ai-body.md` for the sensing loop + adaptation rules.

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

## Non-Functional Requirements

- **Accessibility**: keyboard navigation, semantic labels, color-contrast ≥ WCAG AA.
- **Performance**: dashboard interactive under 2s on mid-range mobile device.
- **Reliability**: handle offline/partial data and recover gracefully.
- **Privacy**: restrict user data to account scope, avoid public exposure.

## Release Phases

1. **Internal Alpha**: mocked data replaced with live Supabase reads/writes.
2. **Private Beta**: nutrition + workout logging stabilized with analytics.
3. **Public Launch**: knowledge base content ingestion + progress tracking.
