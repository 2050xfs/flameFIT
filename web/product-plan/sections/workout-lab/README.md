# Workout Lab

## Overview

The Workout Lab is where users build, manage, and execute their training plans. It acts as both a library of routines and the active launcher for training sessions.

## User Flows

- **Check Weekly Split**: User views the weekly calendar strip to see which muscle group is targeted today.
- **Preview Workout**: User taps "Today's Workout" card to see exercises, sets, and reps (Detail View).
- **Start Session**: User taps the primary "Start Workout" button to enter the active tracking mode.
- **Browse Library**: User explores past workouts or favorites to select an alternative routine.

## Detailed Experience Checklist

1. **Weekly Strip Rendering**
   - Highlight current day and show focus muscle group.
   - Tap day to preview planned workout; show tooltip for rest day.
2. **Today's Workout Card**
   - Show title, duration estimate, number of exercises, intensity.
   - Display plan status: scheduled, completed, skipped.
3. **Session Launch**
   - On start, create session if not already created.
   - Lock in exercises + sets for tracking.
4. **Library Browse**
   - Provide filters: goal, equipment, difficulty.
   - Allow “swap workout” action to reschedule.

## Design Decisions

- **Weekly Strip**: Provides quick context on the training cycle.
- **Active Card**: "Today's Workout" is elevated to encourage immediate action.

## Data Used

**Entities**:
- WorkoutSession (planned and active)
- Exercise (details)
- SetLog (history)

**Derived fields:**
- `estimated_duration` based on sets and rest intervals.
- `completion_rate` from prior sessions.
- `recovery_flag` from readiness (optional).

## Edge Cases & Error Handling

- **No workout planned**: show "Rest Day" with suggestion card.
- **Session already active**: show "Resume" instead of "Start".
- **Missing exercise metadata**: show fallback text + icon.

## Components Provided

- `WorkoutLab` — Main container.
- `WorkoutCard` — Preview card for workouts.
- `WeeklySplit` — Day-of-week visualization.

## Callback Props

| Callback | Description |
|----------|-------------|
| `onStartWorkout` | Initiates the active session |
| `onViewWorkout` | Opens detailed workout view |
| `onBrowseLibrary` | Navigates to full workout library |

## Analytics & Instrumentation

- Track `workout_lab_view` with planned vs actual session status.
- Track `start_workout_click` with program ID.
- Track `swap_workout` when user selects an alternative routine.
