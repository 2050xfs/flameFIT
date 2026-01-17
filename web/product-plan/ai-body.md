# AI as the Body — Adaptive System Notes

This document defines how AI should behave as the "body" of the product: continuously sensing, interpreting, and adapting the plan so the user only makes high-level choices.

## Core Idea

The AI acts as a physiological layer that:
1. **Senses** the user's current state from logs and signals.
2. **Interprets** readiness and capacity using simple, transparent rules.
3. **Adapts** recommendations, plans, and defaults in real time.

## Sensing Loop (Inputs)

**Daily signals (explicit):**
- Sleep hours (user log)
- Soreness rating (1–5)
- Mood/energy check-in (1–5)
- Meal completion (macro adherence)

**Behavioral signals (implicit):**
- Last workout completion time
- Set volume vs. target volume
- Meal logging cadence
- Missed sessions or skipped meals

**Derived signals:**
- Rolling 7-day training load
- Trend in body weight and body fat
- Macro compliance percentage

## Interpretation Layer (Rules)

Start with transparent heuristics (upgrade to ML later):
- **Readiness = base 70**
  - +10 if sleep ≥ 7h
  - +10 if soreness ≤ 2
  - +5 if last workout completed on schedule
  - -10 if missed session within 48h
  - -5 if macro compliance < 70% yesterday

**Categories:**
- 0–49: Recover
- 50–79: Maintain
- 80–100: Push

## Adaptation Layer (What Changes)

**Workout Lab**
- Adjust intensity: drop volume 10–20% on low readiness.
- Auto-swap to shorter session when cadence is slipping.
- Suggest deload after 3 consecutive low-readiness days.

**Dashboard**
- Prominent “what to do next” CTA shifts based on readiness:
  - Recover → Mobility + hydration focus
  - Maintain → Planned session
  - Push → Heavy day emphasis

**Kitchen**
- Tighten protein target when strength goals lag.
- Suggest calorie deficit/surplus tweaks based on weight trend.
- Auto-surface frequent meals to reduce friction.

**Knowledge Base**
- Recommend content based on missed workouts (e.g., form refreshers).
- Highlight recovery content when readiness is low.

**Progress**
- Call out positive trends with “You’re on track” nudges.
- Trigger reminders when no data updates in 7 days.

## UI Adaptation Principles

- **Subtle by default**: show suggestions, allow override.
- **Explainable**: always show “why” for adaptations.
- **Reversible**: allow user to revert to planned schedule.
- **Minimal friction**: never require extra steps to accept an AI suggestion.

## Safety & Guardrails

- Never increase load beyond plan without explicit opt-in.
- Avoid extreme nutrition changes (limit to ±10% weekly).
- Always preserve the original plan as a reference.

## Data Requirements (Phase 1)

- Add daily readiness inputs to profiles/logs.
- Add session adherence tracking (planned vs completed).
- Track macro compliance per day.
- Store AI recommendations in a simple audit log table.

## Next Steps

1. Add readiness input UI (sleep, soreness, mood).
2. Implement readiness calculation service.
3. Surface “why” tooltips in Dashboard + Workout Lab.
4. Add AI recommendation event logging.
