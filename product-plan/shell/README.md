# Application Shell Specification

## Overview
A sleek, sidebar-based layout designed for a premium fitness dashboard. It provides persistent access to the core modules (Workouts, Nutrition, etc.) while maximizing screen real estate for data visualization.

## Navigation Structure
- **Dashboard** → `/dashboard`
- **Workout Lab** → `/workouts`
- **Kitchen** → `/nutrition`
- **Knowledge Base** → `/knowledge`
- **Progress** → `/progress`

## User Menu
- Location: Bottom of the sidebar.
- Contents: Avatar, Name ("Eddie"), Settings, Logout.

## Layout Pattern
- **Pattern**: Vertical Sidebar.
- **Desktop**: Fixed 64px (icon only) or 240px (expanded) sidebar on the left.
- **Mobile**: Bottom tab bar or Hamburger menu. Let's go with a modern mobile-first bottom bar for primary actions, hamburger for secondary.

## Design Notes
- Use the `orange` primary color for active states to simulate a "glowing" effect.
- Use `glassmorphism` effects on the mobile bottom bar.
