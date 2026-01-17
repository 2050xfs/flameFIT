# Milestone 2: Dashboard

> **Provide alongside:** `product-overview.md`
> **Prerequisites:** Milestone 1 (Foundation) complete

---

## Goal

Implement the Dashboard feature — the central command center showing daily readiness and quick actions.

## Overview

The Dashboard is the user's daily command center. It answers "What do I need to do today?" and "How am I progressing?". It features high-level metrics, a readiness score, and a timeline of the day's events.

## Recommended Approach: Test-Driven Development

Before implementing this section, **write tests first** based on the test specifications provided.

See `product-plan/sections/dashboard/tests.md` for detailed test-writing instructions.

## What to Implement

### Components

Copy the section components from `product-plan/sections/dashboard/components/`:

- `Dashboard.tsx`
- `MacroCard.tsx` (and other sub-components)

**Step-by-step**
1. Render dashboard with placeholder data.
2. Add skeleton/loading states for readiness and macros.
3. Ensure macro rings handle zero/undefined targets.

### Data Layer

The components expect these data shapes (see `types.ts`):
- User (name, goals)
- NutrientLog (daily totals)
- WorkoutSession (today's schedule)

You'll need to:
- Fetch today's readiness score (calculated or mocked initially)
- Fetch today's nutrition totals
- Fetch today's scheduled workout

**Step-by-step**
1. Create a single dashboard query handler.
2. Merge readiness, macros, and timeline data in one response.
3. Implement caching for repeated visits in a day.

### Callbacks

Wire up these user actions:
- `onQuickAdd`: Open a modal or navigate to a quick log screen.
- `onStartWorkout`: Navigate to the active session view for the specific workout.
- `onViewDetails`: Navigate to details for a specific timeline item.

**Step-by-step**
1. Wire callbacks to route transitions.
2. Provide optimistic UI feedback on action.
3. Track analytics events for primary actions.

### Empty States

- **No Data Today**: Show 0s for macros, "Calculating" for readiness if needed, and a clear timeline stating "Nothing scheduled".

### Error States

- **Readiness failure**: show retry on readiness card only.
- **Nutrition failure**: show "No macro data" message with CTA.

## Done When

- [ ] Tests written for key user flows
- [ ] Components render with real data (or mock API data)
- [ ] "Quick Add" triggers correct action
- [ ] Timeline displays scheduled items
- [ ] Empty states display properly
- [ ] Matches the visual design
- [ ] Error states do not block other panels
