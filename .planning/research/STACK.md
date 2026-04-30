# Technology Stack

**Analysis Date:** 2026-04-24

## Database

**Primary:** MySQL 8.x (per instructor requirement)

- No PostgreSQL, No advanced databases
- Must use MySQL, Oracle, or SQL Server

## PL/SQL Components (Required)

### Stored Procedures

- Used for multi-step operations
- Example: `calculate_blend` for recommendations
- Can use IN, OUT, INOUT parameters
- Must use DELIMITER to define

### Stored Functions

- Return a single value or table
- Used for similarity calculations
- Example: `calculate_similarity(user1_id, user2_id)`

### Cursors

- Iterate through result sets row-by-row
- Required pattern:
  1. DECLARE cursor FOR SELECT
  2. DECLARE CONTINUE HANDLER FOR NOT FOUND
  3. OPEN cursor
  4. FETCH into variables
  5. CLOSE cursor

### Triggers

- BEFORE/AFTER INSERT/UPDATE/DELETE
- AUTOMATED operations (e.g., update average rating)
- Must use OLD and NEW references

## Best Practices

- All logic in MySQL stored procedures
- No external AI or ML
- 3NF normalized schema
- Transactions with COMMIT/ROLLBACK

## Tools

- MySQL Workbench or SQL Shell
- No automated SQL generators (per instructor)

---

_Stack analysis: 2026-04-24_
