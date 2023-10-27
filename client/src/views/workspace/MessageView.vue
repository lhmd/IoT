<script setup lang="ts">
import TopBar from "@/components/TopBar.vue";
import SideBarWorkspace from "@/components/workspace/SideBarWorkspace.vue";
import Message from "@/components/workspace/Message.vue";
</script>

<template>
  <TopBar />
  <div class="home-container"><SideBarWorkspace /><Message /></div>
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
