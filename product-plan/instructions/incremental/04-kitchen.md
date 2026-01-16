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

### Data Layer

The components expect:
- `NutrientLog` (for the day)
- `FoodItem` (search results)

You'll need to:
- Implement food search via API (or local database)
- Aggregation of daily macros based on logged items

### Callbacks

Wire up these user actions:
- `onLogFood`: Handle the addition of food items to the log.
- `onScanBarcode`: Integrate with a barcode scanning library if available (or mock).
- `onViewRecipe`: Show recipe details.

## Done When

- [ ] Tests written for key user flows
- [ ] Macro Headboard updates as food is logged
- [ ] Meal Stream displays logged items chronologically
- [ ] Search functionality returns results
- [ ] Empty states (new day) are handled
