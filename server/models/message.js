const Sequelize = require("sequelize");
const sequelize = require("../config/database"); // 引入你的数据库连接配置
const Device = require("./device"); // 引入Device模型

const Message = sequelize.define(
  "message",
  {
    message_id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    message_device: {
      type: Sequelize.STRING(20),
      allowNull: false,
    },
    message_time: {
      type: Sequelize.STRING(20),
      allowNull: false,
    },
    message_content: {
      type: Sequelize.STRING(255),
    },
  },
  {
    timestamps: false,
    freezeTableName: true,
  }
);

// 添加外键关联
Message.belongsTo(Device, {
  foreignKey: "message_device",
  targetKey: "device_name",
});

module.exports = Message;
