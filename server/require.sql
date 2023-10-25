create database if not exists `iot`;
use iot;

drop table if exists `user`;

CREATE TABLE user (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(63) NOT NULL UNIQUE,  -- 添加 UNIQUE 约束以确保用户名唯一
    password VARCHAR(63) NOT NULL,
    email VARCHAR(63) UNIQUE,  -- 添加 UNIQUE 约束以确保电子邮件唯一
    phone VARCHAR(63),
    gender VARCHAR(63),
    address VARCHAR(63)
);

INSERT INTO user (username, password, email, phone, gender, address)
VALUES ('test123', 'test123', 'john@example.com', '1234567890', 'Male', '123 Main St');
