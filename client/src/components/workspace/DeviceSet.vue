<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import { useUserStore } from "@/stores/user";
import { useDeviceStore } from "@/stores/device";
import { ElMessage } from "element-plus";
import axios from "axios";
const value1 = ref("");
const deviceType = [
  { type: "Sensor" },
  { type: "Camera" },
  { type: "Actuator" },
  { type: "Gateway" },
  { type: "Lock" },
  { type: "Tracker" },
];
const deviceStatus = [
  { status: "Running" },
  { status: "Fault" },
  { status: "Shutdown" },
];
let oldName = ref(value1);
// 变量title，如果value1是空的，title就是添加设备，否则就是修改设备
let title = ref("添加设备");

const options = ref<{ value: string; label: string }[]>([]);

const userStore = useUserStore();
const deviceStore = useDeviceStore();

interface DeviceType {
  name: string;
  type: string;
  status: string;
  location: string;
  description: string;
  owner: string;
  message_count: number;
}
let device: DeviceType[] = [];
let deviceCount = ref(0);
let onlineDeviceCount = ref(0);
// 定义一个变量依赖于模版DeviceType，记录指定设备的信息
let deviceModify = ref<DeviceType>({
  name: "",
  type: "",
  status: "",
  location: "",
  description: "",
  owner: userStore.username,
  message_count: 0,
});
const size = ref("middle");

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
      }
      // console.log(deviceTypeCount.value[0]);
      deviceCount.value = device.length;
      // ElMessage.success("加载设备信息成功");
    } else {
      ElMessage.error(response.data.message);
    }
  } catch (error) {
    ElMessage.error("加载设备信息请求出错");
    console.error("请求出错：", error);
  }
}

function onValue1Change() {
  console.log(value1.value);
  title.value = "修改设备";
  let length = device.length;
  for (let i = 0; i < length; i++) {
    if (device[i].name === value1.value) {
      deviceModify.value = device[i];
      oldName.value = device[i].name;
      break;
    }
  }
}

onMounted(() => {
  loadDevice();
});

async function onSubmit() {
  try {
    if (!deviceModify.value.name) {
      ElMessage.error("设备名不能为空");
      return;
    } else if (!deviceModify.value.type) {
      ElMessage.error("设备类型不能为空");
      return;
    } else if (!deviceModify.value.status) {
      ElMessage.error("设备状态不能为空");
      return;
    } else if (!deviceModify.value.location) {
      ElMessage.error("设备位置不能为空");
      return;
    }
    // 判断有没有修改设备信息
    if (
      deviceModify.value.name === oldName.value &&
      deviceModify.value.type === deviceModify.value.type &&
      deviceModify.value.status === deviceModify.value.status &&
      deviceModify.value.location === deviceModify.value.location &&
      deviceModify.value.description === deviceModify.value.description &&
      deviceModify.value.owner === deviceModify.value.owner
    ) {
      ElMessage.warning("您没有修改设备信息");
      return;
    }
    if (value1.value === "") {
      // 新建一个设备
      const send = {
        name: deviceModify.value.name,
        type: deviceModify.value.type,
        status: deviceModify.value.status,
        location: deviceModify.value.location,
        description: deviceModify.value.description,
        owner: deviceModify.value.owner,
      };
      const response = await axios.post(
        "http://localhost:3310/addDevice",
        send,
      );
      console.log("后端返回的消息：", response.data);
      var isAdded = response.data.success;
      if (isAdded) {
        ElMessage.success("添加成功！");
        deviceStore.addDevice(
          deviceModify.value.name,
          deviceModify.value.type,
          deviceModify.value.status,
          deviceModify.value.location,
          deviceModify.value.description,
          deviceModify.value.owner,
        );
        options.value.push({
          value: deviceModify.value.name,
          label: deviceModify.value.name,
        });
        oldName.value = deviceModify.value.name;
        value1.value = deviceModify.value.name;
        onValue1Change();
      } else {
        ElMessage.error(response.data.message);
      }
      return;
    }
    const send = {
      oldName: oldName.value,
      newName: deviceModify.value.name,
      type: deviceModify.value.type,
      status: deviceModify.value.status,
      location: deviceModify.value.location,
      description: deviceModify.value.description,
      owner: deviceModify.value.owner,
    };
    const response = await axios.post(
      "http://localhost:3310/modifyDevice",
      send,
    );
    console.log("后端返回的消息：", response.data);
    var isModified = response.data.success;
    if (isModified) {
      ElMessage.success("修改成功！");
      deviceStore.updateDevice(oldName.value, deviceModify.value);
      oldName.value = deviceModify.value.name;
      value1.value = deviceModify.value.name;
      onValue1Change();
    } else {
      ElMessage.error(response.data.message);
    }
  } catch (error) {
    ElMessage.error("修改失败");
    console.error("请求出错：", error);
  }
}

function onClearSelect() {
  // 清空 deviceModify 内容
  deviceModify.value = {
    name: "",
    type: "",
    status: "",
    location: "",
    description: "",
    owner: userStore.username,
    message_count: 0,
  };
  title.value = "添加设备";
}
</script>

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
    <div class="register_form">
      <h3>{{ title }}</h3>
      <el-form
        label-position="Right"
        label-width="100px"
        :model="deviceModify"
        :size="size"
      >
        <el-form-item
          label="设备名"
          :rules="[
            { required: true, message: '请输入设备名', trigger: 'blur' },
          ]"
        >
          <el-input v-model="deviceModify.name" />
        </el-form-item>
        <el-form-item
          label="设备类型"
          :rules="[
            { required: true, message: '请输入设备类型', trigger: 'blur' },
          ]"
        >
          <el-select
            v-model="deviceModify.type"
            class="m-2"
            placeholder="Select"
            size="large"
          >
            <el-option
              v-for="item in deviceType"
              :key="item.type"
              :label="item.type"
              :value="item.type"
            />
          </el-select>
        </el-form-item>

        <el-form-item
          label="设备状态"
          :rules="[
            { required: true, message: '请输入设备状态', trigger: 'blur' },
          ]"
        >
          <el-select
            v-model="deviceModify.status"
            class="m-2"
            placeholder="Select"
            size="large"
          >
            <el-option
              v-for="item in deviceStatus"
              :key="item.status"
              :label="item.status"
              :value="item.status"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="设备位置"
          :rules="[
            { required: true, message: '请输入设备位置', trigger: 'blur' },
          ]"
        >
          <el-input v-model="deviceModify.location" />
        </el-form-item>
        <el-form-item label="设备描述">
          <el-input v-model="deviceModify.description" />
        </el-form-item>
        <el-form-item>
          <el-button type="success" @click="onSubmit" size="large" round
            >提 交</el-button
          >
        </el-form-item>
      </el-form>
    </div>
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
