<script setup lang="ts">
import { useUserStore } from "@/stores/user";
const userStore = useUserStore();
const name = userStore.username;
</script>

<template>
  <div class="welcome-box">
    <h2>您好，{{ name }}，欢迎使用物联网管理系统</h2>
    <el-carousel indicator-position="none" class="carousel" autoplay>
      <el-carousel-item v-for="item in 5" :key="item" class="carousel-item"> </el-carousel-item>
    </el-carousel>
  </div>
</template>

<style>
.welcome-box {
  width: 100%;
  height: 100vh;
  position: relative;
  align-items: center;
}
.carousel {
  height: 100vh;
  width: 90%;
  top: 5vh;
  left: 3vw;
  align-self: center;
}
.carousel-item {
  height: 70vh;
}
/* 图片 */
.carousel .el-carousel__item:nth-child(6) {
  background-color: #3a8ee6;
  background-image: url(../../../public/1.png);
  background-size: cover;
}

.carousel .el-carousel__item:nth-child(5) {
  background-color: #3a8ee6;
  background-image: url(../../../public/2.png);
  background-size: cover;
}

.carousel .el-carousel__item:nth-child(3) {
  background-color: #3a8ee6;
  background-image: url(../../../public/3.png);
  background-size: cover;
}

.carousel .el-carousel__item:nth-child(4) {
  background-color: #3a8ee6;
  background-image: url(../../../public/4.png);
  background-size: cover;
}

.carousel .el-carousel__item:nth-child(7) {
  background-color: #3a8ee6;
  background-image: url(../../../public/5.png);
  background-size: cover;
}
</style>
