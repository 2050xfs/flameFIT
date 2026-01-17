# Dashboard

## Overview

The Dashboard is the user's daily command center. It answers "What do I need to do today?" and "How am I progressing?". It features high-level metrics, a readiness score, and a timeline of the day's events.

## User Flows

- **Check Readiness**: User views their daily recovery score (0-100) and status message to determine training intensity.
- **Track Macros**: User glances at ring indicators to see remaining calories, protein, carbs, and fats for the day.
- **Review Schedule**: User scrolls through the daily timeline to see upcoming meals and workouts.
- **Quick Action**: User taps a prominent "Quick Add" button to log food or start a workout immediately.

## Design Decisions

- **Visual Hierarchy**: Readiness Score is the most prominent element to guide daily decisions.
- **Color Coding**: Used standard macro colors (Protein/Rose, Carbs/Amber, Fats/Teal) for instant recognition.
- **Micro-interactions**: Action buttons have haptic feedback visual cues.

## Data Used

**Entities:**
- User (goals)
- NutrientLog (daily totals)
- WorkoutSession (scheduled items)

## Visual Reference

See `screenshot.png` (if available) for the target UI design.

## Components Provided

- `Dashboard` — Main container component.
- `MacroCard` — Ring visualizations for nutrients.
- `ReadinessRing` — Circular recovery indicator.
- `TimelineItem` — List item for scheduled events.

## Callback Props

| Callback | Description |
|----------|-------------|
| `onQuickAdd` | Called when user taps "Quick Add" |
| `onStartWorkout` | Called when user starts a scheduled session |
| `onViewDetails` | Called when tapping a timeline item |
