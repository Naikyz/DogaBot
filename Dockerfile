FROM node:16.10.0-alpine
ENV TOKEN= #TOKEN

WORKDIR /app

COPY    package.json ./

RUN     npm install

COPY    . .

CMD ["node", "index.js"]