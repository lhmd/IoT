# IoT

## Information

This is @lhmd 's project with `Vue` and `koa.js`.

## Project Setup

### Docker compose

```bash
docker-compose up
```

### Direct deployment

```bash
cd client
npm install && npm run build
```

Then copy the directory `dist` to the server folder, open `app.js`, uncomment the following two lines:

```js
const staticfile = require('koa-static')
app.use(staticfile('public'))
```

Then input the commands:

```bash
cd server
npm install && node app
```

You can visit the website in the `http://localhost:6034`.

### Development environment

See [Client Setup](https://github.com/lhmd/IoT/blob/main/client/README.md) and [Server Setup](https://github.com/lhmd/IoT/blob/main/server/README.md).

That is, replace the above `npm run build` with `npm run dev` and keep the two lines in the `app.js` file commented out.
