FROM node:22-alpine AS base
WORKDIR /app

FROM base AS builder
RUN apk add --no-cache gcompat

COPY package.json package-lock.json ./
RUN npm ci

COPY tsconfig.json ./
COPY src ./src
COPY data ./data
copy docker-entrypoint.sh ./

RUN npm run build && npm prune --omit=dev

FROM base AS runner
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs \
  && adduser  --system --uid 1001 hono

COPY --from=builder --chown=hono:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=hono:nodejs /app/dist ./dist
COPY --from=builder --chown=hono:nodejs /app/package.json ./package.json
COPY --from=builder --chown=hono:nodejs /app/data ./data

USER hono

ENV NODE_ENV=production
EXPOSE 3000

COPY --from=builder --chown=hono:nodejs /app/docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

# Default command runs API, but can be overridden to seed
ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["api"]
