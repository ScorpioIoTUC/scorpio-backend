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

EXPOSE 3000

CMD ["node", "dist/server.js"]