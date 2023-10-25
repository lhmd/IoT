<script setup lang="ts">
import { useUserStore } from "@/stores/user";
const userStore = useUserStore();
var username = userStore.username;
const email = userStore.email;
const phone = userStore.phone;
const address = userStore.address;
const gender = userStore.gender;
import { computed, ref } from 'vue'

</script>

<template>
  <el-descriptions
    title="个人信息"
    :column="2"
  >
    <el-descriptions-item label="用户名">{{ username }}</el-descriptions-item>
    <el-descriptions-item label="" :span="2"><el-button type="primary">Primary</el-button></el-descriptions-item>
    <el-descriptions-item label="邮箱">{{ email }}</el-descriptions-item>
    <el-descriptions-item label="" :span="2"><el-button type="primary">Primary</el-button></el-descriptions-item>
    <el-descriptions-item label="Remarks">
      <el-tag size="small">School</el-tag>
    </el-descriptions-item>
    <el-descriptions-item label="Address"
      >No.1188, Wuzhong Avenue, Wuzhong District, Suzhou, Jiangsu Province
    </el-descriptions-item>
  </el-descriptions>
</template>

<style>
.el-descriptions {
  margin-top: 20px;
}
</style>
