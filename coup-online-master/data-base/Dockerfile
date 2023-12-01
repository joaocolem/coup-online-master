FROM postgres:16.1-alpine3.17 AS database

COPY ./arq/database.sql /var/lib/postgresql
COPY ./config.sh /docker-entrypoint-initdb.d