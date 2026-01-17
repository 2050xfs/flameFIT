# Product Plan Execution Checklist

This checklist is intended to accompany the milestone docs. It is intentionally granular to ensure nothing is skipped.

## 0. Project Preflight

- [ ] Verify Node + package manager versions.
- [ ] Ensure Supabase env vars are set and accessible.
- [ ] Run lint/test once to confirm baseline.
- [ ] Confirm routing structure in the app shell matches product-plan.

## 1. Data Contract & Schema

- [ ] Define table schemas for User, WorkoutSession, Exercise, SetLog, NutrientLog, FoodItem, NutrientLogItem.
- [ ] Create indexes for performance-critical queries (by date, by user).
- [ ] Document required vs optional fields.
- [ ] Create a data seeding approach for local dev.

## 2. API Layer

- [ ] Implement read endpoints for dashboard summary, progress charts, and knowledge base.
- [ ] Implement write endpoints for workout sessions, set logs, nutrient logs, and bookmarks.
- [ ] Add error code mapping and structured error payloads.

## 3. UI Integration

- [ ] Replace mock data with API-driven data per section.
- [ ] Add loading skeletons to all primary views.
- [ ] Add empty states for first-time users.
- [ ] Add error banners that do not block unaffected modules.

## 4. Logging + Analytics

- [ ] Track dashboard view + quick actions.
- [ ] Track workout start/resume/complete.
- [ ] Track food search and log completion.
- [ ] Track content views and bookmarks.
- [ ] Track progress metric toggles and photo uploads.

## 5. Quality Gates

- [ ] Tests pass for all `tests.md` flows.
- [ ] Accessibility pass (keyboard + screen reader pass on each major view).
- [ ] Visual QA across desktop and mobile breakpoints.
- [ ] Performance checks for dashboard and progress (large data sets).

## 6. Release Checklist

- [ ] Add feature flags for experimental modules.
- [ ] Confirm data retention and backup policies.
- [ ] Confirm logging of critical errors.
