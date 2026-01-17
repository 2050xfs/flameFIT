# Knowledge Base

## Overview

The Knowledge Base is the educational hub of 'flameFit'. It provides users with expert content on workouts, nutrition, and recovery. It functions like a streaming platform (e.g., Netflix/YouTube) but tailored for fitness goals.

## User Flows

- **Browse & Discovery**: User scans "Featured", "Trending", and "Category" lists to find content.
- **Search**: User types keywords to find specific techniques or articles.
- **Consume Content**: User watches high-quality video demonstrations or reads detailed articles.
- **Bookmark**: User saves content to their personal library for later reference.

## Design Decisions

- **Immersive aesthetic**: Darker themes to match media-rich content.
- **Horizontal rails**: Familiar streaming interaction pattern.

## Data Used

**Entities**:
- Exercise (content items)
- User (bookmarks)

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
