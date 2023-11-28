CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    email varchar(80),
    password varchar(255),
    nickname varchar(20)
);

INSERT INTO users(email, password, nickname) VALUES('email@email', '1234', 'nickname');