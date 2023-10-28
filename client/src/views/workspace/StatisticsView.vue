<script setup lang="ts">
import TopBar from "@/components/TopBar.vue";
import SideBarWorkspace from "@/components/workspace/SideBarWorkspace.vue";
import Statistics from "@/components/workspace/Statistics.vue";
</script>

<template>
  <TopBar />
  <div class="home-container"><SideBarWorkspace /><Statistics /></div>
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
    display: flex;
    flex-direction: column;
  }
}
</style>
