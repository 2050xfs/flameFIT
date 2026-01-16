# Milestone 5: Knowledge Base

> **Provide alongside:** `product-overview.md`
> **Prerequisites:** Milestone 1 (Foundation) complete

---

## Goal

Implement the Knowledge Base — the educational hub for discovery and learning.

## Recommended Approach: Test-Driven Development

See `product-plan/sections/knowledge-base/tests.md` for detailed test-writing instructions.

## What to Implement

### Components

Copy the section components from `product-plan/sections/knowledge-base/components/`:

- `KnowledgeBase.tsx`
- `ContentDetail.tsx` (sub-component)

### Data Layer

The components expect:
- `Exercise` (or `ContentItem`) with video URLs, descriptions, tags, and category props.

You'll need to:
- Implement a search index or API
- Manage "Saved" / "Bookmarked" state for the user

### Callbacks

Wire up these user actions:
- `onViewContent`: navigate to the detail view.
- `onSearch`: execute the search query.
- `onBookmark`: toggle the saved state of an item.

## Done When

- [ ] Tests written for search and bookmarking
- [ ] Main library renders categorized rails
- [ ] Search returns valid results
- [ ] Detail view plays (or mocks) video content
- [ ] Empty states handled
