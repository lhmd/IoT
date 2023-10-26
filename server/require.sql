create database if not exists `iot`;
use iot;

drop table if exists `message`;
drop table if exists `device`;
drop table if exists `user`;

CREATE TABLE user (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(20) NOT NULL UNIQUE,  -- 添加 UNIQUE 约束以确保用户名唯一
    password VARCHAR(20) NOT NULL,
    email VARCHAR(60) UNIQUE,  -- 添加 UNIQUE 约束以确保电子邮件唯一
    phone VARCHAR(20),
    gender VARCHAR(20),
    address VARCHAR(60)
);

CREATE TABLE device (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    type VARCHAR(20) NOT NULL,
    status ENUM('Running', 'Fault', 'Shutdown') NOT NULL,
    location VARCHAR(60) NOT NULL,
    owner VARCHAR(20) NOT NULL,
    description VARCHAR(255),
    FOREIGN KEY (owner) REFERENCES user(username)
);

CREATE TABLE message (
    id INT AUTO_INCREMENT PRIMARY KEY,
    device_name VARCHAR(255) NOT NULL,
    time VARCHAR(100) NOT NULL,
    content VARCHAR(255),
    FOREIGN KEY (device_name) REFERENCES device(name)
);

INSERT INTO user (username, password, email, phone, gender, address)
VALUES ('1', '1', 'john@example.com', '1234567890', 'Male', '123 Main St');

INSERT INTO device (name, type, status, location, owner, description)
VALUES ('test123', 'Temperature', 'Running', '123 Main St', '1', 'test123');

INSERT INTO message (device_name, time, content)
VALUES ('test123', '2019-01-01 00:00:00', 'test123');