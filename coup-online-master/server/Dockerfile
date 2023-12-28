FROM node:21-alpine3.17 AS development

WORKDIR /app/server
COPY package.json .
COPY package-lock.json .

CMD ["sh", "-c", "npm i && npm start"]