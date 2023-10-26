<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import { useUserStore } from "@/stores/user";
import { useDeviceStore } from "@/stores/device";
import { useMessageStore } from "@/stores/message";
import { ElMessage } from "element-plus";
import axios from "axios";
import { Message } from "@element-plus/icons-vue";
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
}
let device: DeviceType[] = [];
let deviceCount = ref(0);
let message: MessageType[] = [];
let messageCount = ref(0);

async function loadDevice() {
  try {
    const response = await axios.post(
      "http://localhost:3310/getDevice",
      userStore,
    );
    if (response.data.success) {
      device = response.data.device; // 数组
      let length = device.length;
      // if (deviceStore.devices.length > 0) {
      //   length = 0;
      // }
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
      }
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
        );
      }
      // console.log("这是message", messageStore.messages);
      messageCount.value = message.length;
      ElMessage.success("加载设备消息成功");
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
</script>

<template>
  <div class="welcome-box">
    <el-row :gutter="16" class="el-row">
      <el-col :span="8">
        <div class="statistic-card">
          <el-statistic :value="deviceCount">
            <template #title>
              <div style="display: inline-flex; align-items: center">
                设备总数
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
          <div class="statistic-footer">
            <div class="footer-item">
              <span>than yesterday</span>
              <span class="green">
                24%
                <el-icon>
                  <CaretTop />
                </el-icon>
              </span>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="statistic-card">
          <el-statistic :value="693700">
            <template #title>
              <div style="display: inline-flex; align-items: center">
                Monthly Active Users
                <el-tooltip
                  effect="dark"
                  content="Number of users who logged into the product in one month"
                  placement="top"
                >
                  <el-icon style="margin-left: 4px" :size="12">
                    <Warning />
                  </el-icon>
                </el-tooltip>
              </div>
            </template>
          </el-statistic>
          <div class="statistic-footer">
            <div class="footer-item">
              <span>month on month</span>
              <span class="red">
                12%
                <el-icon>
                  <CaretBottom />
                </el-icon>
              </span>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="statistic-card">
          <el-statistic :value="72000" title="New transactions today">
            <template #title>
              <div style="display: inline-flex; align-items: center">
                New transactions today
              </div>
            </template>
          </el-statistic>
          <div class="statistic-footer">
            <div class="footer-item">
              <span>than yesterday</span>
              <span class="green">
                16%
                <el-icon>
                  <CaretTop />
                </el-icon>
              </span>
            </div>
            <div class="footer-item">
              <el-icon :size="14">
                <ArrowRight />
              </el-icon>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<style>
.welcome-box {
  width: 100%;
  height: 100%;
  background-color: #ffffff;
  position: relative;
  align-items: center;
  padding: 3vh;
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
