# Technology Stack

**Analysis Date:** 2026-04-24

## Languages

**Primary:**

- TypeScript 5.8.3 - Backend API implementation

**Secondary:**

- JavaScript - Compiled output from TypeScript

## Runtime

**Environment:**

- Node.js 22 - Docker base image (node:22-alpine)

**Package Manager:**

- npm (comes with Node.js)
- Lockfile: `backend/package-lock.json` (present)

## Frameworks

**Core:**

- Hono 4.11.9 - Web framework for building APIs
- @hono/node-server 1.19.9 - Node.js adapter for Hono

**Build/Dev:**

- tsx 4.7.1 - TypeScript execute/REPL for development
- TypeScript 5.8.3 - Type checking and compilation

## Key Dependencies

**Critical:**

- hono 4.11.9 - Lightweight web framework
- @hono/node-server 1.19.9 - Server runtime adapter

**Infrastructure:**

- PostgreSQL 16-alpine - Database (via Docker)

## Configuration

**Environment:**

- docker-compose.yml manages service configuration
- Environment variables passed at container runtime
- Key config: DATABASE_URL, PORT, NODE_ENV

**Build:**

- TypeScript: `backend/tsconfig.json`
- Docker: `backend/Dockerfile` (multi-stage build)
- Package: `backend/package.json`

## Platform Requirements

**Development:**

- Node.js 22+
- npm
- Docker & docker-compose (optional)

**Production:**

- Docker container runtime
- PostgreSQL 16 database

---

_Stack analysis: 2026-04-24_
