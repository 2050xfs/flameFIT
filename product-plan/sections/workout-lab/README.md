# Workout Lab

## Overview

The Workout Lab is where users build, manage, and execute their training plans. It acts as both a library of routines and the active launcher for training sessions.

## User Flows

- **Check Weekly Split**: User views the weekly calendar strip to see which muscle group is targeted today.
- **Preview Workout**: User taps "Today's Workout" card to see exercises, sets, and reps (Detail View).
- **Start Session**: User taps the primary "Start Workout" button to enter the active tracking mode.
- **Browse Library**: User explores past workouts or favorites to select an alternative routine.

## Design Decisions

- **Weekly Strip**: Provides quick context on the training cycle.
- **Active Card**: "Today's Workout" is elevated to encourage immediate action.

## Data Used

**Entities**:
- WorkoutSession (planned and active)
- Exercise (details)
- SetLog (history)

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
