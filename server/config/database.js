const Sequelize = require("sequelize");

const sequelize = new Sequelize("iot", "root", "qwe987", {
  host: "mysql",
  // host: "localhost",
  dialect: "mysql",
  pool: {
    max: 1000,
    min: 0,
    idle: 30000,
  },
});

module.exports = sequelize;
