# Requirements: Postcredits

**Defined:** 2026-04-24
**Core Value:** Users discover new books and movies through taste-similarity recommendations computed entirely in MySQL

## v1 Requirements

### Identity Management

- [ ] **IDM-01**: User can register with email and password
- [ ] **IDM-02**: User can log in and stay logged in
- [ ] **IDM-03**: User can log out from any page
- [ ] **IDM-04**: Password stored securely (hashed)

### Media Catalog (Books)

- [ ] **BOOK-01**: Admin can add books to catalog
- [ ] **BOOK-02**: Book has title, author, pages, release year
- [ ] **BOOK-03**: Users can view book details

### Media Catalog (Movies)

- [ ] **MOV-01**: Admin can add movies to catalog
- [ ] **MOV-02**: Movie has title, director, duration, release year
- [ ] **MOV-03**: Users can view movie details

### Genres

- [ ] **GENR-01**: Genres defined in database
- [ ] **GENR-02**: Books and movies can have multiple genres
- [ ] **GENR-03**: Users can filter by genre

### Ratings

- [ ] **RATE-01**: User can rate a book (1-5)
- [ ] **RATE-02**: User can rate a movie (1-5)
- [ ] **RATE-03**: Rating has timestamp
- [ ] **RATE-04**: User can update their rating
- [ ] **RATE-05**: Average rating auto-calculated (trigger)

### Spotistats Dashboard

- [ ] **STAT-01**: User sees most-watched genres
- [ ] **STAT-02**: User sees most-read genres
- [ ] **STAT-03**: User sees highest-rated years

### Blend Recommendations

- [ ] **BLND-01**: Function calculates similarity between users
- [ ] **BLND-02**: Procedure generates recommendation list
- [ ] **BLND-03**: Cursors process large result sets
- [ ] **BLND-04**: Recommendations via SQL, no external AI

## v2 Requirements

- **BLND-05**: Collaborative filtering algorithm
- **STAT-04**: Charts/visualizations for dashboard

## Out of Scope

| Feature | Reason |
|---------|--------|
| Real-time chat | High complexity, not core |
| OAuth login | Email/password sufficient |
| Mobile app | Web-first only |
| Video/content streaming | Out of scope |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| IDM-01 | Phase 1 | Pending |
| IDM-02 | Phase 1 | Pending |
| IDM-03 | Phase 1 | Pending |
| IDM-04 | Phase 1 | Pending |
| BOOK-01 | Phase 2 | Pending |
| BOOK-02 | Phase 2 | Pending |
| BOOK-03 | Phase 2 | Pending |
| MOV-01 | Phase 2 | Pending |
| MOV-02 | Phase 2 | Pending |
| MOV-03 | Phase 2 | Pending |
| GENR-01 | Phase 2 | Pending |
| GENR-02 | Phase 2 | Pending |
| GENR-03 | Phase 2 | Pending |
| RATE-01 | Phase 3 | Pending |
| RATE-02 | Phase 3 | Pending |
| RATE-03 | Phase 3 | Pending |
| RATE-04 | Phase 3 | Pending |
| RATE-05 | Phase 3 | Pending |
| STAT-01 | Phase 4 | Pending |
| STAT-02 | Phase 4 | Pending |
| STAT-03 | Phase 4 | Pending |
| BLND-01 | Phase 4 | Pending |
| BLND-02 | Phase 4 | Pending |
| BLND-03 | Phase 4 | Pending |
| BLND-04 | Phase 4 | Pending |

**Coverage:**
- v1 requirements: 25 total
- Mapped to phases: 25
- Unmapped: 0 ✓

---
*Requirements defined: 2026-04-24*
*Last updated: 2026-04-24 after research*