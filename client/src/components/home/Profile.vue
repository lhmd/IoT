<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { reactive, ref } from "vue";
import { ElMessage } from "element-plus";

const userStore = useUserStore();
const user = reactive({
  username: "",
  email: "",
  phone: "",
  gender: "",
  address: "",
});
const dialogPasswordVisible = ref(false);
const dialogInforVisible = ref(false);
const formLabelWidth = "140px";

async function modifyInfor() {
  try {
    
  } catch (error) {
    ElMessage.error("修改失败");
    console.error("请求出错：", error);
  }
}

</script>

<template>
  <div class="profile-container">
    <el-descriptions title="| 个人信息 |" :column="1" border>
      <template #extra>
        <el-button type="primary" @click="dialogInforVisible = true"
          >修改信息</el-button
        >
        <el-button type="danger" @click="dialogPasswordVisible = true"
          >修改密码</el-button
        >
      </template>
      <el-descriptions-item label="用户名">{{ user.username }}</el-descriptions-item>
      <!-- <el-descriptions-item label="" :span="2"><el-button type="primary" @click="modifyUsername">修改</el-button></el-descriptions-item> -->
      <el-descriptions-item label="性别">{{ user.gender }}</el-descriptions-item>
      <!-- <el-descriptions-item label="" :span="2"><el-button type="primary" @click="modifyGender">修改</el-button></el-descriptions-item> -->
      <el-descriptions-item label="邮箱">{{ user.email }}</el-descriptions-item>
      <!-- <el-descriptions-item label="" :span="2"><el-button type="primary" @click="modifyEmail">修改</el-button></el-descriptions-item> -->
      <el-descriptions-item label="电话">{{ user.phone }}</el-descriptions-item>
      <!-- <el-descriptions-item label="" :span="2"><el-button type="primary" @click="modifyPhone">修改</el-button></el-descriptions-item> -->
      <el-descriptions-item label="地址">{{ user.address }}</el-descriptions-item>
      <!-- <el-descriptions-item label="" :span="2"><el-button type="primary" @click="modifyAddress">修改</el-button></el-descriptions-item> -->
    </el-descriptions>
  </div>

  <el-dialog v-model="dialogInforVisible" title="修改信息">
    <el-form :model="user">
      <el-form-item label="username" :label-width="formLabelWidth">
        <el-input v-model="user.username" autocomplete="off" />
      </el-form-item>
      <el-form-item label="gender" :label-width="formLabelWidth">
        <el-input v-model="user.gender" autocomplete="off" />
      </el-form-item>
      <el-form-item label="email" :label-width="formLabelWidth">
        <el-input v-model="user.email" autocomplete="off" />
      </el-form-item>
      <el-form-item label="phone" :label-width="formLabelWidth">
        <el-input v-model="user.phone" autocomplete="off" />
      </el-form-item>
      <el-form-item label="address" :label-width="formLabelWidth">
        <el-input v-model="user.address" autocomplete="off" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
            <el-button @click="dialogInforVisible = false">取消</el-button>
            <el-button @click="modifyInfor">提交</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style>
.profile-container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  top: 5vh;
}

@media screen and (min-width: 1024px) {
  .profile-container .el-button {
    margin: 2vh;
  }
}

@media screen and (max-width: 1024px) {
  .profile-container .el-button {
    margin: 0vh;
    margin-right: 0vh;
  }
}

.el-descriptions {
  width: 60vw;
  height: 50vh;
  background-color: #f5f7fa;
  top: 5vh;
  align-self: center;
}

.el-button--text {
  margin-right: 15px;
}
.el-select {
  width: 300px;
}
.el-input {
  width: 300px;
}
.dialog-footer button:first-child {
  margin-right: 10px;
}
</style>
