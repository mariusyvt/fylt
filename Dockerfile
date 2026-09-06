FROM node:22-bookworm-slim

WORKDIR /app

COPY package*.json .npmrc ./
RUN npm ci

COPY tsconfig.json next.config.ts next-env.d.ts ./
COPY public ./public
COPY src ./src

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
