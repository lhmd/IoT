const Sequelize = require("sequelize");
const sequelize = require("../config/database"); // 引入你的数据库连接配置
const Device = require("./device"); // 引入Device模型

const Message = sequelize.define(
  "message",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    device_name: {
      type: Sequelize.STRING(255),
      allowNull: false,
    },
    time: {
      type: Sequelize.STRING(100),
      allowNull: false,
    },
    content: {
      type: Sequelize.STRING(255),
    },
    location: {
      type: Sequelize.STRING(60),
    },
  },
  {
    timestamps: false,
    freezeTableName: true,
  },
);

// 添加外键关联
Message.belongsTo(Device, {
  foreignKey: "device_name",
  targetKey: "name",
  onUpdate: "CASCADE",
  onDelete: "CASCADE",
});

module.exports = Message;
