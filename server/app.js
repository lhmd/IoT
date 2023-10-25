// koa框架使用的中间件
const koa = require("koa");
const path = require("path");
const static_file = require("koa-static");
const Router = require("koa-router");
const bodyParser = require("koa-body");
const Sequelize = require("sequelize");
const { Op } = require("sequelize");
const router = new Router();
const app = new koa();

// 连接数据库
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

app.use(async (ctx, next) => {
  await bodyParser()(ctx, next);
});
app.use(router.routes());
const cors = require("koa2-cors");
app.use(cors());
app.use(async (ctx, next) => {
  ctx.set("Access-Control-Allow-Origin", "*");
  ctx.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild",
  );
  ctx.set("Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, OPTIONS");
  if (ctx.method == "OPTIONS") {
    ctx.body = 200;
  } else {
    await next();
  }
});

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

const validator = require("validator"); // Import a library for email validation

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

// 静态文件使用
// app.use(static_file(path.join(__dirname, 'static')));
app.use(router.allowedMethods());
app.listen(3310);
console.log("success");
