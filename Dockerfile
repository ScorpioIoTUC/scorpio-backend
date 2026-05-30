FROM node:22.12.0-alpine

WORKDIR /app

RUN corepack enable

COPY package.json yarn.lock ./
COPY prisma ./prisma
COPY prisma.config.ts ./prisma.config.ts

RUN yarn install --frozen-lockfile

COPY tsconfig.json ./tsconfig.json
COPY src ./src

RUN yarn prisma generate && yarn build

COPY docker-entrypoint.sh ./docker-entrypoint.sh
RUN chmod +x ./docker-entrypoint.sh

EXPOSE 3000

ENTRYPOINT ["./docker-entrypoint.sh"]