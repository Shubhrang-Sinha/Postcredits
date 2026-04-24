# Database Architecture

**Analysis Date:** 2026-04-24

## Core Design

### Parent-Child Entity: Works

- **Works** table: shared attributes (title, year, type)
- **Books** table: extends Works (pages, author)
- **Movies** table: extends Works (duration, director)

### Relationships

- Users → Rate → Works (many-to-many via Ratings)
- Creators → Create → Works (Authors/Directors as Creators)
- Works → Have → Genres (many-to-many via Work_Genres)

## Normalization: 3NF

1. **1NF:** Multi-valued attributes in separate tables
2. **2NF:** Full dependency on primary key
3. **3NF:** No transitive dependencies

## Key Tables

| Table | Purpose |
|-------|---------|
| Users | Account management |
| Works | Unified media entity |
| Books | Book-specific data |
| Movies | Movie-specific data |
| Creators | Authors/Directors |
| Ratings | User-work ratings |
| Genres | Genre definitions |
| Work_Genres | Works-Genres linking |

## Indexing Strategy

- PRIMARY KEY on all tables
- FOREIGN KEY constraints
- INDEX on (user_id, work_id) for ratings
- INDEX on (work_id) for work queries

---

*Architecture analysis: 2026-04-24*