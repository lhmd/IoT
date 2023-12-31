const Aedes = require('aedes')
const Device = require("../models/device");
const Message = require("../models/message");
const aedes = new Aedes()
const server = require('net').createServer(aedes.handle)
const port = 1883

aedes.on('client', function (client) {
    console.log('new client', client.id)
})

aedes.on('clientDisconnect', function (client) {
    console.log('client disconnected', client.id)
})

aedes.on('publish', function (packet, client) {
    // 检查是否为json格式
    if (!client) return;
    if (!(packet.topic === 'testapp')) return;
    // 解析出设备名和设备信息
    const { clientId, info, value, alert, lng, lat, timestamp } = JSON.parse(
        packet.payload.toString(),
    );
    const type = alert ? "Alert" : "Info";
    Message.create({
        device_name: clientId,
        time: timestamp,
        content: info,
        location: lng + "," + lat,
        type: type,
    }).then((result) => {
        // console.log("插入数据成功", result);
    });
    Device.findOne({
        where: {
            name: clientId,
        },
    }).then((device) => {
        if (device) {
            device.update({
                location: lng + "," + lat,
            });
        }
    });
})

server.listen(port, function () {
    console.log('server started and listening on port ', port)
    }
)