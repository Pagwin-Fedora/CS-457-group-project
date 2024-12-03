FROM node:23-alpine3.19

RUN apk add --no-cache curl

COPY . /app

WORKDIR /app

RUN npm install

EXPOSE 80/tcp

CMD ["node", "/app/index.mjs"]

