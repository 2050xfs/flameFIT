# Dashboard

## Overview

The Dashboard is the user's daily command center. It answers "What do I need to do today?" and "How am I progressing?". It features high-level metrics, a readiness score, and a timeline of the day's events.

## User Flows

- **Check Readiness**: User views their daily recovery score (0-100) and status message to determine training intensity.
- **Track Macros**: User glances at ring indicators to see remaining calories, protein, carbs, and fats for the day.
- **Review Schedule**: User scrolls through the daily timeline to see upcoming meals and workouts.
- **Quick Action**: User taps a prominent "Quick Add" button to log food or start a workout immediately.

## Detailed Experience Checklist

1. **Load Sequence**
   - Fetch readiness, macro totals, and today's schedule in parallel.
   - Show skeletons for cards; avoid layout shift.
2. **Readiness Block**
   - Display score (0–100), status label, and short message.
   - Include a subtle "Why?" link/tooltip later for transparency.
3. **Macro Rings**
   - Each ring shows current vs target and remaining.
   - If target missing, display "Set target" callout.
4. **Timeline**
   - Sort by time.
   - Group items by type (meal/workout) visually but keep one list.
   - Identify current item (e.g., "Now" highlight).
5. **Quick Add**
   - Always visible, near top of fold.
   - Log context: prefill current time and meal slot.

## Design Decisions

- **Visual Hierarchy**: Readiness Score is the most prominent element to guide daily decisions.
- **Color Coding**: Used standard macro colors (Protein/Rose, Carbs/Amber, Fats/Teal) for instant recognition.
- **Micro-interactions**: Action buttons have haptic feedback visual cues.

## Data Used

**Entities:**
- User (goals)
- NutrientLog (daily totals)
- WorkoutSession (scheduled items)

**Derived fields:**
- `macroRemaining = target - current`
- `macroPercent = current / target`
- `nextScheduledItem` (time-based)

## Edge Cases & Error Handling

- **Missing readiness inputs**: Show "Calculating" with info tooltip.
- **No macros target**: Show zeroed rings with CTA to set goals.
- **Timezone changes**: Recompute "today" based on user locale.
- **Partial data**: Display sections independently (no global failure).

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

## Analytics & Instrumentation

- Track `dashboard_view` with data freshness timestamps.
- Track `quick_add_click` with category (food/workout).
- Track `timeline_item_open` with item type + scheduled time.
