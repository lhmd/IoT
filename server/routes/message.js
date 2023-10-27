const User = require("../models/user");
const Device = require("../models/device");
const Message = require("../models/message");

module.exports = function (router) {
  router.post("/getMessage", async (ctx, next) => {
    try {
      let messages = [];
      const body = ctx.request.body;
      console.log(body);
      for (let i = 0; i < body.length; i++) {
        const whereClause = {};
        if (body[i].name) {
          whereClause.device_name = body[i].name;
          // console.log(whereClause);
        } else {
          ctx.body = {
            success: false,
            message: "设备名不能为空",
          };
          return;
        }
        let message = await Message.findAll({
          where: whereClause,
        });
        console.log("这是message", message);
        for (let j = 0; j < message.length; j++) {
          messages.push(message[j]);
        }
      }

      if (messages) {
        ctx.body = {
          success: true,
          message: messages,
        };
        console.log("获取消息成功", messages);
      } else {
        ctx.body = {
          success: false,
          message: "设备目前还没有消息！",
        };
      }
    } catch (e) {
      ctx.body = {
        success: false, // 登录失败标志
        message: "获取消息失败，发生错误", // 错误消息
      };
      console.log("发生错误", e);
    }
  });
};
