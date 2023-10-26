create database if not exists `iot`;
use iot;

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
    device_id INT AUTO_INCREMENT PRIMARY KEY,
    device_name VARCHAR(255) NOT NULL UNIQUE,
    device_type VARCHAR(20) NOT NULL,
    device_status ENUM('Running', 'Fault', 'Shutdown') NOT NULL,
    device_location VARCHAR(60) NOT NULL,
    device_owner VARCHAR(20) NOT NULL,
    device_description VARCHAR(255),
    FOREIGN KEY (device_owner) REFERENCES user(username)
);

CREATE TABLE message (
    message_id INT AUTO_INCREMENT PRIMARY KEY,
    message_device VARCHAR(20) NOT NULL,
    message_time VARCHAR(20) NOT NULL,
    message_content VARCHAR(255),
    FOREIGN KEY (message_device) REFERENCES device(device_name)
);

INSERT INTO user (username, password, email, phone, gender, address)
VALUES ('test123', 'test123', 'john@example.com', '1234567890', 'Male', '123 Main St');
