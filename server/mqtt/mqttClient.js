const mqtt = require("mqtt");
const Message = require("../models/message");

const host = "c9d3a117.ala.cn-hangzhou.emqxsl.cn";
const port = "8883";
const clientId = `Weijie`;

const connectUrl = `mqtts://${host}:${port}`;
const client = mqtt.connect(connectUrl, {
  clientId,
  clean: true,
  connectTimeout: 4000,
  username: "1",
  password: "1",
  reconnectPeriod: 1000,
});

const topic = "/nodejs/mqtt";
client.on("connect", () => {
  console.log("Connected");
  client.subscribe([topic], () => {
    console.log(`Subscribe to topic '${topic}'`);
  });
  // for (let i = 0; i < 10; i++) {
  //   client.publish(
  //     topic,
  //     `test nodejs mqtt test ${i}`,
  //     { qos: 0, retain: false },
  //     (error) => {
  //       if (error) {
  //         console.error(error);
  //       }
  //     },
  //   );
  // }
});
client.on("message", (topic, payload) => {
  // console.log("Received Message:", topic, payload.toString());
  try {
    // 识别json字段，解析出设备名和设备信息
    const { device_name, device_message, device_location } = JSON.parse(payload.toString());
    // 当前时间
    const date = new Date();
    console.log(date.toLocaleString(), device_name, device_message, device_location);
    // 生成message插入数据
    Message.create({
      device_name,
      time: date.toLocaleString(),
      content: device_message,
      location: device_location,
    }).then((result) => {
      console.log("插入数据成功", result);
    });
  } catch (error) {
    console.error(error);
  }
});
