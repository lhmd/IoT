<template>
  <div v-if="isMobile">
    <el-menu
      :default-active="activeIndex"
      class="el-menu-demo"
      mode="horizontal"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b"
      router
    >
      <el-menu-item index="/workspace/statistics">查询统计</el-menu-item>
      <el-menu-item index="/workspace/device">设备信息</el-menu-item>
      <el-menu-item index="/workspace/message">消息记录</el-menu-item>
      <el-menu-item index="/workspace/device/settings">设备配置</el-menu-item>
    </el-menu>
  </div>

  <div class="sidebar" v-if="!isMobile">
    <el-menu
      :default-active="activeIndex"
      class="el-menu-vertical-demo"
      popper-effect="light"
      router
    >
      <el-menu-item index="/workspace/statistics">
        <template #title>
          <el-icon><PieChart /></el-icon>
          <span>查询统计</span>
        </template>
      </el-menu-item>
      <el-menu-item index="/workspace/device">
        <template #title>
          <el-icon><location /></el-icon>
          <span>设备信息</span>
        </template>
      </el-menu-item>
      <el-menu-item index="/workspace/message">
        <template #title>
          <el-icon><printer /></el-icon>
          <span>消息记录</span>
        </template>
      </el-menu-item>
      <el-menu-item index="/workspace/device/settings">
        <template #title>
          <el-icon><setting /></el-icon>
          <span>设备配置</span>
        </template>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script setup lang="ts">
import { PieChart } from "@element-plus/icons-vue";
import { ref, onMounted, onBeforeUnmount } from "vue";

const isMobile = ref(false);
const activeIndex = ref("1");

const checkMobile = () => {
  isMobile.value = window.innerWidth < 1024;
};

onMounted(() => {
  checkMobile();
  window.addEventListener("resize", () => {
    checkMobile();
  });
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", () => {
    checkMobile();
  });
});
</script>

<style scoped>
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 20vw;
  min-height: 4vh;
}

.sidebar {
  display: flex;
  width: 20vw;
  height: 100vh;
  background-color: #545c64;
}
</style>
