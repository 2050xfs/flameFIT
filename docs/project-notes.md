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
- Choose the PDF extraction approach for `/workout inspo` (manual curation vs scripted parsing).
- Choose the readiness score algorithm inputs.
- Decide on storage for knowledge base videos (Supabase Storage vs external CDN).
- Define real-time requirements for Progress (Supabase Realtime vs periodic refresh).

## Next Steps (Detailed)

1. **Workout Inspo Extraction**
   - Decide PDF extraction tool (manual curation vs. scripted parsing).
   - Define normalized exercise fields (name, muscles, equipment, cues, media).
   - Produce a small "golden dataset" sample (10–20 exercises) for QA.
2. **Dashboard Data Wiring**
   - Replace mocked readiness with a deterministic placeholder algorithm.
   - Use Supabase queries for macros + timeline items.
   - Add "data freshness" timestamps to the UI.
3. **Knowledge Base Data Plan**
   - Decide storage for video/media assets.
   - Implement tagging taxonomy aligned with workout inspo content.
   - Define bookmark persistence table and API endpoints.
4. **Kitchen Water Tracking**
   - Add water table or field on NutrientLog.
   - Implement quick-add increments (e.g., +250ml).
5. **Progress Storage**
   - Create body stats table (weight, body fat, notes).
   - Add photo metadata table with storage integration.
   - Define chart refresh cadence (realtime vs periodic).

## Workout Inspo Inventory (Step 1 - Completed)
**Path:** `/workspace/flameFIT/workout inspo`

**Format:** PDF programs/ebooks (no structured JSON/CSV yet).

**Files found:**
- `Male_8_Week_Advanced_Training_Program.pdf`
- `SADIK-ABS.pdf`
- `SDK-contest-prep-compressed.pdf`
- `The Secret Formula To Become The World Champion Of Your Own Life AJ Ellison .pdf`
- `Volume1_absolutearms.pdf`
- `Volume2_armoredchest_v3compressed.pdf`
- `sadik-leanbulk.pdf`
- `sadik-legs.pdf`
- `sadik-shoulders-ebook.pdf`
- `sdk-x-frame-compressed.pdf`
- `volume_3_superior_backcompressed.pdf`
