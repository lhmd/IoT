// koa框架使用的中间件
const koa = require('koa')
const path = require('path');
const static_file = require('koa-static')
const Router=require('koa-router')
const bodyParser = require('koa-body')
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

app.use(async (ctx, next) => {
    await bodyParser()(ctx, next);
});
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


router.post('/hotel_search', async (ctx, next) => {
    try {
        const body = ctx.request.body;
        console.log(body)
        const whereClause = {};
        if (body.hotel_name) {
            whereClause.name = {
                [Op.like]: '%' + body.hotel_name + '%'
            };
        }
        if (body.location) {
            whereClause.location = {
                [Op.like]: '%' + body.location + '%'
            };
        }
        let hotel = await Hotel.findAll({
            where: whereClause
        });
        let room_min_price = [];
        for (let i = 0; i < hotel.length; i++) {
            let room = await Room.findAll({
                where: {
                    hotel_id: hotel[i].hotel_id
                }
            });
            let min_price = 1000000;
            for (let j = 0; j < room.length; j++) {
                if (room[j].price < min_price) {
                    min_price = room[j].price;
                }
            }
            room_min_price.push(min_price);
        }
        ctx.body = {
            hotel: hotel,
            room_min_price: room_min_price
        };
        console.log(ctx.body.hotel);
        await next();
    } catch (e) {
        ctx.body = 'error';
        console.log('hotel_search error');
    }
});

// 静态文件使用
// app.use(static_file(path.join(__dirname, 'static')));
app.use(router.allowedMethods())
app.listen(5173)
// console.log('success')