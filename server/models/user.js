const Sequelize = require("sequelize");

const sequelize = new Sequelize("iot", "root", "qwe987", {
  host: "localhost",
  dialect: "mysql",
  pool: {
    max: 1000,
    min: 0,
    idle: 30000,
  },
});

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
      type: Sequelize.STRING(63),
      allowNull: false,
      unique: true,
    },
    password: {
      type: Sequelize.STRING(63),
      allowNull: false,
    },
    email: {
      type: Sequelize.STRING(63),
      allowNull: true,
      unique: true,
    },
    phone: {
      type: Sequelize.STRING(63),
      allowNull: true,
    },
    gender: {
      type: Sequelize.STRING(63),
      allowNull: true,
    },
    address: {
      type: Sequelize.STRING(63),
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
