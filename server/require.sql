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
    location VARCHAR(60) NOT NULL DEFAULT 'home',
    owner VARCHAR(20) NOT NULL,
    description VARCHAR(255),
    FOREIGN KEY (owner) REFERENCES user(username) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE message (
    id INT AUTO_INCREMENT PRIMARY KEY,
    device_name VARCHAR(255) NOT NULL,
    time VARCHAR(100) NOT NULL,
    -- 经纬度表示位置
    location VARCHAR(60),
    content VARCHAR(255),
    type ENUM('Alert', 'Info') NOT NULL DEFAULT 'Info',
    FOREIGN KEY (device_name) REFERENCES device(name) ON UPDATE CASCADE ON DELETE CASCADE
);

-- 插入用户数据
INSERT INTO user (username, password, email, phone, gender, address)
VALUES
    ('user111', 'password1', 'user1@example.com', '123-456-7890', 'Male', '123 Main St'),
    ('user222', 'password2', 'user2@example.com', '987-654-3210', 'Female', '456 Elm St'),
    ('user333', 'password3', 'user3@example.com', '555-123-4567', 'Male', '789 Oak St'),
    ('user444', 'password4', 'user4@example.com', '333-555-7777', 'Female', '321 Pine St'),
    ('user555', 'password5', 'user5@example.com', '111-222-3333', 'Male', '456 Maple St'),
    ('user666', 'password6', 'user6@example.com', '999-888-7777', 'Female', '654 Cedar St');

-- 插入设备数据
-- 每个用户有3-10个设备
INSERT INTO device (name, type, status, owner, description)
SELECT 
    CONCAT('Device', t.num, ' of User', u.user_id),
    CASE FLOOR(RAND() * 6)
        WHEN 0 THEN 'Sensor'
        WHEN 1 THEN 'Camera'
        WHEN 2 THEN 'Actuator'
        WHEN 3 THEN 'Gateway'
        WHEN 4 THEN 'Lock'
        WHEN 5 THEN 'Tracker'
    END,
    CASE FLOOR(RAND() * 3)
        WHEN 0 THEN 'Running'
        WHEN 1 THEN 'Fault'
        WHEN 2 THEN 'Shutdown'
    END,
    u.username,
    CONCAT('Description of Device', t.num, ' owned by User', u.user_id)
FROM user u
JOIN (
    SELECT 1 AS num UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9 UNION ALL SELECT 10
) t;

-- 更新设备的位置为"home"，初始值为“home”
UPDATE device
SET location = 'home';

-- 插入消息数据
-- 每台设备至少有15条消息
INSERT INTO message (device_name, time, location, content, type)
SELECT
    d.name,
    NOW() - INTERVAL t1.num HOUR,
    CONCAT(ROUND(120 + RAND() * 20, 6), ',', ROUND(30 + RAND() * 10, 6)),
    CONCAT('Message content from Device', t1.num, ' of User', u.user_id),
    CASE FLOOR(RAND() * 2)
        WHEN 0 THEN 'Alert'
        WHEN 1 THEN 'Info'
    END
FROM user u
JOIN (
    SELECT 1 AS num UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9 UNION ALL SELECT 10
) t1
JOIN device d ON d.owner = u.username
WHERE (
    SELECT COUNT(*)
    FROM message m
    WHERE m.device_name = d.name
) < 15;

-- 手动更新设备的location为最新消息的位置
UPDATE device d
JOIN (
    SELECT
        device_name,
        MAX(time) AS latest_time
    FROM message
    GROUP BY device_name
) latest_message ON d.name = latest_message.device_name
SET d.location = (
    SELECT location
    FROM message
    WHERE device_name = latest_message.device_name
    AND time = latest_message.latest_time
);

-- 查看生成的测试数据
-- SELECT * FROM user;
-- SELECT * FROM device;
-- SELECT * FROM message;
