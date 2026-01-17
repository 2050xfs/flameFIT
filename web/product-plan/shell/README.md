# Application Shell Specification

## Overview
A sleek, sidebar-based layout designed for a premium fitness dashboard. It provides persistent access to the core modules (Workouts, Nutrition, etc.) while maximizing screen real estate for data visualization.

## Navigation Structure
- **Dashboard** → `/dashboard`
- **Workout Lab** → `/workouts`
- **Kitchen** → `/kitchen`
- **Knowledge Base** → `/knowledge-base`
- **Progress** → `/progress`

## User Menu
- Location: Bottom of the sidebar.
- Contents: Avatar, Name ("Eddie"), Settings, Logout.

## Detailed Behavior

1. **Active State**
   - Highlight current route with primary color and icon glow.
   - Keep sidebar item label visible on expanded layout.
2. **Collapsed State**
   - When collapsed, show tooltip on hover/focus.
3. **Mobile Navigation**
   - Bottom bar for primary routes (Dashboard, Workouts, Kitchen, Progress).
   - Overflow menu for Knowledge Base + Settings.
4. **Accessibility**
   - `aria-current="page"` for active route.
   - Keyboard focus ring on icons and menu items.

## Layout Pattern
- **Pattern**: Vertical Sidebar.
- **Desktop**: Fixed 64px (icon only) or 240px (expanded) sidebar on the left.
- **Mobile**: Bottom tab bar or Hamburger menu. Let's go with a modern mobile-first bottom bar for primary actions, hamburger for secondary.

## Design Notes
- Use the `orange` primary color for active states to simulate a "glowing" effect.
- Use `glassmorphism` effects on the mobile bottom bar.
