FROM node:20-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci

COPY . .

RUN npm install # atualizar as dependências
RUN npm run build

FROM node:20-alpine AS run
WORKDIR /app

ENV NODE_ENV=production
COPY --from=build /app/public ./public
COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static

EXPOSE 3000

CMD ["node", "server.js"]
