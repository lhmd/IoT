// koa框架使用的中间件
const koa = require('koa')
const path = require('path');
const static_file = require('koa-static')
const Router=require('koa-router')
// const bodyParser = require('koa-body')
const bodyParser = require('koa-bodyparser'); 
const Sequelize = require('sequelize')
const {Op} = require("sequelize");
const router= new Router()
const app = new koa()

// 连接数据库
const sequelize = new Sequelize('iot', 'root', 'qwe987', {
    host: 'localhost',
    dialect: 'mysql',
    pool: {
        max: 1000,
        min: 0,
        idle: 30000
    }
});

// 定义数据库表
const User = sequelize.define('user', {
    user_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    username: {
        type: Sequelize.STRING(63),
        allowNull: false
    },
    password: {
        type: Sequelize.STRING(63),
        allowNull: false
    },
    email: {
        type: Sequelize.STRING(63),
        allowNull: false
    },
    phone: {
        type: Sequelize.STRING(63),
        allowNull: false
    },
    gender: {
        type: Sequelize.STRING(63),
        allowNull: false
    },
    address: {
        type: Sequelize.STRING(63),
        allowNull: false
    }
},{
    timestamps: false,
    freezeTableName:true
});
User.sync({force:false})

// app.use(async (ctx, next) => {
//     await bodyParser()(ctx, next);
// });
app.use(bodyParser());
app.use(router.routes())
const cors=require("koa2-cors")
app.use(cors());
app.use(async (ctx, next) => {
    ctx.set('Access-Control-Allow-Origin', '*');
    ctx.set('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
    ctx.set('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
    if (ctx.method == 'OPTIONS') {
        ctx.body = 200;
    } else {
        await next();
    }
});


router.post('/loginSubmit', async (ctx, next) => {
    try {
        console.log("111111111111")
        const body = ctx.request.body;
        console.log(body);

        // 查询数据库以验证用户名和密码
        const user = await User.findOne({
            where: {
                username: body.username,
                password: body.password,  // 这里假设密码存储明文，实际项目中通常需要进行密码哈希
            }
        });

        if (user) {
            // 登录成功
            ctx.body = {
                success: true,  // 登录成功标志
                user: user,     // 用户信息
            };
            console.log('登录成功');
        } else {
            // 登录失败
            ctx.body = {
                success: false,  // 登录失败标志
                message: '用户名或密码错误',  // 错误消息
            };
            console.log('登录失败');
        }
        await next();
    } catch (e) {
        ctx.body = {
            success: false,  // 登录失败标志
            message: '登录失败，发生错误',  // 错误消息
        };
        console.log('发生错误', e);
    }
});

// 静态文件使用
// app.use(static_file(path.join(__dirname, 'static')));
app.use(router.allowedMethods())
app.listen(5173)
console.log('success')