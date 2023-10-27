<template>
  <div class="welcome-box">
    <div id="map-container"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import { useUserStore } from "@/stores/user";
import { useDeviceStore } from "@/stores/device";
import { useMessageStore } from "@/stores/message";
import { ElMessage } from "element-plus";
import axios from "axios";
// import AMapLoader from '@amap/amap-jsapi-loader';

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

// 定义一个全局变量，用于存储安全配置
declare global {
  interface Window {
    _AMapSecurityConfig: {
      securityJsCode: string;
    };
  }
}

// 设置安全密钥
window._AMapSecurityConfig = {
  securityJsCode: '3c6c98cdb301fa7e0019eb7809efa0b6',
};

onMounted(() => {
  // 添加 AMap 地图脚本
  const script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = `https://webapi.amap.com/maps?v=1.4.15&key=c83ca085b9805ea901faa3414c91ec88`;
  script.async = true;
  script.onload = () => {
    // 等待 AMap 脚本加载完毕后初始化地图
    initMap();
  };
  document.head.appendChild(script);
  loadDevice();
});

function initMap() {
  const map = new AMap.Map('map-container', {
    zoom: 10, // 缩放级别
    center: [116.397428, 39.90923] // 地图中心点
  });
  console.log(map);
}
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
