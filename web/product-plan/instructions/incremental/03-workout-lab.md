# Milestone 3: Workout Lab

> **Provide alongside:** `product-overview.md`
> **Prerequisites:** Milestone 1 (Foundation) complete

---

## Goal

Implement the Workout Lab — a comprehensive workspace to build routines and launch training sessions.

## Recommended Approach: Test-Driven Development

See `product-plan/sections/workout-lab/tests.md` for detailed test-writing instructions.

## What to Implement

### Components

Copy the section components from `product-plan/sections/workout-lab/components/`:

- `WorkoutLab.tsx`
- `WorkoutCard.tsx`
- `ActiveSession.tsx` (if exported)
- `WorkoutDetails.tsx` (if exported)

**Step-by-step**
1. Render weekly strip and “Today’s Workout” card with placeholders.
2. Add conditional CTA for rest day vs. scheduled day.
3. Ensure session state (start/resume) is reflected in the card.

### Data Layer

The components expect these data shapes:
- `WorkoutSession` (for the plan)
- `Exercise` (for details)

You'll need to:
- Fetch the weekly workout split
- Fetch details for "Today's Workout"

**Step-by-step**
1. Fetch planned sessions for the current week (Mon–Sun).
2. Resolve “today” using user locale + timezone.
3. Preload exercise metadata for card previews.

### Callbacks

Wire up these user actions:
- `onStartWorkout`: Enter active mode (start timer, enable logging).
- `onViewWorkout`: Show the details of the exercises.
- `onBrowseLibrary`: Navigate to the full workout library.

**Step-by-step**
1. Create or resume session on start.
2. Store session ID for deep-linking active mode.
3. Track navigation events for analytics.

### Error/Empty States

- **No plan**: show “Create a plan” CTA.
- **Missing exercise info**: show placeholders without blocking UI.

## Done When

- [ ] Tests written for key user flows
- [ ] Weekly split renders correctly
- [ ] "Today's Workout" card shows correct data
- [ ] Start button initiates the session flow
- [ ] Empty states (Rest days) are handled
- [ ] Session resume is supported for active workouts
