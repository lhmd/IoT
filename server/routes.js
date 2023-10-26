const Router = require("koa-router");
const userRoutes = require("./routes/user"); // 导入用户相关路由

module.exports = function (app) {
  const router = new Router();
  app.use(router.routes());

  // 挂载用户相关路由
  userRoutes(router);
};
