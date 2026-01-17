# Kitchen

## Overview

The Kitchen is the nutrition command center of 'flameFit'. It provides real-time macro analytics, intelligent meal planning, and detailed recipe management.

## User Flows

- **Log Food**: User searches for a food item (or scans a barcode), adjusts serving size, and adds to daily log.
- **Track Progress**: User views "Macro Headboard" for immediate nutrient status vs targets.
- **Plan Meal**: User pre-fills nutrition for future dates via Meal Planner.
- **View Recipe**: User browses recipes for healthy meal ideas.

## Design Decisions

- **Macro Headboard**: Takes center stage to answer "What can I eat?" immediately.
- **Meal Stream**: Chronological view reinforces the timeline of nutrition.

## Data Used

**Entities**:
- NutrientLog
- FoodItem

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
