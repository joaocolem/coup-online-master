FROM node:21-alpine3.17 AS development

WORKDIR /app/client
COPY ./package.json /app/client
COPY ./package-lock.json /app/client
RUN npm i
COPY  . /app/client

CMD ["npm", "start"]