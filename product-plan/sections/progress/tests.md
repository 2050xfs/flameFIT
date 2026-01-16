# Test Instructions: Progress

## User Flow Tests

### Flow 1: Compare Photos

**Scenario**: User compares Jan 1 vs Feb 1 physique.

**Steps**:
1. Navigate to Photo Gallery.
2. Select "Compare" mode.
3. Select Image A and Image B.

**Expected Results**:
- [ ] Comparison view opens.
- [ ] Slider is functional.
- [ ] Dates are correctly labeled on each side.

### Flow 2: Check Weight Trend

**Scenario**: User wants to see weight loss over 1 month.

**Steps**:
1. Toggle Chart to "Body Weight".
2. Observe trend line.

**Expected Results**:
- [ ] Chart renders with correct data points.
- [ ] Y-axis scales appropriately.

---

## Empty State Tests

### No History

**Scenario**: New user.

**Expected Results**:
- [ ] Chart shows "Not enough data" placeholder.
- [ ] History list shows "Complete your first workout" CTA.
- [ ] Photo gallery prompts "Take your starting photo".
