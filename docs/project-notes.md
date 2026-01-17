# FlameFit Project Notes

## Notes (Current State)
- **Design system + shell:** Design tokens, fonts, and shell navigation are implemented and wired to the main routes.
- **Dashboard:** UI and component tests exist, but the data source is still mocked in `lib/api/dashboard.ts`.
- **Workout Lab:** Supabase sessions are used, but several fields are placeholders (plan name, intensity, workout code).
- **Kitchen:** Supabase logging is in place; macro aggregation works; water intake is still mocked.
- **Knowledge Base:** Entirely mocked content; no real data source, search, or bookmarks persistence yet.
- **Progress:** Charts/stats/photos/history are mocked; no real-time updates or storage implemented yet.
- **Nutrition API:** CalorieNinjas is the active nutrition API client. Edamam is removed.

## Milestone Chart
| Milestone | Status | Key Gaps |
| --- | --- | --- |
| 1. Foundation | **Mostly complete** | None blocking; consider responsiveness checks + polish. |
| 2. Dashboard | **Partial** | Replace mocked readiness/timeline data with real data. |
| 3. Workout Lab | **Partial** | Replace placeholder plan metadata and improve session state handling. |
| 4. Kitchen | **Partial** | Implement water tracking + food search wiring. |
| 5. Knowledge Base | **Below satisfactory** | Implement real content source + search + bookmark persistence. |
| 6. Progress | **Below satisfactory** | Implement storage + real-time progress metrics and chart data. |

## Usage Notes
- **Local development:**
  - `npm run dev` for the app.
  - `npm run lint` for linting.
  - `npm run test` for component tests.
- **Data dependencies:**
  - Supabase tables used today: `exercises`, `workout_sessions`, `set_logs`, `nutrient_logs`, `nutrient_log_items`, `food_items`, `profiles`.
  - CalorieNinjas is the intended nutrition API source.

## Plan for Workout Inspo Usage
> **Goal:** Use `/workout inspo` as the authoritative source for exercises and knowledge content.

1. **Locate + inventory the folder**
   - Confirm the folder path and list files.
   - Document the format (JSON, CSV, markdown, video assets).
2. **Define data mapping**
   - Map fields to domain entities: `Exercise`, `WorkoutTemplate`, `KnowledgeContent`.
   - Identify required metadata: muscle group, equipment, difficulty, description, media links.
3. **Create ingestion pipeline**
   - Add a script or ETL step to transform inspo files into structured data.
   - Seed Supabase tables for exercises and knowledge content.
4. **Wire UI to real data**
   - Replace mocked Knowledge Base content and Workout Lab exercise references with seeded data.
   - Add search + filtering to use real categories/tags.
5. **Premium AI Coach integration**
   - Build a curated selection layer using the inspo taxonomy.
   - Expose “AI coach” recommendations from the same dataset (ranking + personalization rules).

## Next Decisions Needed
- Confirm the exact path and file format of `/workout inspo`.
- Choose the readiness score algorithm inputs.
- Decide on storage for knowledge base videos (Supabase Storage vs external CDN).
- Define real-time requirements for Progress (Supabase Realtime vs periodic refresh).
