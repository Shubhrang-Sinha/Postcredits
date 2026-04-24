# Roadmap: Postcredits

**Created:** 2026-04-24
**Phases:** 4 | **Requirements:** 25 | **All v1 covered:** ✓

## Phase Summary

| # | Phase | Goal | Requirements | Success Criteria |
|---|-------|------|--------------|-------------------|
| 1 | Identity & Schema | ER model, tables, user auth | IDM-01 to IDM-04 | 4 |
| 2 | Media Catalog | Books, movies, genres | BOOK-01 to GENR-03 | 12 |
| 3 | Ratings & Triggers | Rating system, triggers | RATE-01 to RATE-05 | 5 |
| 4 | Discovery Engine | Blend recommendations, stats | STAT-01 to BLND-04 | 9 |

---

## Phase 1: Identity & Schema

**Goal:** Create ER diagram, 3NF schema, user authentication

**Requirements:**
- IDM-01: User can register with email and password
- IDM-02: User can log in and stay logged in
- IDM-03: User can log out from any page
- IDM-04: Password stored securely (hashed)

**Success Criteria:**
1. ER diagram delivered (E-R modeling required)
2. Relational schema in 3NF
3. Users table with secure password storage
4. Login/logout session works

**Deliverables:**
- ER Diagram (E-R model)
- DDL scripts (CREATE TABLE)
- User registration procedure
- Login procedure

---

## Phase 2: Media Catalog

**Goal:** Books and movies catalog with genre management

**Requirements:**
- BOOK-01: Admin can add books to catalog
- BOOK-02: Book has title, author, pages, release year
- BOOK-03: Users can view book details
- MOV-01: Admin can add movies to catalog
- MOV-02: Movie has title, director, duration, release year
- MOV-03: Users can view movie details
- GENR-01: Genres defined in database
- GENR-02: Books and movies can have multiple genres
- GENR-03: Users can filter by genre

**Success Criteria:**
1. Works table with Books/Movies extension
2. Creators table (Authors/Directors)
3. Work_Genres junction table
4. CRUD procedures for all media

**Deliverables:**
- Works, Books, Movies tables
- Creators table (Authors/Directors)
- Genres, Work_Genres tables
- Insert/update procedures

---

## Phase 3: Ratings & Triggers

**Goal:** User rating system with automated triggers

**Requirements:**
- RATE-01: User can rate a book (1-5)
- RATE-02: User can rate a movie (1-5)
- RATE-03: Rating has timestamp
- RATE-04: User can update their rating
- RATE-05: Average rating auto-calculated (trigger)

**Success Criteria:**
1. Ratings table with foreign keys
2. Insert rating procedure
3. UPDATE trigger for average calculation
4. Transaction handling

**Deliverables:**
- Ratings table
- `rate_media` procedure
- Trigger: `trg_update_avg_rating`
- COMMIT/ROLLBACK handling

---

## Phase 4: Discovery Engine

**Goal:** Blend recommendations and Spotistats dashboard

**Requirements:**
- STAT-01: User sees most-watched genres
- STAT-02: User sees most-read genres
- STAT-03: User sees highest-rated years
- BLND-01: Function calculates similarity between users
- BLND-02: Procedure generates recommendation list
- BLND-03: Cursors process large result sets
- BLND-04: Recommendations via SQL, no external AI

**Success Criteria:**
1. Similarity function returns score
2. Blend procedure generates list
3. Dashboard queries work
4. Pure SQL, no external services

**Deliverables:**
- Function: `fn_calculate_similarity`
- Function: `fn_get_taste_profile`
- Procedure: `proc_generate_blend` (with cursor)
- Procedure: `proc_get_spotistats`
- Spotistats dashboard queries

---

## Execution Notes

- **Phase 1-2:** Should complete first (database design)
- **Phase 3:** Requires Phase 1-2 (ratings need users + works)
- **Phase 4:** Requires all prior phases

---

*Roadmap: 2026-04-24*
*All v1 requirements covered ✓*