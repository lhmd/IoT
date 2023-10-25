<script setup lang="ts">
import TopBar from "../components/TopBar.vue";
import Welcome from "@/components/home/Welcome.vue";
import SideBarHome from "@/components/home/SideBarHome.vue";
</script>

<template>
  <TopBar />
  <div class="home-container">
    <SideBarHome />
    <el-container
      ><el-main><Welcome /></el-main
    ></el-container>
  </div>
</template>

<style scoped>
@media screen and (min-width: 1024px) {
  .home-container {
    display: flex;
    flex-direction: row;
  }
}

@media screen and (max-width: 1024px) {
  .home-container {
    flex-direction: column;
  }
}
</style>
