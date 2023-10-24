<script setup lang="ts">
import { reactive, ref, onMounted, onBeforeUnmount } from 'vue'
import type { FormProps } from 'element-plus'
import { useRouter } from 'vue-router'
import axios from 'axios'

const Router = useRouter()
const labelPosition = ref<FormProps['labelPosition']>('top')
const isMobile = ref(false)
const size = ref('large')

const checkMobile = () => {
  isMobile.value = window.innerWidth < 768
  if (isMobile.value) {
    labelPosition.value = 'top'
  } else {
    labelPosition.value = 'left'
  }
}
onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
})
onBeforeUnmount(() => {
  window.removeEventListener('resize', checkMobile)
})


const UserLogin = reactive({
  username: '',
  password: '',
})

async function onSubmit() {
  try {
    console.log(UserLogin);
    const response = await axios.post('/loginSubmit', UserLogin);
    console.log('后端返回的消息：', response.data);
  } catch (error) {
    console.error('请求出错：', error);
  }
}

// const onSubmit=()=>{
//     axios.post('/loginSubmit',UserLogin).then(function(response){
//           console.log(response)
//     })
//     // hotel_init()
// }

function onRegister() {
  Router.push('/register')
}
</script>

<template>
  <div class="login_bckg">
    <img src="../assets/login_bckg.png" alt=""/>
  </div>
  <div class="login_form" :class="{ 'mobile': isMobile }">
    <h3>Sign in</h3>
    <el-form
    :label-position="labelPosition"
    label-width="100px"
    :model="UserLogin"
    :size="size"
  >
    <el-form-item label="姓名">
      <el-input v-model="UserLogin.username" />
    </el-form-item>
    <el-form-item label="密码">
      <el-input v-model="UserLogin.password" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit">登录</el-button>
      <el-button type="success" @click="onRegister">注册</el-button>
    </el-form-item>
  </el-form>
  </div>
</template>

<style scoped>

.login_bckg {
  display: flex;
  width: 100%;
  height: 100vh;
}

.login_bckg img {
  object-fit: cover;
  width: 100%;
  height: 100%;
}

.login_form {
  position: absolute;
  top: 55vh;
  left: 25vw;
  transform: translate(-50%, -50%);
  width: 30vw;
  height: 60vh;
  padding: 20px;
  border-radius: 10px; /* 圆角半径 */
  background-color: rgba(255, 255, 255, 0.5); /* 使用rgba来设置背景颜色并控制半透明度 */
  max-width: 40vw;
  min-width: 25vw;
}

.login_form.mobile {
  position: absolute;
  top: 55vh;
  left: 50vw;
  transform: translate(-50%, -50%);
  width: 80vw;
  height: 70vh;
  padding: 20px;
  border-radius: 10px; /* 圆角半径 */
  background-color: rgba(255, 255, 255, 0.5); /* 使用rgba来设置背景颜色并控制半透明度 */
}

.login_form h3 {
  text-align: center;
  margin-bottom: 8vh;
}

</style>
