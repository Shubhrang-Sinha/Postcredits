# Architecture

**Analysis Date:** 2026-04-24

## Pattern Overview

**Overall:** Minimal Node.js API Server

**Key Characteristics:**
- Lightweight web framework (Hono)
- Single entry point architecture
- Containerized with Docker
- PostgreSQL database backing

## Layers

**API Layer:**
- Purpose: Handle HTTP requests and responses
- Location: `backend/src/index.ts`
- Contains: Hono app, route handlers
- Depends on: Hono framework, @hono/node-server
- Used by: External clients via HTTP

**Server Layer:**
- Purpose: Serve the API and manage the Node.js runtime
- Location: `backend/src/index.ts` (lines 10-14)
- Contains: serve() configuration
- Depends on: @hono/node-server
- Used by: API Layer

**Container Orchestration:**
- Purpose: Container management and service coordination
- Location: `docker-compose.yml`
- Contains: Service definitions for db and backend
- Depends on: Docker runtime
- Used by: Deployment/Development environment

## Data Flow

**API Request Flow:**

1. Client sends HTTP request to `localhost:3000`
2. @hono/node-server receives request
3. Hono app processes routing
4. Handler processes request (currently returns "Hello Hono!")
5. Response sent back to client

**Database Connection Flow:**

1. Backend container starts (depends_on db: healthy)
2. DATABASE_URL connects to PostgreSQL
3. Application queries database via connection string

**State Management:**
- No application state - stateless API
- Database maintains persistent state
- Environment variables configure runtime

## Key Abstractions

**Hono Application:**
- Purpose: Web application framework
- Examples: `backend/src/index.ts`
- Pattern: Declarative routing with middleware

## Entry Points

**Backend API:**
- Location: `backend/src/index.ts`
- Triggers: HTTP requests to port 3000
- Responsibilities: Route handling, response generation

**Development Server:**
- Location: `backend/package.json` (script: dev)
- Triggers: `npm run dev`
- Responsibilities: Watch mode, auto-reload

**Production Server:**
- Location: `backend/Dockerfile` (CMD)
- Triggers: Docker container start
- Responsibilities: Serve compiled JavaScript

## Error Handling

**Strategy:** Default Hono error handling

**Patterns:**
- Route not found returns 404
- Unhandled errors return 500
- No custom error middleware currently implemented

## Cross-Cutting Concerns

**Logging:** Console.log for startup messages only  
**Validation:** None implemented  
**Authentication:** None implemented  

---

*Architecture analysis: 2026-04-24*