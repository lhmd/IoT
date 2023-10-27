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
    -- 该设备最新发出消息时的位置，初始值为“home”
    location VARCHAR(60) NOT NULL,
    owner VARCHAR(20) NOT NULL,
    description VARCHAR(255),
    FOREIGN KEY (owner) REFERENCES user(username)
);

CREATE TABLE message (
    id INT AUTO_INCREMENT PRIMARY KEY,
    device_name VARCHAR(255) NOT NULL,
    time VARCHAR(100) NOT NULL,
    -- 经纬度表示位置
    location VARCHAR(60),
    content VARCHAR(255),
    FOREIGN KEY (device_name) REFERENCES device(name) ON UPDATE CASCADE ON DELETE CASCADE
);

-- 插入用户数据
INSERT INTO user (username, password, email, phone, gender, address)
VALUES
    ('1', '1', '1@email.com', '123-456-7890', 'Male', '123 Main St'),
    ('user2', 'password2', 'user2@email.com', '987-654-3210', 'Female', '456 Elm St'),
    ('user3', 'password3', 'user3@email.com', '555-555-5555', 'Male', '789 Oak St');

-- 插入设备数据
INSERT INTO device (name, type, status, location, owner, description)
VALUES
    ('Sensor1', 'Sensor', 'Running', '40.7128,-74.0060', '1', 'Temperature sensor'),
    ('Camera1', 'Camera', 'Running', '34.0522,-118.2437', 'user2', 'Security camera'),
    ('Actuator1', 'Actuator', 'Running', '51.5074,-0.1278', '1', 'Light control'),
    ('Gateway1', 'Gateway', 'Running', '52.5200,13.4050', 'user3', 'IoT gateway'),
    ('Lock1', 'Lock', 'Running', '48.8566,2.3522', 'user2', 'Smart lock'),
    ('Tracker1', 'Tracker', 'Running', '37.7749,-122.4194', '1', 'Asset tracker');

-- 插入消息数据
INSERT INTO message (device_name, time, location, content)
VALUES
    ('Sensor1', '2023/10/27 08:00:00', '40.7128,-74.0060', 'Temperature: 25°C'),
    ('Camera1', '2023/10/27 08:05:00', '34.0522,-118.2437', 'Motion detected'),
    ('Actuator1', '2023/10/27 08:10:00', '51.5074,-0.1278', 'Light turned on'),
    ('Gateway1', '2023/10/27 08:15:00', '52.5200,13.4050', 'Connected to IoT network'),
    ('Lock1', '2023/10/27 08:20:00', '48.8566,2.3522', 'Locked'),
    ('Tracker1', '2023/10/27 08:25:00', '37.7749,-122.4194', 'Asset location updated');
