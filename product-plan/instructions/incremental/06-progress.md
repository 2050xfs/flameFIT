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

### Data Layer

The components expect:
- User body stats history (weight logs)
- Workout execution history (for volume/consistency trends)
- Photo library

You'll need to:
- Aggregate historical data for charts
- Handle photo uploading and storage (backend)

### Callbacks

Wire up these user actions:
- `onAddPhoto`: Trigger upload flow.
- `onViewHistoryItem`: Navigate to past workout details.
- `onToggleMetric`: Switch the chart data source.

## Done When

- [ ] Tests written for comparison flow and charts
- [ ] Analytics charts render historical data
- [ ] Photo comparison slider works
- [ ] History list shows accurate timestamps and stats
- [ ] Empty states (no history) handled
