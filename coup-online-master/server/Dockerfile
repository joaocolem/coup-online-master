FROM node:21-alpine3.17 AS development

WORKDIR /app/server
COPY ./package.json /app/server
COPY ./package-lock.json /app/server
RUN npm i
COPY  . /app/server

CMD ["npm", "start"]