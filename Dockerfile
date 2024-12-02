FROM node:23-alpine3.19

COPY . /app

WORKDIR /app

RUN npm install

EXPOSE 8080/tcp

CMD ["/app/index.mjs"]
