# Data Model

## Entities

### User
The core profile containing physical stats (height, weight), fitness goals, and preferences.

### WorkoutSession
A specific training instance, whether planned or completed, containing a date, duration, and list of exercises.

### Exercise
A reference entity representing a specific movement (e.g., "Bench Press"), including target muscle groups and video URL.

### SetLog
The performance data for a single set, linking an Exercise to a WorkoutSession with weight, reps, and RPE.

### NutrientLog
A daily record of food intake, aggregated into total calories, protein, carbs, and fats.

### FoodItem
A reference database item for ingredients or meals with associated macro-nutrient values.

## Relationships

- User has many WorkoutSessions
- User has many NutrientLogs
- WorkoutSession has many SetLogs
- SetLog belongs to WorkoutSession and Exercise
- NutrientLog belongs to User
- NutrientLog has many FoodItems (as entries)
