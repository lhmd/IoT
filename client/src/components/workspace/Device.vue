<template>
  <div class="welcome-box">
    <el-select
      v-model="value1"
      clearable
      class="m-2"
      placeholder="选择设备"
      size="large"
      @change="onValue1Change"
      @clear="onClearSelect"
    >
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
    <div id="map-container"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onBeforeMount, onUnmounted } from "vue";
import { useUserStore } from "@/stores/user";
import { useDeviceStore } from "@/stores/device";
import { useMessageStore } from "@/stores/message";
import { ElMessage } from "element-plus";
import axios from "axios";
import AMapLoader from "@amap/amap-jsapi-loader";

const userStore = useUserStore();
const deviceStore = useDeviceStore();
const messageStore = useMessageStore();

let AMap: any;

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
  type: "";
}
let device: DeviceType[] = [];
let deviceCount = ref(0);
var markers: any = [];
var polylines: any = [];
let onlineDeviceCount = ref(0);
let map: any = null;
const options = ref<{ value: string; label: string }[]>([]);
let message: MessageType[] = [];
let messageCount = ref(0);
const value1 = ref("");

async function loadDevice() {
  try {
    console.log(userStore.getData)
    const response = await axios.post(
      "/getDevice",
      userStore.getData,
    );
    if (response.data.success) {
      device = response.data.device; // 数组
      options.value = device.map((d) => ({
        value: d.name,
        label: d.name,
      }));
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
        let marker = new AMap.Marker({
          position: [location[0], location[1]],
          map: map,
        });
        map.add(marker);
        markers.push(marker);
        marker.setLabel({
          direction: "right",
          // offset: new AMap.Pixel(10, 0), //设置文本标注偏移量
          content: device[i].name, //设置文本标注内容
        });
      }
      // console.log(deviceTypeCount.value[0]);
      deviceCount.value = device.length;
      // ElMessage.success("加载设备信息成功");
      map.setFitView();
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
    // console.log("这是devices", deviceStore.devices);
    const response2 = await axios.post(
      "/getMessage",
      deviceStore.devices,
    );
    // console.log("这是response2", response2);
    if (response2.data.success) {
      message = response2.data.message; // 数组
      let length = message.length;
      // console.log(messageStore.messages);
      // if (messageStore.messages.length > 0) {
      //   length = 0;
      // }
      messageStore.clearMessages();
      for (let i = 0; i < length; i++) {
        messageStore.addMessage(
          message[i].device_name,
          message[i].time,
          message[i].content,
          message[i].location,
          message[i].type,
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

onBeforeMount(() => {
  AMapLoader.load({
    key: "c83ca085b9805ea901faa3414c91ec88", // 申请好的Web端开发者Key，首次调用 load 时必填
    version: "2.0", // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
    plugins: [], // 需要使用的的插件列表，如比例尺'AMap.Scale'等
  })
    .then((AMapIns) => {
      AMap = AMapIns;
      map = new AMapIns.Map("map-container", {
        // 设置地图容器id
        pitch: 35,
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

function removeMarkers() {
  map.remove(polylines);
  map.remove(markers);
  markers = [];
  polylines = [];
}

function onValue1Change() {
  removeMarkers();
  if (value1.value === "") {
    loadDevice();
    return;
  }
  // 找到对应的设备
  let length = device.length;
  let thisMessage: MessageType[] = [];
  let thisLocation = [];
  for (let j = 0; j < message.length; j++) {
    if (message[j].device_name === value1.value) {
      thisMessage.push(message[j]);
      thisLocation.push(message[j].location);
    }
  }
  // 对thisMessage按照时间排序
  thisMessage.sort(function (a, b) {
    return a.time > b.time ? 1 : -1;
  });
  for (let i = 0; i < thisMessage.length; i++) {
    let location = thisLocation[i].split(",");
    // 如果message的type为'Alert'，显示红色
    let alert = "";
    alert = "Alert";
    if (thisMessage[i].type === alert) {
      let marker = new AMap.Marker({
        position: [location[0], location[1]],
        map: map,
        icon: "https://webapi.amap.com/theme/v1.3/markers/n/mark_r.png",
      });
      map.add(marker);
      markers.push(marker);
      marker.setLabel({
        direction: "right",
        // offset: new AMap.Pixel(10, 0), //设置文本标注偏移量
        content: thisMessage[i].content, //设置文本标注内容
      });
    } else {
      let marker = new AMap.Marker({
        position: [location[0], location[1]],
        map: map,
        icon: "https://webapi.amap.com/theme/v1.3/markers/n/mark_b.png",
      });
      map.add(marker);
      markers.push(marker);
      marker.setLabel({
        direction: "right",
        // offset: new AMap.Pixel(10, 0), //设置文本标注偏移量
        content: thisMessage[i].content, //设置文本标注内容
      });
    }
  }
  // 将所有点连成线
  var path = [];
  for (let i = 0; i < thisLocation.length; i++) {
    let location = thisLocation[i].split(",");
    path.push([location[0], location[1]]);
  }
  var polyline = new AMap.Polyline({
    path: path, //设置线覆盖物路径
    strokeColor: "#3366FF", //线颜色
    strokeOpacity: 1, //线透明度
    strokeWeight: 5, //线宽
    strokeStyle: "solid", //线样式
    strokeDasharray: [10, 5], //补充线样式
    geodesic: true, //绘制大地线
    showDir: true,
  });
  polylines.push(polyline);
  map.add(polyline);
  map.setFitView();
}
function onClearSelect() {}
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
