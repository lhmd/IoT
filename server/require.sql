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
    type ENUM('Sensor', 'Camera', 'Actuator', 'Gateway', 'Lock', 'Tracker') NOT NULL,
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
    FOREIGN KEY (device_name) REFERENCES device(name) ON UPDATE CASCADE ON DELETE CASCADE
);

INSERT INTO user (username, password, email, phone, gender, address)
VALUES ('1', '1', 'john@example.com', '1234567890', 'Male', '123 Main St');

INSERT INTO device (name, type, status, location, owner, description)
VALUES ('test123', 'Actuator', 'Shutdown', '123 Main St', '1', 'test123');

INSERT INTO message (device_name, time, content)
VALUES ('test123', '2019-01-01 00:00:00', 'test123');

-- 插入随机用户数据
INSERT INTO user (username, password, email, phone, gender, address)
VALUES
    ('user1', 'password1', 'user1@example.com', '1234567890', 'Male', '123 Main St'),
    ('user2', 'password2', 'user2@example.com', '9876543210', 'Female', '456 Elm St'),
    ('user3', 'password3', 'user3@example.com', '5555555555', 'Male', '789 Oak St'),
    ('user4', 'password4', 'user4@example.com', '1111111111', 'Female', '987 Maple St'),
    ('user5', 'password5', 'user5@example.com', '9999999999', 'Male', '654 Birch St');

-- 插入随机设备数据
INSERT INTO device (name, type, status, location, owner, description)
VALUES
    ('Device1', 'Sensor', 'Running', 'Location1', 'user1', 'Sensor device'),
    ('Device2', 'Camera', 'Fault', 'Location2', 'user2', 'Camera device'),
    ('Device3', 'Sensor', 'Shutdown', 'Location3', 'user1', 'Sensor device'),
    ('Device4', 'Camera', 'Running', 'Location4', 'user3', 'Camera device'),
    ('Device5', 'Sensor', 'Running', 'Location5', 'user4', 'Sensor device');

-- 插入随机消息数据
INSERT INTO message (device_name, time, content)
VALUES
    ('Device1', '2023-10-26 10:00:00', 'Sensor data 1'),
    ('Device2', '2023-10-26 10:15:00', 'Camera data 1'),
    ('Device3', '2023-10-26 10:30:00', 'Sensor data 2'),
    ('Device4', '2023-10-26 10:45:00', 'Camera data 2'),
    ('Device5', '2023-10-26 11:00:00', 'Sensor data 3'),
    ('Device1', '2023-10-26 11:15:00', 'Sensor data 4'),
    ('Device2', '2023-10-26 11:30:00', 'Camera data 3'),
    ('Device3', '2023-10-26 11:45:00', 'Sensor data 5'),
    ('Device4', '2023-10-26 12:00:00', 'Camera data 4'),
    ('Device5', '2023-10-26 12:15:00', 'Sensor data 6'),
    ('Device1', '2023-10-26 12:30:00', 'Sensor data 7'),
    ('Device2', '2023-10-26 12:45:00', 'Camera data 5'),
    ('Device3', '2023-10-26 13:00:00', 'Sensor data 8'),
    ('Device4', '2023-10-26 13:15:00', 'Camera data 6'),
    ('Device5', '2023-10-26 13:30:00', 'Sensor data 9');