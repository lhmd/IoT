create database if not exists `iot`;
use iot;

drop table if exists `user`;

CREATE TABLE user (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(63) NOT NULL,
    password VARCHAR(63) NOT NULL,
    email VARCHAR(63),
    phone VARCHAR(63),
    gender VARCHAR(63),
    address VARCHAR(63)
);

INSERT INTO user (username, password, email, phone, gender, address)
VALUES ('test', 'test', 'john@example.com', '1234567890', 'Male', '123 Main St');
