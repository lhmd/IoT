<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import { useUserStore } from "@/stores/user";
import { useDeviceStore } from "@/stores/device";
import { useMessageStore } from "@/stores/message";
import { ElMessage } from "element-plus";
import axios from "axios";
import * as echarts from "echarts";

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
  type: "";
}
let device: DeviceType[] = [];
let deviceCount = ref(0);
let message: MessageType[] = [];
let messageCount = ref(0);
let onlineDeviceCount = ref(0);
// 用一个数组记录每个type的设备数量
// type有6种： 'Sensor', 'Camera', 'Actuator', 'Gateway', 'Lock', 'Tracker'
let deviceTypeCount = ref([0, 0, 0, 0, 0, 0]);

async function loadDevice() {
  try {
    const response = await axios.post(
      "http://localhost:6034/getDevice",
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
        if (device[i].status === "Running") {
          onlineDeviceCount.value++;
        }
        // console.log(device[i].type);
        // 记录每个type的设备数量
        if (device[i].type === "Sensor") {
          deviceTypeCount.value[0]++;
        } else if (device[i].type === "Camera") {
          deviceTypeCount.value[1]++;
        } else if (device[i].type === "Actuator") {
          deviceTypeCount.value[2]++;
        } else if (device[i].type === "Gateway") {
          deviceTypeCount.value[3]++;
        } else if (device[i].type === "Lock") {
          deviceTypeCount.value[4]++;
        } else if (device[i].type === "Tracker") {
          deviceTypeCount.value[5]++;
        }
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
    // console.log("这是devices", deviceStore.devices);
    const response2 = await axios.post(
      "http://localhost:6034/getMessage",
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
      ElMessage.success("加载设备消息成功");
      await drawCharts();
      await drawCharts2();
    } else {
      ElMessage.error(response2.data.message);
    }
  } catch (error) {
    ElMessage.error("加载设备消息请求出错");
    console.error("请求出错：", error);
  }
}

const chartDom = ref(null);
const chartDom2 = ref(null);

function drawCharts() {
  const deviceTypeData = [
    { name: "Sensor", value: deviceTypeCount.value[0] },
    { name: "Camera", value: deviceTypeCount.value[1] },
    { name: "Actuator", value: deviceTypeCount.value[2] },
    { name: "Gateway", value: deviceTypeCount.value[3] },
    { name: "Lock", value: deviceTypeCount.value[4] },
    { name: "Tracker", value: deviceTypeCount.value[5] },
  ];
  const chart = echarts.init(chartDom.value);

  const option = {
    title: {
      text: "设备类型分布",
      x: "center",
    },
    tooltip: {
      trigger: "item",
      formatter: "{a} <br/>{b} : {c} ({d}%)",
    },
    legend: null,
    // {
    // orient: "vertical",
    // right: "right",
    // left: "right",
    // data: deviceTypeData.map((item) => item.name),
    // },
    series: [
      {
        name: "设备类型",
        type: "pie",
        radius: "55%",
        center: ["50%", "60%"],
        data: deviceTypeData,
        roseType: "angle",
      },
    ],
  };

  chart.setOption(option);
}

function drawCharts2() {
  // 读取deviceCount个设备的设备名称和消息数量，存入数组
  let deviceMessageCount = [];
  for (let i = 0; i < deviceCount.value; i++) {
    deviceMessageCount.push({
      name: deviceStore.devices[i].name,
      value: deviceStore.devices[i].message_count,
    });
  }

  const chart2 = echarts.init(chartDom2.value);

  const option2 = {
    title: {
      text: "消息分布",
      x: "center",
    },
    tooltip: {
      trigger: "item",
      formatter: "{a} <br/>{b} : {c} ({d}%)",
    },
    legend: null,
    // legend: {
    //   orient: "vertical",
    //   right: "right",
    //   data: deviceMessageCount.map((item) => item.name),
    // },
    series: [
      {
        name: "设备名称",
        type: "pie",
        radius: "55%",
        center: ["50%", "60%"],
        data: deviceMessageCount,
        roseType: "angle",
      },
    ],
  };

  chart2.setOption(option2);
}

onMounted(() => {
  loadDevice();
});
</script>

<template>
  <div class="welcome-box">
    <el-row :gutter="16" class="el-row" style="max-width: 100%">
      <el-col :span="8">
        <div class="statistic-card">
          <el-statistic :value="deviceCount">
            <template #title>
              <div style="display: inline-flex; align-items: center">
                Total number of devices 设备总数
                <el-tooltip
                  effect="dark"
                  content="您有使用权限的所有设备数量"
                  placement="top"
                >
                  <el-icon style="margin-left: 4px" :size="12">
                    <Warning />
                  </el-icon>
                </el-tooltip>
              </div>
            </template>
          </el-statistic>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="statistic-card">
          <el-statistic :value="onlineDeviceCount">
            <template #title>
              <div style="display: inline-flex; align-items: center">
                在线设备总数
                <el-tooltip
                  effect="dark"
                  content="您所拥有的设备消息总数"
                  placement="top"
                >
                  <el-icon style="margin-left: 4px" :size="12">
                    <Warning />
                  </el-icon>
                </el-tooltip>
              </div>
            </template>
          </el-statistic>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="statistic-card">
          <el-statistic :value="messageCount">
            <template #title>
              <div style="display: inline-flex; align-items: center">
                Total number of messages消息总数
                <el-tooltip
                  effect="dark"
                  content="您所拥有的设备消息总数"
                  placement="top"
                >
                  <el-icon style="margin-left: 4px" :size="12">
                    <Warning />
                  </el-icon>
                </el-tooltip>
              </div>
            </template>
          </el-statistic>
        </div>
      </el-col>
    </el-row>
    <div class="chart-container">
      <div ref="chartDom" class="chart"></div>
      <div ref="chartDom2" class="chart"></div>
    </div>
  </div>
</template>

<style>
.welcome-box {
  width: 100%;
  height: 100%;
  background-color: #ffffff;
  position: relative;
  align-items: center;
  /* padding: 3vh; */
}

@media screen and (min-width: 1024px) {
  .chart-container {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: space-between;
    align-items: center;
    align-content: center;
    margin-top: 15vh;
  }
  .chart {
    display: flex;
    align-items: center;
    margin-right: 5vw;
    width: 100%;
    height: 350px;
  }
}

@media screen and (max-width: 1024px) {
  .chart-container {
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    justify-content: space-between;
    align-items: center;
    align-content: center;
    margin-top: 15vh;
  }
  .chart {
    display: flex;
    width: 100%;
    height: 250px;
  }
}

:global(h2#card-usage ~ .example .example-showcase) {
  background-color: var(--el-fill-color) !important;
}

.el-statistic {
  --el-statistic-content-font-size: 28px;
}

.statistic-card {
  height: 100%;
  padding: 20px;
  border-radius: 4px;
  background-color: var(--el-bg-color-overlay);
}

.statistic-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  font-size: 12px;
  color: var(--el-text-color-regular);
  margin-top: 16px;
}

.statistic-footer .footer-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.statistic-footer .footer-item span:last-child {
  display: inline-flex;
  align-items: center;
  margin-left: 4px;
}

.green {
  color: var(--el-color-success);
}
.red {
  color: var(--el-color-error);
}
</style>
