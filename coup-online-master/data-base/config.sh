#! /bin/bash
createdb mydb

psql mydb < /var/lib/postgresql/database.sql