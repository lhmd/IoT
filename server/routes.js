const Router = require("koa-router");
const userRoutes = require("./routes/user"); // 导入用户相关路由
const deviceRoutes = require("./routes/device"); // 导入设备相关路由
const messageRoutes = require("./routes/message"); // 导入消息相关路由

module.exports = function (app) {
  const router = new Router();
  app.use(router.routes());

  // 挂载相关路由
  userRoutes(router);
  deviceRoutes(router);
  messageRoutes(router);
};
