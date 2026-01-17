# Milestone 6: Progress

> **Provide alongside:** `product-overview.md`
> **Prerequisites:** Milestone 1 (Foundation) complete

---

## Goal

Implement the Progress section — analytics dashboard and photo comparison.

## Recommended Approach: Test-Driven Development

See `product-plan/sections/progress/tests.md` for detailed test-writing instructions.

## What to Implement

### Components

Copy the section components from `product-plan/sections/progress/components/`:

- `Progress.tsx`
- `PhotoCompare.tsx` (sub-component)
- `HistoryList.tsx` (sub-component)

**Step-by-step**
1. Render charts with placeholder data.
2. Add photo comparison with selectable dates.
3. Render history list grouped by week/month.

### Data Layer

The components expect:
- User body stats history (weight logs)
- Workout execution history (for volume/consistency trends)
- Photo library

You'll need to:
- Aggregate historical data for charts
- Handle photo uploading and storage (backend)

**Step-by-step**
1. Create a `body_stats` table or equivalent for weight logs.
2. Compute rolling averages for smoother charts.
3. Store photo metadata (date, weight, notes).

### Callbacks

Wire up these user actions:
- `onAddPhoto`: Trigger upload flow.
- `onViewHistoryItem`: Navigate to past workout details.
- `onToggleMetric`: Switch the chart data source.

**Step-by-step**
1. Persist selected metric in local state or user preferences.
2. Provide smooth chart transitions.
3. Track usage analytics for metric switching.

### Error/Empty States

- **No history**: show CTA to complete first workout.
- **No photos**: show CTA to add starting photo.
- **Upload failure**: show retry flow with progress indicator.

## Done When

- [ ] Tests written for comparison flow and charts
- [ ] Analytics charts render historical data
- [ ] Photo comparison slider works
- [ ] History list shows accurate timestamps and stats
- [ ] Empty states (no history) handled
- [ ] Metric toggle persists across navigation
