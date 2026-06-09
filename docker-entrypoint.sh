#!/bin/sh
set -e

npx prisma migrate deploy
npx ts-node prisma/seed.ts
exec node dist/server.js