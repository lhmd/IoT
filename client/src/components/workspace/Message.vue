<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import { useUserStore } from "@/stores/user";
import { useDeviceStore } from "@/stores/device";
import { useMessageStore } from "@/stores/message";
import { ElMessage } from "element-plus";
import axios from "axios";
const value1 = ref("");
const value2 = ref("");

// 0代表还没有选择，1代表value1不为空，2代表value2不为空
const status = ref(0);

const options = ref<{ value: string; label: string }[]>([]);

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
  location: "";
  type: "";
}
let device: DeviceType[] = [];
let deviceCount = ref(0);
let message: MessageType[] = [];
let messageCount = ref(0);
let onlineDeviceCount = ref(0);
// 用一个数组记录每个type的设备数量
// type有6种： 'Sensor', 'Camera', 'Actuator', 'Gateway', 'Lock', 'Tracker'
const deviceType = [
  {
    type: "Sensor",
  },
  {
    type: "Camera",
  },
  {
    type: "Actuator",
  },
  {
    type: "Gateway",
  },
  {
    type: "Lock",
  },
  {
    type: "Tracker",
  },
];
let deviceTypeCount = ref([0, 0, 0, 0, 0, 0]);

const displayedMessages = ref<MessageType[]>([]);
const displayMessages = ref(false);

async function loadDevice() {
  try {
    const response = await axios.post(
      "http://localhost:3310/getDevice",
      userStore,
    );
    if (response.data.success) {
      device = response.data.device; // 数组
      options.value = device.map((d) => ({
        value: d.name,
        label: d.name,
      }));
      console.log(options.value);
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
      "http://localhost:3310/getMessage",
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
        // console.log(message[i]);
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
  loadDevice();
});

const onValue1Change = (value: string) => {
  if (value !== "") {
    status.value = 1;
    displayMessages.value = true;
    loadMessagesForDevice(value);
  } else {
    status.value = 0;
    displayMessages.value = false;
    displayedMessages.value = [];
  }
};

const onValue2Change = (value: string) => {
  if (value !== "") {
    status.value = 2;
    displayMessages.value = true;
    loadMessagesForDeviceType(value);
  } else {
    status.value = 0;
    displayMessages.value = false;
    displayedMessages.value = [];
  }
};

const loadMessagesForDevice = (deviceName: string) => {
  displayedMessages.value = message.filter(
    (msg) => msg.device_name === deviceName,
  );
  ElMessage.success("加载设备消息成功");
};

const loadMessagesForDeviceType = (deviceType: string) => {
  const devicesOfType = device.filter((d) => d.type === deviceType);
  const deviceNames = devicesOfType.map((d) => d.name);
  const messagesOfType = message.filter((msg) =>
    deviceNames.includes(msg.device_name),
  );
  displayedMessages.value = messagesOfType;
  ElMessage.success("加载设备消息成功");
};
</script>

<template>
  <div class="welcome-box">
    <el-select
      v-model="value1"
      clearable
      class="m-2"
      placeholder="选择设备"
      size="large"
      :disabled="status === 2"
      @change="onValue1Change"
    >
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
    <el-select
      v-model="value2"
      clearable
      class="m-2"
      placeholder="按类型选择设备"
      :disabled="status === 1"
      @change="onValue2Change"
    >
      <el-option
        v-for="item in deviceType"
        :key="item.type"
        :label="item.type"
        :value="item.type"
      />
    </el-select>
    <el-card v-if="displayMessages" class="m-2">
      <h2 slot="header">Messages</h2>
      <ul>
        <!-- 如果message的type是Alert就将这一条变成红色，否则正常 -->
        <li
          v-for="(message, index) in displayedMessages"
          :key="index"
          :style="(message.type as string) === 'Alert' ? 'color: red' : 'color: green'"
        >
          <p>
            <el-icon name="el-icon-s-custom"><Open /></el-icon>
            设备: {{ message.device_name }}
          </p>
          <p>
            <el-icon name="el-icon-time"><timer /></el-icon>
            时间: {{ message.time }}
          </p>
          <p>
            <el-icon name="el-icon-document"><Coin /></el-icon>
            内容: {{ message.content }}
          </p>
          <p>
            <el-icon name="el-icon-location"><Location /></el-icon>
            位置: {{ message.location }}
          </p>
        </li>
      </ul>
    </el-card>
  </div>
</template>

<style>
.welcome-box {
  width: 100%;
  height: 100%;
  background-color: #f5f7fa;
  position: relative;
  align-items: center;
}
</style>
