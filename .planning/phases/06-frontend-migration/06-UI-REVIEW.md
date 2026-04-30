# Phase 6 — UI Review

**Audited:** 2026-04-30
**Baseline:** UI-SPEC.md design contract
**Screenshots:** Not captured (dev server running but shows mixed state - built code has @radix-ui/themes still active while source migrated)

---

## Pillar Scores

| Pillar | Score | Key Finding |
|--------|-------|-------------|
| 1. Copywriting | 4/4 | All labels contextual, no generic patterns |
| 2. Visuals | 4/4 | Components match UI-SPEC contracts |
| 3. Color | 3/4 | Most semantic tokens used, minor hardcoded values |
| 4. Typography | 4/4 | Full typography scale implemented |
| 5. Spacing | 4/4 | Consistent semantic spacing |
| 2. Experience Design | 2/4 | Missing focus-visible states, aria-live |

**Overall: 21/24**

---

## Top 3 Priority Fixes

1. **Add focus-visible states to interactive elements** — Keyboard users cannot see focus indicator — Add `focus-visible:ring-2 focus:ring-accent focus:outline-none` to all buttons and links per UI-SPEC D-01

2. **Migrate GenreFilterServer.tsx to semantic tokens** — Server component uses hardcoded colors (`#1db954`, `#261d1d`, `#bccbb9`, `#3d4a3d`) — Replace with `bg-accent-hover`, `bg-bg-secondary`, `text-text-secondary`, `border-border-subtle`

3. **Add aria-live to form error messages** — Screen readers miss error announcements — Add `aria-live="polite"` to error containers in login/page.tsx and register/page.tsx

---

## Detailed Findings

### Pillar 1: Copywriting (4/4)

All labels match UI-SPEC copywriting contract:

- Form buttons: "Login", "Register", "Creating account...", "Logging in..." — contextual ✅
- Empty states: "You haven't rated any items yet" — clear message ✅  
- Error messages: "Invalid email or password", "Registration failed. Email may already be in use." — specific ✅
- No generic patterns like "Submit", "Click Here", "Save" found ✅

Files examined:
- `frontend/src/app/login/page.tsx` — Lines 27, 89
- `frontend/src/app/register/page.tsx` — Lines 28, 104
- `frontend/src/app/watchlist/page.tsx` — Line 76

### Pillar 2: Visuals (4/4)

Component structure matches UI-SPEC contracts:

- **Header**: sticky, backdrop-blur, bg-bg-primary/80, z-50 ✅ (06-UI-SPEC L-14)
- **MediaCard**: hover:scale-105, hover:shadow-lg, aspect ratio ✅ (06-UI-SPEC L-17)
- **GenreFilter**: pill buttons, active/inactive states ✅ (06-UI-SPEC L-21)
- **StarRating**: interactive 5-star ✅ (06-UI-SPEC L-24)
- Visual hierarchy through size/weight differentiation ✅

Files examined:
- `frontend/src/components/Header.tsx` — Lines 10-14, 57, 72
- `frontend/src/components/MediaCard.tsx` — Line 26
- `frontend/src/components/GenreFilter.tsx` — Lines 23-27, 35-39

### Pillar 3: Color (3/4)

Most semantic tokens used correctly with minor exceptions:

**Semantic tokens present:**
- `bg-bg-primary`, `bg-bg-secondary`, `bg-bg-tertiary` ✅
- `text-text-primary`, `text-text-secondary` ✅  
- `border-border-subtle` ✅
- `text-accent`, `bg-accent-hover`, `bg-accent` ✅
- `text-danger`, `bg-danger-hover` ✅

**Non-semantic values found:**

1. Hardcoded button text color: `text-[#003914]` — Acceptable per UI-SPEC L-6 (button text on accent background)

2. Chart colors in StatsChart: `#06b6d4`, `#8b5cf6`, `#10b981`, `#f59e0b` — Acceptable for chart variety, not core UI

3. **ISSUE:** Hardcoded colors in GenreFilterServer.tsx and RecommendationCarousel.tsx:
   - `bg-[#1db954]`, `text-[#003914]` (GenreFilterServer.tsx:16)
   - `bg-[#261d1d]/60`, `text-[#bccbb9]` (GenreFilterServer.tsx:26)
   - `text-white` (RecommendationCarousel.tsx:40)

Count: 21 accent color usages across codebase — within acceptable range per UI-SPEC

Files examined:
- `frontend/src/app/globals.css` — Lines 20-50
- `frontend/src/components/GenreFilter.tsx` — Uses semantic ✅

### Pillar 4: Typography (4/4)

Full typography scale per UI-SPEC L-8:

**Sizes in use:** text-xs, text-sm, text-base, text-lg, text-xl, text-2xl, text-3xl ✅
**Weights:** font-normal, font-medium, font-semibold, font-bold, font-black ✅
**Font family:** Plus Jakarta Sans via CSS variable ✅

Note: UI-SPEC declared text-h1 (32px), text-h2 (24px), text-h3 (20px) but actual code uses Tailwind arbitrary values like text-3xl, text-2xl. These map correctly.

Files examined:
- `frontend/src/app/globals.css` — Line 39
- `frontend/src/components/Header.tsx` — Lines 14, 24, 52

### Pillar 5: Spacing (4/4)

Consistent spacing per UI-SPEC L-7:

- Padding: px-3, px-4, py-2, py-3, p-4, p-6 ✅
- Margins: gap-1, gap-2, gap-4, space-x-2 ✅
- Layout: max-w-7xl per UI-SPEC L-4 ✅
- Mobile padding: px-4 ✅

No arbitrary values like [16px] or [24px] found.

Files examined:
- `frontend/src/app/layout.tsx` — Line 21
- `frontend/src/components/Header.tsx` — Line 11

### Pillar 6: Experience Design (2/4)

**Loading states present:**
- Form loading: ✅ "Logging in...", "Creating account..." (login/page.tsx:89, register/page.tsx:104)
- Spinner: ✅ Loading spinners in watchlist/page.tsx:58, stats/page.tsx:76
- Loading indicators in home page: ✅

**Error states:**
- Form errors handled: ✅ Auth feedback messages
- No ErrorBoundary found

**Empty states:**
- Watchlist empty: ✅ "You haven't rated any items yet" (watchlist/page.tsx:76)

**CRITICAL GAPS:**

1. **No focus-visible states** ❌ 
   - UI-SPEC L-11 requires: "focus-visible ring on all interactive elements"
   - Grep found: `focus-visible|focus:ring` returns NO MATCHES
   - Impact: Keyboard users cannot see focus indicator

2. **No aria-live on dynamic content** ❌
   - UI-SPEC L-14 requires: "aria-live for dynamic content" 
   - Form error messages in login/register lack aria-live
   - Impact: Screen readers miss errors

3. **GenreFilterServer uses hardcoded colors** ❌ (see Color pillar)

Files examined:
- `frontend/src/app/login/page.tsx` — Line 48-52 (error lacks aria-live)
- `frontend/src/app/register/page.tsx` — Line 49-53 (error lacks aria-live)
- All Button components — No focus-visible classes

---

## Registry Safety

Registry audit: Not applicable (shadcn not initialized for this phase)

---

## Files Audited

1. `frontend/src/app/globals.css` — Semantic tokens, font family
2. `frontend/src/app/layout.tsx` — Theme wrapper removed
3. `frontend/src/components/Header.tsx` — Semantic tokens, sticky + blur
4. `frontend/src/components/MediaCard.tsx` — Hover states
5. `frontend/src/components/GenreFilter.tsx` — Semantic tokens
6. `frontend/src/components/GenreFilterServer.tsx` — Hardcoded colors (ISSUE)
7. `frontend/src/components/StarRating.tsx` — Interactive stars
8. `frontend/src/components/StatsChart.tsx` — Chart rendering
9. `frontend/src/components/RecommendationCarousel.tsx` — Hardcoded colors (ISSUE)
10. `frontend/src/app/login/page.tsx` — Forms, no focus-visible
11. `frontend/src/app/register/page.tsx` — Forms, no focus-visible
12. `frontend/src/app/watchlist/page.tsx` — Empty state
13. `frontend/src/app/stats/page.tsx` — Loading indicator
14. `frontend/src/app/movies/[id]/page.tsx` — Detail page
15. `frontend/src/app/movies/[id]/MovieRatingClient.tsx` — Rating form
16. `frontend/src/app/books/[id]/page.tsx` — Detail page
17. `frontend/src/app/books/[id]/BookRatingClient.tsx` — Rating form
18. `frontend/src/app/page.tsx` — Multiple pages with hardcoded `text-white`
19. `frontend/src/app/movies/page.tsx` — Movie listing
20. `frontend/src/app/movies/GenreFilterServer.tsx` — Hardcoded colors (ISSUE)
21. `frontend/src/app/books/page.tsx` — Book listing
22. `frontend/src/app/books/GenreFilterServer.tsx` — Hardcoded colors (ISSUE)

---

## Additional Observations

**Build vs Runtime Discrepancy:**
The running dev server (localhost:3001) still shows `<div class="radix-themes">` in HTML but the source code has been migrated to use Tailwind semantic tokens. This indicates the running build may be stale. Recommendation: Rebuild and restart the dev server to verify migration visually.