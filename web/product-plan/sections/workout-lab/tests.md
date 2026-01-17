# Test Instructions: Workout Lab

## User Flow Tests

### Flow 1: Start Scheduled Workout

**Scenario**: User sees today's workout and starts it.

**Steps**:
1. Navigate to Workout Lab.
2. Verify "Today's Workout" card is visible with correct title (e.g., "Pull Day").
3. Click "Start Workout".

**Expected Results**:
- [ ] `onStartWorkout` is called with correct workout ID.
- [ ] UI provides feedback (ripple/loading).
- [ ] If session already exists, button changes to "Resume".

### Flow 2: View Plan

**Scenario**: User checks what is coming up later in the week.

**Steps**:
1. User looks at Weekly Strip.
2. User clicks on a future day (e.g., Friday).

**Expected Results**:
- [ ] Active card updates to show Friday's planned workout (if interactive) OR
- [ ] UI highlights the selected day.
- [ ] Selection persists when user scrolls (if list content is long).

---

## Empty State Tests

### No Workout Scheduled

**Scenario**: Rest day or no plan created.

**Setup**:
- No workout scheduled for today.

**Expected Results**:
- [ ] "Rest Day" or "No Workout Scheduled" message prominently displayed.
- [ ] Option to "Browse Library" or "Create Workout" is visible.
- [ ] Weekly strip still accurately reflects the day.

---

## Error & Edge Case Tests

### Exercise Metadata Missing

**Scenario**: One exercise in a planned workout lacks media or muscle group data.

**Expected Results**:
- [ ] Exercise still renders with fallback icon/text.
- [ ] No UI crash.

### Start Workout Fails

**Scenario**: API fails to create a new session.

**Expected Results**:
- [ ] Error toast shown with retry action.
- [ ] Start button returns to idle state.
