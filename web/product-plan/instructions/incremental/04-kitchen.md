# Milestone 4: Kitchen

> **Provide alongside:** `product-overview.md`
> **Prerequisites:** Milestone 1 (Foundation) complete

---

## Goal

Implement the Kitchen — advanced nutrition management for logging meals and tracking macros.

## Recommended Approach: Test-Driven Development

See `product-plan/sections/kitchen/tests.md` for detailed test-writing instructions.

## What to Implement

### Components

Copy the section components from `product-plan/sections/kitchen/components/`:

- `Kitchen.tsx`
- `MacroHeadboard.tsx` (sub-component)
- `FoodLogger.tsx` (sub-component)
- `MealPlanner.tsx` (sub-component)

**Step-by-step**
1. Render headboard with macro targets + remaining values.
2. Implement a food search panel with results list.
3. Add meal planner view for future days.

### Data Layer

The components expect:
- `NutrientLog` (for the day)
- `FoodItem` (search results)

You'll need to:
- Implement food search via API (or local database)
- Aggregation of daily macros based on logged items

**Step-by-step**
1. Create a `NutrientLog` for the current date if none exists.
2. Add `NutrientLogItem` entries for each logged food.
3. Recalculate totals after each insert/delete.
4. Cache recent foods to reduce API calls.

### Callbacks

Wire up these user actions:
- `onLogFood`: Handle the addition of food items to the log.
- `onScanBarcode`: Integrate with a barcode scanning library if available (or mock).
- `onViewRecipe`: Show recipe details.

**Step-by-step**
1. Validate servings and units before logging.
2. Provide optimistic updates with rollback on failure.
3. Track analytics for search and logging.

### Error/Empty States

- **No macro targets**: show CTA to set goals.
- **API search error**: show retry with cached results.
- **New day**: show empty stream and starter tips.

## Done When

- [ ] Tests written for key user flows
- [ ] Macro Headboard updates as food is logged
- [ ] Meal Stream displays logged items chronologically
- [ ] Search functionality returns results
- [ ] Empty states (new day) are handled
- [ ] Unit conversions display correctly
