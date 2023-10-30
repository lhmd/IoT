const Sequelize = require("sequelize");
const sequelize = require("../config/database"); // 引入你的数据库连接配置
const User = require("./user");

const Device = sequelize.define(
  "device",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: Sequelize.STRING(255),
      allowNull: false,
      unique: true,
    },
    type: {
      type: Sequelize.STRING(20),
      allowNull: false,
    },
    status: {
      type: Sequelize.ENUM("Running", "Fault", "Shutdown"),
      allowNull: false,
    },
    location: {
      type: Sequelize.STRING(60),
      allowNull: false,
    },
    owner: {
      type: Sequelize.STRING(20),
      allowNull: false,
    },
    description: {
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
  foreignKey: "owner",
  targetKey: "username",
  onUpdate: "CASCADE",
  onDelete: "CASCADE",
});

module.exports = Device;
