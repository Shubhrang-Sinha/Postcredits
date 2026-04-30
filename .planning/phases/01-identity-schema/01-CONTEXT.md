# Phase 1: Identity & Schema - Context

**Gathered:** 2026-04-30
**Status:** Ready for planning

<domain>
## Phase Boundary

Create ER diagram (mermaid in README), 3NF schema, and user authentication system. Deliver a working demo MVP.
- ER diagram for the database
- DDL scripts for MySQL
- User registration/login (JWT-based)
- Admin user handling

**This is MVP-focused** — build fast, demoable, not production-ready.

</domain>

<decisions>
## Implementation Decisions

### D-01: Session Strategy
- **Decision:** Stateless JWT (no sessions table)
- **Rationale:** Simpler, faster, matches existing auth.ts implementation
- **User's intent:** Quick MVP demo

### D-02: Password Hashing
- **Decision:** bcrypt with default rounds (10)
- **Rationale:** Standard, fast enough for MVP

### D-03: ER Diagram Format
- **Decision:** Mermaid.js in README.md
- **Rationale:** User explicitly requested "mermaid in the readme"
- **Format:** GitHub-flavored markdown with mermaid blocks

### D-04: Admin User Handling
- **Decision:** Simple role column in users table (ENUM: 'user', 'admin')
- **Rationale:** User said "hardcoded admin" — keep it simple
- **Implementation:** First registered user can be manually set as admin via direct SQL, or add a seed admin

### D-05: MVP Scope
- **Decision:** Fast, demoable authentication only
- **Scope creep prevention:** No email verification, no password reset, no OAuth
- **Goal:** Get to working demo quickly

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Database Design
- `backend/sql/schema.sql` — Existing DDL (will need review for 3NF)
- `backend/sql/plsql.sql` — Existing PL/SQL (procedures, functions, triggers)

### API Implementation
- `backend/src/routes/auth.ts` — Existing auth routes
- `backend/src/middleware/auth.ts` — JWT middleware

### Documentation
- `README.md` — Where ER diagram will go (mermaid format)

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `backend/src/routes/auth.ts` — Has register/login/logout/me endpoints (stateless JWT)
- `backend/src/middleware/auth.ts` — JWT verification middleware
- `backend/src/db/index.ts` — MySQL connection pool

### Established Patterns
- JWT token stored in Authorization header (Bearer token)
- bcrypt for password hashing
- MySQL 8.x connection via mysql2

### Integration Points
- New auth routes go in `/auth/` prefix (already defined)
- Users table already exists in schema.sql

</code_context>

<specifics>
## Specific Ideas

- ER diagram: Mermaid.js embedded in README.md
- Admin: Simple ENUM('user', 'admin') role, manual seed or direct SQL
- Focus on speed to demo

</specifics>

<deferred>
## Deferred Ideas

- Email verification — Not in v1 scope
- Password reset flow — Not in v1 scope  
- OAuth login — User explicitly ruled out

</deferred>

---

*Phase: 01-identity-schema*
*Context gathered: 2026-04-30*