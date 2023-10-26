<script setup lang="ts">
import { useUserStore } from "@/stores/user";
const userStore = useUserStore();
const name = userStore.username;
</script>

<template>
  <div class="welcome-box">
    <h2>您好，{{ name }}，欢迎使用物联网管理系统</h2>
    <el-carousel indicator-position="outside" class="carousel">
      <el-carousel-item v-for="item in 4" :key="item"> </el-carousel-item>
    </el-carousel>
  </div>
</template>

<style>
.welcome-box {
  width: 100%;
  height: 100%;
  background-color: #ffffff;
  position: relative;
  align-items: center;
}
.carousel {
  /* width: 60vw;
  height: 50vh; */
  background-color: #3a8ee6;
  top: 5vh;
  align-self: center;
}
.el-carousel__item:nth-child(3) {
  background-color: #1f4d92;
}
.el-carousel__item:nth-child(4) {
  background-color: #ac3636;
}
.el-carousel__item:nth-child(5) {
  background-color: #1eba29;
}
.el-carousel__item:nth-child(6) {
  background-color: #f5f7fa;
}
</style>
