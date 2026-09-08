FROM node:22-bookworm-slim

WORKDIR /app

ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

COPY package*.json .npmrc ./
RUN npm ci

COPY tsconfig.json next.config.ts ./
COPY public ./public
COPY src ./src

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]

