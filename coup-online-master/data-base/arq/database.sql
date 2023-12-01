
DROP TABLE IF EXISTS users;

CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    email varchar(80) UNIQUE,
    password varchar(255),
    nickname varchar(20) UNIQUE
);

INSERT INTO users(email, password, nickname) VALUES('email@email.com', '1234', 'nickname');
INSERT INTO users(email, password, nickname) VALUES('email2@email2.com', '1234', 'nickname2');