const User = require("../models/user");
const Device = require("../models/device");

module.exports = function (router) {
  router.post("/getDevice", async (ctx, next) => {
    try {
      const body = ctx.request.body;
      const whereClause = {};
      if (body.username) {
        whereClause.owner = body.username;
      } else {
        ctx.body = {
          success: false,
          message: "用户名不能为空",
        };
        return;
      }
      let device = await Device.findAll({
        where: whereClause,
      });

      if (device) {
        ctx.body = {
          success: true,
          device: device,
        };
        console.log("获取设备成功");
      } else {
        ctx.body = {
          success: false,
          message: "您目前还没有设备！",
        };
      }
    } catch (e) {
      ctx.body = {
        success: false, // 登录失败标志
        message: "获取设备失败，发生错误", // 错误消息
      };
      console.log("发生错误", e);
    }
  });
};
