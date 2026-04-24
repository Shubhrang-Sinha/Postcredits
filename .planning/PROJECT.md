# Postcredits

## What This Is

A unified media tracking platform that lets users track both books and movies in one place, generating collaborative recommendations through pure SQL logic. Users can catalog their reading/watching history, rate items, and discover new content through "Blend" recommendations that compare their taste with other users.

## Core Value

Users discover new books and movies through taste-similarity recommendations computed entirely in MySQL — no external AI needed.

## Requirements

### Validated

- ✓ TypeScript + Hono API — backend/src/index.ts
- ✓ MySQL database — docker-compose.yml
- ✓ Node.js 22 runtime — backend/package.json

### Active

- [ ] User authentication (sign-up, login, sessions)
- [ ] Media catalog (books: authors, pages; movies: directors, duration)
- [ ] Unified Works entity (shared: title, year, genres)
- [ ] User ratings with timestamps
- [ ] "Spotistats" dashboard (genre stats, year stats)
- [ ] "Blend" recommendation engine (PL/pgSQL)
- [ ] Automated average rating updates (triggers)

### Out of Scope

- [Real-time chat] — High complexity, not core to discovery value
- [OAuth login] — Email/password sufficient for v1
- [Mobile app] — Web-first, mobile later

## Context

- **Course:** UCS310 – Database Management Systems (TIET)
- **Team:** Akshitaa Jasrotia, Saurya Gur, Shubhrang Sinha
- **Instructor:** Gayatri Saxena
- **Academic Year:** 2025-2026

- **Existing code:** Minimal Hono API on port 3000, PostgreSQL via docker-compose
- **Database:** 3NF normalized schema required

## Constraints

- **Database:** MySQL (per instructor requirement) — all logic in PL/SQL
- **Procedure:** Must use PL/SQL procedures, functions, cursors, triggers
- **No advanced DB:** Cannot use PostgreSQL features
- **No external AI:** Recommendations via SQL comparisons
- **Transactions:** Required for data consistency

## Key Decisions

| Decision | Rationale | Outcome |
|---------|-----------|--------|
| Hono framework | Lightweight, TypeScript-first | — Pending |
| MySQL for all logic | Course requirement, PL/SQL per Instructor | — Pending |
| Unified Works entity | Share traits between books/movies | — Pending |
| Trigger for avg ratings | Automated stats per DB requirement | — Pending |

---

*Last updated: 2026-04-24 after initial discussion*