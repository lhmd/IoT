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
      @select="handleSelect"
    >
      <el-menu-item index="/workspace">查询统计</el-menu-item>
      <el-menu-item index="/device">设备信息</el-menu-item>
      <el-menu-item index="/message">消息记录</el-menu-item>
      <el-menu-item index="/device/settings">设备配置</el-menu-item>
    </el-menu>
  </div>

  <div class="sidebar" v-if="!isMobile">
    <el-menu
      :default-active="activeIndex"
      class="el-menu-vertical-demo"
      popper-effect="light"
      router
      @select="handleSelect"
    >
      <el-menu-item index="/workspace">
        <template #title>
          <el-icon><PieChart /></el-icon>
          <span>查询统计</span>
        </template>
      </el-menu-item>
      <el-menu-item index="/device">
        <template #title>
          <el-icon><location /></el-icon>
          <span>设备信息</span>
        </template>
      </el-menu-item>
      <el-menu-item index="/message">
        <template #title>
          <el-icon><printer /></el-icon>
          <span>消息记录</span>
        </template>
      </el-menu-item>
      <el-menu-item index="/device/settings">
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
const activeIndex = ref("/workspace");

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

const handleSelect = (index: string) => {
  activeIndex.value = index;
  console.log(index);
};
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
