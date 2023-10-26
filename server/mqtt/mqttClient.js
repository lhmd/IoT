const mqtt = require("mqtt");

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
  for (let i = 0; i < 10; i++) {
    client.publish(
      topic,
      `nodejs mqtt test ${i}`,
      { qos: 0, retain: false },
      (error) => {
        if (error) {
          console.error(error);
        }
      },
    );
  }
});
client.on("message", (topic, payload) => {
  console.log("Received Message:", topic, payload.toString());
});
