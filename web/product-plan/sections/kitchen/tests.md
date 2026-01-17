# Test Instructions: Kitchen

## User Flow Tests

### Flow 1: Log a Meal

**Scenario**: User adds "Avocado Toast" to Breakfast.

**Steps**:
1. User clicks "Smart Add" or "Log Food".
2. User searches/selects "Avocado Toast".
3. User selects "Breakfast" category.
4. User confirms add.

**Expected Results**:
- [ ] `onLogFood` called with food item details.
- [ ] Macro Headboard updates values (optimistically or after refresh).
- [ ] Meal Stream shows the new entry.
- [ ] Meal slot reflects correct grouping.

### Flow 2: Check Hydration

**Scenario**: User adds a glass of water.

**Steps**:
1. User taps "+" on Water Tracker.

**Expected Results**:
- [ ] Counter increments.
- [ ] Visual fill level increases.
- [ ] Daily total persists after refresh (if persistence enabled).

---

## Empty State Tests

### New Day

**Scenario**: No food logged yet.

**Expected Results**:
- [ ] Macro Headboard shows 0/Target.
- [ ] Meal Stream shows "Log your first meal" empty state.
- [ ] Water tracker at 0.

---

## Error & Edge Case Tests

### Food Search API Failure

**Scenario**: External nutrition API fails.

**Expected Results**:
- [ ] Error banner shown with retry.
- [ ] Recent foods still available.

### Unit Conversion

**Scenario**: User switches serving size from 1 serving to 150g.

**Expected Results**:
- [ ] Macro totals recalc correctly.
- [ ] Displayed serving text updates consistently.
