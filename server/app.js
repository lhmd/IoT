const koa = require("koa");
const app = new koa();
const mqttClient = require("./mqtt/mqttClient");

// 静态资源
// const static = require('koa- /dist'));

// 其他中间件和路由的导入
const bodyParserMiddleware = require("./middlewares/bodyParser");
const corsMiddleware = require("./middlewares/cors");
const routes = require("./routes");

// 使用中间件
bodyParserMiddleware(app);
corsMiddleware(app);
routes(app);

app.listen(6034);
// console.log("success");
