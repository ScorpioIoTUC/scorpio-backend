FROM node:22.12.0-alpine

WORKDIR /app

RUN corepack enable

COPY package.json package-lock.json ./

COPY prisma ./prisma
COPY prisma.config.ts ./prisma.config.ts

RUN npm ci

COPY tsconfig.json ./tsconfig.json
COPY src ./src

RUN npx prisma generate && npm run build

COPY docker-entrypoint.sh ./docker-entrypoint.sh
RUN chmod +x ./docker-entrypoint.sh

EXPOSE 3000

ENTRYPOINT ["./docker-entrypoint.sh"]