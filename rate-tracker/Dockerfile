FROM node:18-alpine

RUN npm install -g nodemon

WORKDIR /app

COPY ./package*.json ./
COPY ./index.js ./
COPY ./.env ./

RUN npm install

COPY . .

EXPOSE 3001

CMD ["nodemon", "index.js"]