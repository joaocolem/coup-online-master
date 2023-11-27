CREATE TABLE users (
    user_id int,
    name varchar(80),
    email varchar(80),
    password varchar(255),
    nickname varchar(20)
);

INSERT INTO users(name, email, password, nickname) VALUES('Lucas', 'email@email', '1234', 'nickname');