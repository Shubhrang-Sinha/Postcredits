# Phase 6: Frontend Migration - Context

**Gathered:** 2026-04-30
**Status:** Ready for planning

<domain>
## Phase Boundary

Migrate the existing Phase 5 frontend from @radix-ui/themes to pure Tailwind CSS + Radix UI primitives. This is a refactoring/migration phase, not new feature development.

**Prerequisite:** Phase 5 frontend must be complete and running

</domain>

<decisions>
## Implementation Decisions

### Migration Scope (Locked)

- **D-01:** Remove @radix-ui/themes package
- **D-02:** Use Tailwind CSS as single source of truth for styling
- **D-03:** Use Radix UI primitives (@radix-ui/react-\*) for behavior only
- **D-04:** Implement semantic color tokens in CSS/Tailwind config

### Auth Improvements

- **D-05:** Prefer httpOnly cookies for JWT (if backend supports)
- **D-06:** Document tradeoffs if localStorage must remain

### API Configuration

- **D-07:** NEXT_PUBLIC_API_URL env var for client
- **D-08:** Internal Docker URL for server-side calls

</decisions>

<canonical_refs>

## Canonical References

**Phase 5 UI-SPEC:**

- `.planning/phases/05-frontend/05-UI-SPEC.md` — Current design contract

**Frontend Code:**

- `frontend/src/app/globals.css` — Current CSS variables
- `frontend/src/components/` — Current components using @radix-ui/themes

</canonical_refs>

<code_context>

## Existing Code Analysis

### Current Dependencies

- @radix-ui/themes (to be removed)
- Tailwind CSS v4 (migrating to new token system)
- Material Symbols (keeping)

### Components to Migrate

- Header (sticky nav)
- MediaCard (grid items)
- GenreFilter (server + client)
- StarRating (interactive)
- StatsChart (charts)
- RecommendationCarousel (horizontal scroll)
- Login/Register forms
- Media detail pages

</code_context>

<specifics>
## Specific Ideas

- Migrate CSS variables in globals.css to semantic tokens
- Replace Radix Themes components with Tailwind + Radix primitives
- Add skeleton loading states
- Improve form error handling
- Add proper focus states for accessibility

</specifics>

<deferred>
## Deferred Ideas

- None — all scope decisions made upfront

</deferred>

---

_Phase: 06-frontend-migration_
_Context gathered: 2026-04-30_
