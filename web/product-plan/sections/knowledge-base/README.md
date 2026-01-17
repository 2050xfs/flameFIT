# Knowledge Base

## Overview

The Knowledge Base is the educational hub of 'flameFit'. It provides users with expert content on workouts, nutrition, and recovery. It functions like a streaming platform (e.g., Netflix/YouTube) but tailored for fitness goals.

## User Flows

- **Browse & Discovery**: User scans "Featured", "Trending", and "Category" lists to find content.
- **Search**: User types keywords to find specific techniques or articles.
- **Consume Content**: User watches high-quality video demonstrations or reads detailed articles.
- **Bookmark**: User saves content to their personal library for later reference.

## Detailed Experience Checklist

1. **Home Rails**
   - Provide "Featured", "For You", and category rails.
   - Rails should include item count and show loading skeletons.
2. **Search**
   - Autocomplete tags, muscle groups, and equipment.
   - Support empty results state with suggestions.
3. **Content Detail**
   - Show title, description, duration, difficulty, and tags.
   - Track progress and allow resume playback.
4. **Bookmarking**
   - Optimistic toggle with sync to backend.
   - Display "Saved" rail for quick access.

## Design Decisions

- **Immersive aesthetic**: Darker themes to match media-rich content.
- **Horizontal rails**: Familiar streaming interaction pattern.

## Data Used

**Entities**:
- Exercise (content items)
- User (bookmarks)

**Derived fields:**
- `is_featured`, `is_trending`
- `watch_progress` (percentage)

## Components Provided

- `KnowledgeBase` — Main library container.
- `ContentDetail` — Player and details view.
- `CategoryRail` — Horizontal list component.

## Callback Props

| Callback | Description |
|----------|-------------|
| `onViewContent` | Opens content detail view |
| `onSearch` | Triggers search query |
| `onBookmark` | Toggles saved state |

## Edge Cases & Error Handling

- **Missing media URL**: show fallback thumbnail and disable play.
- **Search empty**: show "Try these topics" suggestions.
- **Bookmark failure**: revert state and show error toast.

## Analytics & Instrumentation

- Track `knowledge_base_view` with rail counts.
- Track `content_play` with content ID and duration.
- Track `bookmark_toggle` with state change.
