# Database Pitfalls

**Analysis Date:** 2026-04-24

## Common Mistakes to Avoid

### 1. Design Errors

- **Polymorphic relationships without proper FK** — Use junction tables
- **Missing indexes on foreign keys** — Slow queries
- **Storing multi-valued data in single column** — Violates 1NF

### 2. PL/SQL Pitfalls

- **Forgetting DELIMITER** — Procedure definition fails
- **Handler before cursor** — Error 1337, declare in order: vars → cursor → handler
- **No handler for NOT FOUND** — Cursor crashes on empty result
- **Missing END$$** — Syntax errors

### 3. Performance Issues

- **N+1 queries in cursor loops** — Use SET-based operations when possible
- **Missing LIMIT in cursor** — Could iterate forever
- **No transactions** — Inconsistent data

### 4. Academic Project Gotchas

- **Not using required components** — Must show: procedures, functions, cursors, triggers
- **Missing 3NF reasoning** — Need to explain normalization
- **No E-R diagram** — Required deliverable
- **Copying from internet without understanding** — Instructor will ask questions

## Required Components Checklist

- [ ] At least 2 stored procedures
- [ ] At least 2 stored functions
- [ ] At least 1 cursor
- [ ] At least 2 triggers
- [ ] Transaction management (COMMIT/ROLLBACK)

---

_Pitfalls analysis: 2026-04-24_
