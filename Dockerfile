FROM node:16.10.0-alpine

WORKDIR /app

COPY    package.json ./

RUN     npm install

COPY    . .

CMD ["node", "index.js"]