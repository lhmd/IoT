const Sequelize = require("sequelize");
const sequelize = require("../config/database"); // 引入你的数据库连接配置
const User = require("./user");

const Device = sequelize.define(
  "device",
  {
    device_id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    device_name: {
      type: Sequelize.STRING(255),
      allowNull: false,
      unique: true,
    },
    device_type: {
      type: Sequelize.STRING(20),
      allowNull: false,
    },
    device_status: {
      type: Sequelize.ENUM("Running", "Fault", "Shutdown"),
      allowNull: false,
    },
    device_location: {
      type: Sequelize.STRING(60),
      allowNull: false,
    },
    device_owner: {
      type: Sequelize.STRING(20),
      allowNull: false,
    },
    device_description: {
      type: Sequelize.STRING(255),
      allowNull: false,
    },
  },
  {
    timestamps: false,
    freezeTableName: true,
  },
);

// 添加外键关联
Device.belongsTo(User, {
  foreignKey: "device_owner",
  targetKey: "username",
});

module.exports = Device;
