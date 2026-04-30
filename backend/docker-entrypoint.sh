#!/bin/sh
# Docker entrypoint script
# Usage: docker run ... [seed|api]
#   seed - run database seeding
#   api  - run the API (default)

COMMAND="${1:-api}"

echo "Running migrations..."
mysql -h "$DB_HOST" -u "$DB_USER" -p"$DB_PASS" "$DB_NAME" < /app/sql/schema.sql

if [ "$COMMAND" = "seed" ]; then
  echo "Running database seed..."
  npm run db:seed
else
  echo "Starting API server..."
  exec node dist/index.js
fi
