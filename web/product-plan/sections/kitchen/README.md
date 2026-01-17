# Kitchen

## Overview

The Kitchen is the nutrition command center of 'flameFit'. It provides real-time macro analytics, intelligent meal planning, and detailed recipe management.

## User Flows

- **Log Food**: User searches for a food item (or scans a barcode), adjusts serving size, and adds to daily log.
- **Track Progress**: User views "Macro Headboard" for immediate nutrient status vs targets.
- **Plan Meal**: User pre-fills nutrition for future dates via Meal Planner.
- **View Recipe**: User browses recipes for healthy meal ideas.

## Detailed Experience Checklist

1. **Food Search**
   - Query local cache first, then API fallback.
   - Show recent/frequent foods at top.
2. **Serving Adjustments**
   - Allow units (g, oz, serving) with conversion.
   - Update macro totals in real time.
3. **Logging**
   - Apply to meal slot (breakfast/lunch/dinner/snack).
   - Update daily totals and streaks immediately.
4. **Meal Planning**
   - Allow future date logging and copy-paste between days.
5. **Recipe View**
   - Show ingredients, macros per serving, and save to favorites.

## Design Decisions

- **Macro Headboard**: Takes center stage to answer "What can I eat?" immediately.
- **Meal Stream**: Chronological view reinforces the timeline of nutrition.

## Data Used

**Entities**:
- NutrientLog
- FoodItem

**Derived fields:**
- `remaining_calories`, `remaining_macros`
- `meal_slot_totals` for each meal

## Components Provided

- `Kitchen` — Main container.
- `MacroHeadboard` — Nutrient visualization.
- `FoodLogger` — Search and add interface.
- `MealPlanner` — Future planning interface.

## Callback Props

| Callback | Description |
|----------|-------------|
| `onLogFood` | Opens logging interface |
| `onScanBarcode` | Triggers camera/scanner |
| `onViewRecipe` | Opens recipe details |

## Edge Cases & Error Handling

- **API search fails**: show cached results + retry.
- **No macro targets**: display "Set targets" CTA.
- **Water tracking missing**: show placeholder and input.

## Analytics & Instrumentation

- Track `food_search` with query length and results count.
- Track `food_logged` with calories + meal slot.
- Track `meal_plan_add` with date offset.
