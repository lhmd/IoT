const User = require("../models/user");
const Device = require("../models/device");
const Message = require("../models/message");

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
        // console.log("获取设备成功");
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

  router.post("/modifyDevice", async (ctx, next) => {
    try {
      const body = ctx.request.body;
      const whereClause = {};
      // console.log(body);
      whereClause.name = body.oldName;
      let device = await Device.findOne({
        where: whereClause,
      });
      if (device) {
        // 更新设备信息
        device.name = body.newName; // 修改设备名
        device.type = body.type; // 修改设备类型
        device.status = body.status; // 修改设备状态
        device.location = body.location; // 修改设备位置
        device.description = body.description; // 修改设备描述

        await device.save(); // 保存更新后的设备信息

        // 如果设备名被修改，更新相关的消息记录
        // if (body.oldName !== body.newName) {
        //   const updateMessages = await Message.update(
        //     { device_name: body.newName },
        //     { where: { device_name: body.oldName } },
        //   );
        // }

        ctx.body = {
          success: true,
          message: "设备信息已成功修改",
        };
      } else {
        ctx.body = {
          success: false,
          message: "找不到该设备！",
        };
      }
    } catch (e) {
      ctx.body = {
        success: false,
        message: "修改设备失败，发生错误",
      };
      console.log("发生错误", e);
    }
  });

  router.post("/addDevice", async (ctx, next) => {
    try {
      const body = ctx.request.body;
      const whereClause = {};
      // console.log(body);
      whereClause.name = body.name;
      let device = await Device.findOne({
        where: whereClause,
      });
      if (device) {
        ctx.body = {
          success: false,
          message: "设备名已存在！",
        };
        return;
      }
      // 创建新设备
      const newDevice = await Device.create({
        name: body.name,
        type: body.type,
        status: body.status,
        location: body.location,
        description: body.description,
        owner: body.owner,
      });
      ctx.body = {
        success: true,
        message: "添加设备成功",
      };
    } catch (e) {
      ctx.body = {
        success: false,
        message: "添加设备失败，发生错误",
      };
      console.log("发生错误", e);
    }
  });

  router.post("/deleteDevice", async (ctx, next) => {
    try {
      const body = ctx.request.body;
      const whereClause = {};
      // console.log(body);
      whereClause.name = body.name;
      let device = await Device.findOne({
        where: whereClause,
      });
      if (!device) {
        ctx.body = {
          success: false,
          message: "设备名不存在！",
        };
        return;
      }
      // 删除设备
      await device.destroy();
      ctx.body = {
        success: true,
        message: "删除设备成功",
      };
    } catch (e) {
      ctx.body = {
        success: false,
        message: "删除设备失败，发生错误",
      };
      console.log("发生错误", e);
    }
  });
};
