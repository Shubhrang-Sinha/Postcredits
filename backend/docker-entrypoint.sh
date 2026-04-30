#!/bin/sh
# Docker entrypoint script
# Usage: docker run ... [seed|api]
#   seed - run database seeding
#   api  - run the API (default)

COMMAND="${1:-api}"

if [ "$COMMAND" = "seed" ]; then
  echo "Running database seed..."
  cd /app
  npm run db:seed
else
  echo "Starting API server..."
  exec node dist/index.js
fi