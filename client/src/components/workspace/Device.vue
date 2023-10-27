<template>
  <div class="welcome-box">
    <div id="map-container"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted  } from "vue";
import { useUserStore } from "@/stores/user";
import { useDeviceStore } from "@/stores/device";
import { useMessageStore } from "@/stores/message";
import { ElMessage } from "element-plus";
import axios from "axios";
import AMapLoader from '@amap/amap-jsapi-loader';

const userStore = useUserStore();
const deviceStore = useDeviceStore();
const messageStore = useMessageStore();

interface DeviceType {
  name: string;
  type: string;
  status: string;
  location: string;
  description: string;
  owner: string;
  message_count: number;
}
interface MessageType {
  device_name: "";
  time: "";
  content: "";
  location: string;
}
let device: DeviceType[] = [];
let deviceCount = ref(0);
let message: MessageType[] = [];
let messageCount = ref(0);
let onlineDeviceCount = ref(0);
let map: any = null;
async function loadDevice() {
  try {
    const response = await axios.post(
      "http://localhost:3310/getDevice",
      userStore,
    );
    if (response.data.success) {
      device = response.data.device; // 数组
      let length = device.length;
      onlineDeviceCount.value = 0;
      deviceStore.clearDevices();
      for (let i = 0; i < length; i++) {
        deviceStore.addDevice(
          device[i].name,
          device[i].type,
          device[i].status,
          device[i].location,
          device[i].description,
          device[i].owner,
        );
        // 将location转换为经纬度，location格式为"116.3978, 39.9023"
        let location = device[i].location.split(",");
        // console.log(location);
        
      }
      // console.log(deviceTypeCount.value[0]);
      deviceCount.value = device.length;
      // ElMessage.success("加载设备信息成功");
      await loadMessage();
    } else {
      ElMessage.error(response.data.message);
    }
  } catch (error) {
    ElMessage.error("加载设备信息请求出错");
    console.error("请求出错：", error);
  }
}

async function loadMessage() {
  try {
    const response2 = await axios.post(
      "http://localhost:3310/getMessage",
      deviceStore.devices,
    );
    if (response2.data.success) {
      message = response2.data.message; // 数组
      let length = message.length;
      messageStore.clearMessages();
      for (let i = 0; i < length; i++) {
        messageStore.addMessage(
          message[i].device_name,
          message[i].time,
          message[i].content,
          message[i].location,
        );
      }
      // 记录每个设备的消息数量
      for (let i = 0; i < deviceStore.devices.length; i++) {
        let count = 0;
        for (let j = 0; j < messageStore.messages.length; j++) {
          if (
            deviceStore.devices[i].name === messageStore.messages[j].device_name
          ) {
            count++;
          }
        }
        deviceStore.devices[i].message_count = count;
      }
      // console.log("这是message", messageStore.messages);
      messageCount.value = message.length;
      // ElMessage.success("加载设备消息成功");
    } else {
      ElMessage.error(response2.data.message);
    }
  } catch (error) {
    ElMessage.error("加载设备消息请求出错");
    console.error("请求出错：", error);
  }
}

onMounted(() => {
  AMapLoader.load({
    key: "c83ca085b9805ea901faa3414c91ec88", // 申请好的Web端开发者Key，首次调用 load 时必填
    version: "2.0", // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
    plugins: [], // 需要使用的的插件列表，如比例尺'AMap.Scale'等
  })
    .then((AMap) => {
      map = new AMap.Map("map-container", {
        // 设置地图容器id
        viewMode: "3D", // 是否为3D地图模式
        zoom: 11, // 初始化地图级别
        center: [116.397428, 39.90923], // 初始化地图中心点位置
      });
    })
    .catch((e) => {
      console.log(e);
    });
  loadDevice();
});

onUnmounted(() => {
  map.destroy();
});
</script>

<style scoped>
.welcome-box {
  width: 100%;
  height: 100%;
  background-color: #f5f7fa;
  position: relative;
  align-items: center;
}
#map-container {
  width: 100%;
  height: 500px; /* 设置一个具体的高度，例如 400px */
  position: relative;
  align-items: center;
}

</style>
