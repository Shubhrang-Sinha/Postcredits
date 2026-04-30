# Phase 5: Frontend - Context

**Gathered:** 2026-04-30
**Status:** Ready for planning

<domain>
## Phase Boundary

Build a Next.js 14 frontend with full MVP UI that connects to the existing backend API. Users can browse books/movies, rate media, view recommendations, and see Spotistats.

**Prerequisite:** Phases 1-4 (backend) must be complete and running

</domain>

<decisions>
## Implementation Decisions

### Tech Stack (Locked)
- **D-01:** Framework — Next.js 14 (App Router, not Pages Router)
- **D-02:** Styling — Tailwind CSS + @radix-ui/themes component library
- **D-03:** Data Fetching — Server Components with fetch (not React Query/SWR)
- **D-04:** Authentication — JWT stored in localStorage (not httpOnly cookies, not NextAuth)

### Scope (Full MVP - Option B)
- **D-05:** Login/Register pages with JWT auth
- **D-06:** Home/Dashboard with blend recommendations
- **D-07:** Browse Books page with genre filtering
- **D-08:** Browse Movies page with genre filtering
- **D-09:** Media detail pages (book/movie info + rating)
- **D-10:** Rating submission (1-5 stars)
- **D-11:** Watchlist (user's rated items)
- **D-12:** Spotistats dashboard (genre/year charts)

### Architecture
- **D-13:** Use Next.js app directory structure (app/page.tsx, app/books/page.tsx, etc.)
- **D-14:** Server components for data fetching, client components for interactivity
- **D-15:** API calls via fetch() to backend at localhost:3000
- **D-16:** Auth context provider for JWT state management

### UI/UX
- **D-17:** Use @radix-ui/themes components (Button, Card, Input, Tabs, etc.)
- **D-18:** Responsive design for mobile/desktop
- **D-19:** Loading states with React Suspense
- **D-20:** Error boundaries for graceful failures

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Backend API
- `openapi.yaml` — Full API specification with endpoints
- `backend/src/routes/auth.ts` — Auth endpoints (register, login, me)
- `backend/src/routes/books.ts` — Books CRUD
- `backend/src/routes/movies.ts` — Movies CRUD
- `backend/src/routes/ratings.ts` — Rating endpoints
- `backend/src/routes/recommendations.ts` — Blend recommendations
- `backend/src/routes/stats.ts` — Spotistats endpoints

### Frontend Setup
- `https://www.radix-ui.com/themes/docs/overview/getting-started` — Radix themes docs

### Existing Analysis
- `.planning/frontend-integration.md` — UI to API mapping (existing analysis)

</canonical_refs>

<code_context>
## Existing Code Insights

### Backend Ready
- All API endpoints implemented in Hono
- JWT auth already in place (stateless)
- Full CRUD for books, movies, creators, genres
- Ratings and recommendations working
- Stats endpoints for Spotistats

### Integration Points
- Frontend connects to localhost:3000 API
- Auth tokens stored in localStorage, sent in Authorization header
- Server components can make fetch calls directly

</code_context>

<specifics>
## Specific Ideas

- Use Radix Themes for consistent, accessible components
- Home page shows featured recommendation via `/recommendations/blend`
- Browse pages use `/books` and `/movies` with `?genre={id}` filtering
- Watchlist filters `/ratings` by user ID
- Spotistats calls `/stats/genres` and `/stats/years`

</specifics>

<deferred>
## Deferred Ideas

None — all scope decisions made upfront

</deferred>

---

*Phase: 05-frontend*
*Context gathered: 2026-04-30*