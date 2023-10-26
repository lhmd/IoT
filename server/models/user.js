const Sequelize = require("sequelize");
const sequelize = require("../config/database");
// 定义数据库表
const User = sequelize.define(
  "user",
  {
    user_id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: Sequelize.STRING(20),
      allowNull: false,
      unique: true,
    },
    password: {
      type: Sequelize.STRING(20),
      allowNull: false,
    },
    email: {
      type: Sequelize.STRING(60),
      allowNull: true,
      unique: true,
    },
    phone: {
      type: Sequelize.STRING(20),
      allowNull: true,
    },
    gender: {
      type: Sequelize.STRING(20),
      allowNull: true,
    },
    address: {
      type: Sequelize.STRING(60),
      allowNull: true,
    },
  },
  {
    timestamps: false,
    freezeTableName: true,
  },
);
User.sync({ force: false });

module.exports = User;
