const User = require("../models/user");
const validator = require("validator"); // Import a library for email validation

module.exports = function (router) {
    router.post("/loginSubmit", async (ctx, next) => {
        try {
          const body = ctx.request.body;
          console.log(body);
      
          // 查询数据库以验证用户名和密码
          const user = await User.findOne({
            where: {
              username: body.username,
              password: body.password, // 这里假设密码存储明文，实际项目中通常需要进行密码哈希
            },
          });
      
          if (user) {
            // 登录成功
            ctx.body = {
              success: true, // 登录成功标志
              user: user, // 用户信息
            };
            console.log("登录成功");
          } else {
            // 登录失败
            ctx.body = {
              success: false, // 登录失败标志
              message: "用户名或密码错误", // 错误消息
            };
            console.log("登录失败");
          }
          await next();
        } catch (e) {
          ctx.body = {
            success: false, // 登录失败标志
            message: "登录失败，发生错误", // 错误消息
          };
          console.log("发生错误", e);
        }
      });
      
      
      router.post("/registerSubmit", async (ctx, next) => {
        try {
          const body = ctx.request.body;
          console.log(body);
      
          // Check if username and password have at least 6 characters
          if (body.username.length < 6 || body.password.length < 6) {
            ctx.body = {
              success: false,
              message: "用户名和密码必须至少包含6个字符",
            };
          } else if (!validator.isEmail(body.email)) {
            // Validate email format using the validator library
            ctx.body = {
              success: false,
              message: "无效的邮箱格式",
            };
          } else {
            // Check if the username or email already exists
            const existingUser = await User.findOne({
              where: { username: body.username },
            });
            const existingEmail = await User.findOne({
              where: { email: body.email },
            });
      
            if (existingUser) {
              ctx.body = {
                success: false,
                message: "用户名重复使用",
              };
            } else if (existingEmail) {
              ctx.body = {
                success: false,
                message: "邮箱重复使用",
              };
            } else {
              // Username and email are unique, create a new user
              let user = await User.create({
                username: body.username,
                password: body.password,
                email: body.email,
                phone: body.phone,
                gender: body.gender,
                address: body.address,
              });
      
              console.log(user);
              ctx.body = {
                success: true,
                user: user,
              };
            }
          }
      
          await next();
        } catch (e) {
          ctx.body = {
            success: false,
            message: "注册失败，发生错误",
          };
          console.log("发生错误", e);
        }
      });
};
