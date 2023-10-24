<template>
  <div v-if="isMobile">
    <el-menu
      :default-active="activeIndex2"
      class="el-menu-demo"
      mode="horizontal"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b"
      router
    >
      <el-menu-item index="/Workspace/">查询统计</el-menu-item>
      <el-menu-item index="/Workspace/">设备信息</el-menu-item>
      <el-menu-item index="/Workspace/">设备配置</el-menu-item>
    </el-menu>
  </div>

  <div class="sidebar" v-if="!isMobile">
    <el-menu
      default-active="2"
      class="el-menu-vertical-demo"
      popper-effect="light"
      router
    >
      <el-menu-item index="/Workspace/">
        <template #title>
          <el-icon><monitor /></el-icon>
          <span>查询统计</span>
        </template>
      </el-menu-item>
      <el-menu-item index="/Workspace/">
        <template #title>
          <el-icon><location /></el-icon>
          <span>设备信息</span>
        </template>
      </el-menu-item>
      <el-menu-item index="/Workspace/">
        <template #title>
          <el-icon><setting /></el-icon>
          <span>设备配置</span>
        </template>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";

const isMobile = ref(false);
const activeIndex2 = ref("1");

const checkMobile = () => {
  isMobile.value = window.innerWidth < 768;
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
