# Test Instructions: Dashboard

These test-writing instructions are **framework-agnostic**. Adapt them to your testing setup.

## Overview

The Dashboard aggregates data from multiple sources. Tests should ensure accurate display of daily totals and correct routing of quick actions.

---

## User Flow Tests

### Flow 1: Check Daily Status

**Scenario**: User opens the app to check their readiness and nutrition status.

#### Success Path

**Setup**:
- User authentication active
- Mock data: Readiness 85, Macros (Protein: 120/180g)

**Steps**:
1. User navigates to Dashboard
2. User sees Readiness Score "85"
3. User sees "High Readiness" message
4. User checks Protein ring, showing approx 66% progress

**Expected Results**:
- [ ] Readiness score displays correct value
- [ ] Macro rings reflect proportional progress
- [ ] Timeline matches scheduled items (if any)
- [ ] Readiness message matches status mapping
- [ ] Macro labels show current/target values

### Flow 2: Quick Add Action

**Scenario**: User wants to quickly log a workout or meal.

**Steps**:
1. User clicks "Quick Add" button
2. Menu or detailed view opens (depending on implementation)

**Expected Results**:
- [ ] `onQuickAdd` callback is fired
- [ ] Loading state if transitioning
- [ ] Quick add defaults include current timestamp

---

## Empty State Tests

### No Data Today

**Scenario**: A new day starts, no logs yet.

**Setup**:
- Empty NutrientLog
- No scheduled workouts

**Expected Results**:
- [ ] Readiness score still calculates (or shows "Calculating...")
- [ ] Macro rings at 0%
- [ ] Timeline shows "Nothing scheduled" or similar helpful empty state
- [ ] "Quick Add" remains prominent

---

## Error & Resilience Tests

### Readiness Fetch Fails

**Scenario**: Readiness API times out but macros succeed.

**Expected Results**:
- [ ] Readiness card shows error state with retry.
- [ ] Macros and timeline still render normally.

### Missing Macro Targets

**Scenario**: User has not set macro goals.

**Expected Results**:
- [ ] Macro rings display 0% or placeholder.
- [ ] "Set goals" CTA is visible.

---

## Accessibility Tests

- [ ] Readiness score is announced by screen reader with context.
- [ ] Macro rings are keyboard focusable or have accessible summary text.
- [ ] Timeline items are reachable via keyboard navigation in order.
