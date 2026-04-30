# Phase 1: Identity & Schema - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-04-30
**Phase:** 01-identity-schema
**Areas discussed:** Session strategy, bcrypt rounds, ER diagram format, admin user handling, MVP scope

---

## Session Strategy

| Option               | Description                                                | Selected |
| -------------------- | ---------------------------------------------------------- | -------- |
| Server-side sessions | Tokens stored in sessions table, validated on each request |          |
| Stateless JWT        | Token contains user info, no server state                  | ✓        |

**User's choice:** Stateless JWT — "I want this to be a fast finished MVP"
**Notes:** Existing auth.ts already implements stateless JWT

---

## Bcrypt Rounds

| Option    | Description         | Selected |
| --------- | ------------------- | -------- |
| 10 rounds | Standard, fast      | ✓        |
| 12 rounds | More secure, slower |          |

**User's choice:** Default (10 rounds) — fast for MVP
**Notes:** OK with standard bcrypt

---

## ER Diagram Format

| Option            | Description                | Selected |
| ----------------- | -------------------------- | -------- |
| PDF               | External document          |          |
| draw.io           | External diagrams          |          |
| Mermaid in README | Inline, version-controlled | ✓        |

**User's choice:** Mermaid in readme — explicitly stated "ER diagram should be in mermaid in the readme"
**Notes:** Will go in README.md

---

## Admin User Handling

| Option               | Description                 | Selected |
| -------------------- | --------------------------- | -------- |
| Separate admin table | More flexible, more complex |          |
| Role column in users | Simple ENUM                 | ✓        |

**User's choice:** Hardcoded admin — "hardcoded admin" preference
**Notes:** Simple role ENUM('user', 'admin'), first user manually set as admin

---

## MVP Scope

**Summary of discussion:**

- User emphasized: "fast finished MVP with a working demo"
- Not aiming for production-ready
- Skip: email verification, password reset, OAuth

---

## Deferred Ideas

- Email verification — Not in v1 scope (user explicitly said no)
- Password reset — Not in v1 scope
- OAuth login — User ruled out (email/password sufficient)
