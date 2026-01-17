# Data Model

## Entities

### User
The core profile containing physical stats (height, weight), fitness goals, and preferences.

**Recommended fields**
- `id` (UUID, PK)
- `email` (unique)
- `display_name`
- `height_cm`, `weight_kg`, `body_fat_pct` (optional)
- `goal_type` (enum: strength, hypertrophy, fat_loss, endurance, recomposition)
- `preferred_units` (metric/imperial)
- `created_at`, `updated_at`

### WorkoutSession
A specific training instance, whether planned or completed, containing a date, duration, and list of exercises.

**Recommended fields**
- `id` (UUID, PK)
- `user_id` (FK)
- `scheduled_for` (date/time)
- `started_at`, `completed_at`
- `title`, `plan_id` (nullable)
- `status` (scheduled, active, completed, skipped)
- `notes` (optional)

### Exercise
A reference entity representing a specific movement (e.g., "Bench Press"), including target muscle groups and video URL.

**Recommended fields**
- `id` (UUID, PK)
- `name`
- `primary_muscle_group`
- `secondary_muscle_groups` (array)
- `equipment` (barbell, dumbbell, machine, bodyweight)
- `difficulty` (beginner, intermediate, advanced)
- `media_url` (optional)

### SetLog
The performance data for a single set, linking an Exercise to a WorkoutSession with weight, reps, and RPE.

**Recommended fields**
- `id` (UUID, PK)
- `session_id` (FK)
- `exercise_id` (FK)
- `order_index` (for UI ordering)
- `reps`, `weight`, `rpe` (optional)
- `is_warmup` (boolean)
- `completed_at` (timestamp)

### NutrientLog
A daily record of food intake, aggregated into total calories, protein, carbs, and fats.

**Recommended fields**
- `id` (UUID, PK)
- `user_id` (FK)
- `log_date` (date)
- `total_calories`, `total_protein_g`, `total_carbs_g`, `total_fats_g`
- `water_ml` (optional)
- `created_at`, `updated_at`

### FoodItem
A reference database item for ingredients or meals with associated macro-nutrient values.

**Recommended fields**
- `id` (UUID, PK)
- `name`
- `brand` (optional)
- `serving_size_g`
- `calories`, `protein_g`, `carbs_g`, `fats_g`
- `source` (calorie_ninjas, manual, custom)
- `created_at`, `updated_at`

### NutrientLogItem (Join Table)
Represents a food entry attached to a NutrientLog.

**Recommended fields**
- `id` (UUID, PK)
- `nutrient_log_id` (FK)
- `food_item_id` (FK)
- `quantity` (servings)
- `meal_slot` (breakfast, lunch, dinner, snack)
- `logged_at` (timestamp)

## Relationships

- User has many WorkoutSessions
- User has many NutrientLogs
- WorkoutSession has many SetLogs
- SetLog belongs to WorkoutSession and Exercise
- NutrientLog belongs to User
- NutrientLog has many FoodItems (as entries)

## Constraints & Indexing

- Unique composite index: (`user_id`, `log_date`) on NutrientLog.
- Index `scheduled_for` on WorkoutSession for timeline queries.
- Index `exercise_id` on SetLog for performance analytics.

## Derived Metrics (Examples)

- **Readiness Score**: combine sleep, soreness, HRV (future), last session strain.
- **Weekly Volume**: sum of set volume by week (reps * weight).
- **Macro Compliance**: percentage of target macros achieved per day.
