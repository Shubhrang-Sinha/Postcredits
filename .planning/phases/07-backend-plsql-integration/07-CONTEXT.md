# Phase 7: Backend PL/SQL Integration - Context

**Gathered:** 2026-05-02  
**Status:** Ready for planning

<domain>
## Phase Boundary

Integrate the existing PL/SQL procedures from `backend/sql/plsql.sql` into the actual backend code. Currently, the procedures exist but are NOT called - the backend reimplements the logic in TypeScript instead.

**Prerequisite:** Phase 4 (Discovery Engine) must be complete - it is ✓

</domain>

<decisions>
## Implementation Decisions

### D-01: Keep MySQL (Instructor Requirement)

- PostgreSQL mentioned in concept doc, but instructor mandates MySQL 8.0
- Update concept doc to reflect MySQL (not a bug)

### D-02: Use Euclidean Distance (Not Cosine/Pearson)

- User explicitly chose Euclidean distance for similarity
- `fn_calculate_similarity` in plsql.sql already uses Euclidean
- Keep this algorithm

### D-03: Per-User Stats Only (Not Per-Pair Yet)

- Spotistats will be per-user only (not per blended pair)
- Can still call it "Spotistats" in frontend display
- Simpler implementation for course requirements

### D-04: PL/SQL Procedures ARE Important

- Must use the actual procedures in `plsql.sql`
- Procedures exist: `fn_calculate_similarity`, `fn_get_taste_profile`, `proc_generate_blend`, `proc_get_spotistats`
- Backend currently reimplements in TypeScript - this is wrong

### D-05: Materialized Views Needed

- Currently only 1 regular VIEW (`work_avg_rating`)
- Need materialized views for:
  - User similarity scores
  - Blend recommendations
  - Spotistats aggregations

### D-06: BlendPairs Table - Decision Needed

- For precomputing recommendations between specific user pairs
- OR keep on-demand calculation (simpler)
- **Decision: Keep on-demand for now** (course project scope)

</decisions>

<canonical_refs>

## Canonical References

**Phase 4 Deliverables:**

- `backend/sql/plsql.sql` — PL/SQL procedures (EXISTS but NOT USED)
- `backend/src/routes/recommendations.ts` — Currently uses TypeScript, not PL/SQL
- `backend/src/routes/stats.ts` — Basic stats, not using `proc_get_spotistats`

**PL/SQL Procedures Available:**

- `fn_calculate_similarity(user1_id, user2_id)` — Returns DECIMAL(5,2)
- `fn_get_taste_profile(user_id, work_type)` — Returns VARCHAR(1000)
- `proc_generate_blend(user_id, work_type, limit)` — Cursor-based, generates recommendations
- `proc_get_spotistats(user_id, work_type)` — Gets user stats

</canonical_refs>

<code_context>

## Existing Code Analysis

### What Exists But Isn't Used:

- `backend/sql/plsql.sql` — 298 lines of PL/SQL procedures
- Procedures are NEVER CALLED in the backend

### What Backend Currently Does (Wrong):

- `backend/src/routes/recommendations.ts`:
  - `calculateSimilarity()` — TypeScript reimplementation (lines 46-84)
  - `generateBlendRecommendations()` — TypeScript reimplementation (lines 86-147)
  - Should CALL `proc_generate_blend()` instead

- `backend/src/routes/stats.ts`:
  - Direct SQL queries for genre/year stats
  - Should CALL `proc_get_spotistats()` instead

### What Needs to Change:

1. Modify routes to CALL PL/SQL procedures
2. Parse procedure results and return to frontend
3. Add materialized views for performance
4. Update concept doc to say MySQL (not PostgreSQL)

</code_context>

<specifics>
## Specific Ideas

### 1. Fix Recommendations Route

- Change `calculateSimilarity()` to use: `SELECT fn_calculate_similarity(?, ?)`
- Change `generateBlendRecommendations()` to CALL `proc_generate_blend(?, ?, ?)`
- Parse the cursor results from the procedure

### 2. Fix Stats Route

- Add endpoint that CALLS `proc_get_spotistats(?, ?)`
- Return the taste profile to frontend

### 3. Add Materialized Views

- Create views for commonly accessed data:
  - User similarity precomputations
  - Work recommendations per user
  - Genre statistics per user

### 4. Document in Code

- Add comments explaining why PL/SQL is used (course requirement)
- Show the procedure being called vs TypeScript reimplementation

</specifics>

<deferred>
## Deferred Ideas

- **BlendPairs table** — Precompute between user pairs (Phase 8 maybe)
- **Redis caching** — Phase 8 (performance optimization)
- **PWA/offline support** — Phase 8 (optional feature)
- **Cold-start onboarding flow** — Phase 8 (user experience)

</deferred>

---

_Phase: 07-backend-plsql-integration_  
_Context gathered: 2026-05-02_
