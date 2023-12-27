ARG version
FROM node:$version AS development
WORKDIR /app/client
COPY package.json .
COPY package-lock.json .
CMD [ "sh", "-c", "npm i && npm start" ]