#!/bin/sh
set -e

yarn prisma migrate deploy
yarn seed
exec node dist/server.js