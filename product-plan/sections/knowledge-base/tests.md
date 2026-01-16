# Test Instructions: Knowledge Base

## User Flow Tests

### Flow 1: Search and View

**Scenario**: User looks for "Squat" technique.

**Steps**:
1. Tap Search icon.
2. Type "Squat".
3. Tap the first result.

**Expected Results**:
- [ ] Results list updates with "Squat" related items.
- [ ] `onViewContent` is called upon selection.
- [ ] Detail view renders with video player placeholder.

### Flow 2: Bookmark Content

**Scenario**: User saves a video for later.

**Steps**:
1. Open a video detail view.
2. Tap "Bookmark" icon.

**Expected Results**:
- [ ] Icon state changes (e.g., filled).
- [ ] Toast message "Saved to Library" appears.
- [ ] Validation: Item appears in "Saved" rail on main screen.

---

## Empty State Tests

### No Search Results

**Scenario**: User types gibberish.

**Expected Results**:
- [ ] "No results found" message.
- [ ] Suggestion to check spelling or browse categories.

### Empty Library

**Scenario**: User has no bookmarks.

**Expected Results**:
- [ ] "Saved" rail is hidden OR,
- [ ] "Saved" rail shows "Start saving your favorite videos" placeholder.
