# Progress

## Overview

The Progress section is where users visualize their long-term transformation. It combines hard data (analytics) with visual proof (photos) to keep users motivated.

## User Flows

- **Analyze Trends**: User views interactive charts to track body weight and strength metrics over time.
- **Side-by-Side Comparison**: User selects "Before" and "After" photos and uses a slider to visualize physical changes.
- **Review History**: User scrolls through a chronological timeline of completed workouts to see volume and PRs.

## Detailed Experience Checklist

1. **Charts**
   - Default to weight trend; allow metric toggles.
   - Show date range selector (last 4/8/12 weeks).
   - Highlight PRs or inflection points.
2. **Photos**
   - Allow capture/upload, auto-crop to consistent aspect.
   - Show timestamp and weight on each photo.
3. **History**
   - Show workout title, total volume, and PR counts.
   - Allow tap to drill into details.

## Design Decisions

- **Visual Data**: Large charts and photo comparisons emphasize progress better than text.
- **Motivation**: Positive trend highlights (colors) reinforce consistency.

## Data Used

**Entities**:
- User (body stats)
- WorkoutSession (history)

**Derived fields:**
- `weekly_avg_weight`
- `volume_trend_pct`
- `streak_count`

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

## Edge Cases & Error Handling

- **No photos yet**: show CTA and sample layout.
- **Sparse data**: show "Add more data to see trends".
- **Chart toggle unavailable**: disable toggle with tooltip.

## Analytics & Instrumentation

- Track `progress_view` with data range.
- Track `photo_added` with source (camera/upload).
- Track `metric_toggle` with selected metric.
