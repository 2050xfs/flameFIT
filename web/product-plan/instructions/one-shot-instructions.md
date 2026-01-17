# flameFit — Complete Implementation Instructions

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

## Test-Driven Development

Each section includes a `tests.md` file with detailed test-writing instructions. These are **framework-agnostic**.

**For each section:**
1. Read `product-plan/sections/[section-id]/tests.md`
2. Write failing tests for key user flows
3. Implement the feature to make tests pass
4. Refactor while keeping tests green

---

# Milestone 1: Foundation

Set up the foundational elements: design tokens, data model types, routing structure, and application shell.

### 1. Design Tokens
- See `product-plan/design-system/tokens.css`
- See `product-plan/design-system/tailwind-colors.md`
- See `product-plan/design-system/fonts.md`

### 2. Data Model Types
- See `product-plan/data-model/types.ts`
- See `product-plan/data-model/README.md`

### 3. Application Shell
Copy components from `product-plan/shell/components/` (AppShell, MainNav, UserMenu) and wire up navigation.

---

# Milestone 2: Dashboard

Implement the daily command center.

- **Components**: `product-plan/sections/dashboard/components/`
- **Tests**: `product-plan/sections/dashboard/tests.md`
- **Goal**: Display readiness score and daily timeline; wire up "Quick Add" action.

---

# Milestone 3: Workout Lab

Implement the training workspace.

- **Components**: `product-plan/sections/workout-lab/components/`
- **Tests**: `product-plan/sections/workout-lab/tests.md`
- **Goal**: Implement weekly schedule view and active workout launcher.

---

# Milestone 4: Kitchen

Implement nutrition management.

- **Components**: `product-plan/sections/kitchen/components/`
- **Tests**: `product-plan/sections/kitchen/tests.md`
- **Goal**: Enable food logging, macro tracking, and meal planning.

---

# Milestone 5: Knowledge Base

Implement the educational hub.

- **Components**: `product-plan/sections/knowledge-base/components/`
- **Tests**: `product-plan/sections/knowledge-base/tests.md`
- **Goal**: Create a media-rich library for exercises and content.

---

# Milestone 6: Progress

Implement analytics and history.

- **Components**: `product-plan/sections/progress/components/`
- **Tests**: `product-plan/sections/progress/tests.md`
- **Goal**: Visualize user progress with charts and photo comparisons.
