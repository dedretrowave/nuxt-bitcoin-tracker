FROM node:18-alpine

WORKDIR /app

COPY ./package*.json ./

COPY ./pages ./pages
COPY ./server ./server
COPY ./.env ./
COPY ./nuxt.config.ts ./
COPY ./public ./

RUN npm install

COPY . .

CMD ["npm", "run", "dev"]