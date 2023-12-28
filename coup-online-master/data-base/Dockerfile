ARG version
FROM postgres:$version AS database
COPY ./arq/database.sql /docker-entrypoint-initdb.d