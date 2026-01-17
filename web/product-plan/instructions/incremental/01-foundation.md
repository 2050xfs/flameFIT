# Milestone 1: Foundation

> **Provide alongside:** `product-overview.md`
> **Prerequisites:** None

---

## About These Instructions

**What you're receiving:**
- Finished UI designs (React components with full styling)
- Data model definitions (TypeScript types and sample data)
- UI/UX specifications (user flows, requirements, screenshots)
- Design system tokens (colors, typography, spacing)
- Test-writing instructions for each section (for TDD approach)

**What you need to build:**
- Backend API endpoints and database schema
- Authentication and authorization
- Data fetching and state management
- Business logic and validation
- Integration of the provided UI components with real data

**Important guidelines:**
- **DO NOT** redesign or restyle the provided components — use them as-is
- **DO** wire up the callback props to your routing and API calls
- **DO** replace sample data with real data from your backend
- **DO** implement proper error handling and loading states
- **DO** implement empty states when no records exist (first-time users, after deletions)
- **DO** use test-driven development — write tests first using `tests.md` instructions
- The components are props-based and ready to integrate — focus on the backend and data layer

---

## Goal

Set up the foundational elements: design tokens, data model types, routing structure, and application shell.

## Preflight Checklist

- Confirm runtime: Next.js App Router + Tailwind setup.
- Verify environment variables for Supabase are configured.
- Ensure lint/test scripts are wired.

## What to Implement

### 1. Design Tokens

Configure your styling system with these tokens:

- See `product-plan/design-system/tokens.css` for CSS custom properties
- See `product-plan/design-system/tailwind-colors.md` for Tailwind configuration
- See `product-plan/design-system/fonts.md` for Google Fonts setup

**Step-by-step**
1. Import fonts in `app/layout.tsx`.
2. Verify Tailwind config uses semantic tokens.
3. Validate typography in a sample page.

### 2. Data Model Types

Create TypeScript interfaces for your core entities:

- See `product-plan/data-model/types.ts` for interface definitions
- See `product-plan/data-model/README.md` for entity relationships

**Step-by-step**
1. Add types for each entity and enums for status fields.
2. Ensure types align with Supabase schema (field names + optionality).
3. Add sample fixtures for tests and storybook (if used).

### 3. Routing Structure

Create placeholder routes for each section:

- `/dashboard`
- `/workouts`
- `/kitchen`
- `/knowledge-base`
- `/progress`

**Step-by-step**
1. Create route folders with placeholder content.
2. Add navigation targets in the shell.
3. Verify deep linking works (reload with URL).

### 4. Application Shell

Copy the shell components from `product-plan/shell/components/` to your project:

- `AppShell.tsx` — Main layout wrapper
- `MainNav.tsx` — Navigation component
- `UserMenu.tsx` — User menu with avatar

**Wire Up Navigation:**

Connect navigation to your routing. The navigation items should link to the routes defined above.

**User Menu:**

The user menu expects:
- User name
- Avatar URL (optional)
- Logout callback

**Step-by-step**
1. Wire responsive layout (collapsed/expanded).
2. Add aria labels and keyboard navigation support.
3. Ensure shell renders consistently across routes.

## Done When

- [ ] Design tokens are configured
- [ ] Data model types are defined
- [ ] Routes exist for all sections (can be placeholder pages)
- [ ] Shell renders with navigation
- [ ] Navigation links to correct routes
- [ ] User menu shows user info
- [ ] Responsive on mobile
- [ ] Accessibility checks pass for nav (keyboard + screen reader)
