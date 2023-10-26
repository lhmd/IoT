const bodyParser = require("koa-body");

module.exports = function (app) {
  app.use(async (ctx, next) => {
    await bodyParser()(ctx, next);
  });
};
