# ---------- base ----------
FROM node:22-alpine AS base
WORKDIR /app

# ---------- deps ----------
FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci

# ---------- build ----------
FROM base AS build
COPY --from=deps /app/node_modules ./node_modules
COPY package.json package-lock.json ./
COPY tsconfig.json ./
COPY src ./src
RUN npm run build

# ---------- runner ----------
FROM node:22-alpine AS runner
WORKDIR /app

# Create non-root user
RUN addgroup -S nodejs && adduser -S hono -G nodejs

# Install only production deps
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Copy built output + runtime assets
COPY --from=build /app/dist ./dist
COPY data ./data
COPY sql ./sql
COPY docker-entrypoint.sh /docker-entrypoint.sh

RUN chmod +x /docker-entrypoint.sh

USER hono

ENV NODE_ENV=production
EXPOSE 3000

ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["api"]
