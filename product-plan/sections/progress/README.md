# Progress

## Overview

The Progress section is where users visualize their long-term transformation. It combines hard data (analytics) with visual proof (photos) to keep users motivated.

## User Flows

- **Analyze Trends**: User views interactive charts to track body weight and strength metrics over time.
- **Side-by-Side Comparison**: User selects "Before" and "After" photos and uses a slider to visualize physical changes.
- **Review History**: User scrolls through a chronological timeline of completed workouts to see volume and PRs.

## Design Decisions

- **Visual Data**: Large charts and photo comparisons emphasize progress better than text.
- **Motivation**: Positive trend highlights (colors) reinforce consistency.

## Data Used

**Entities**:
- User (body stats)
- WorkoutSession (history)

## Components Provided

- `Progress` — Main container.
- `PhotoCompare` — Image comparison tool.
- `HistoryList` — Workout history feed.

## Callback Props

| Callback | Description |
|----------|-------------|
| `onAddPhoto` | Triggers photo upload/camera |
| `onViewHistoryItem` | Opens past workout detail |
| `onToggleMetric` | Switches chart view (Weight vs Strength) |
