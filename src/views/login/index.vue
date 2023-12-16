<template>
  <div class="login_container">
    <div class="box">
      <el-form
        class="login_form"
        ref="loginForms"
        :model="loginFrom"
        :rules="rules"
      >
        <h1>人皆苦炎热，我爱夏日长。</h1>
        <h2>欢迎</h2>
        <el-form-item prop="username">
          <el-input v-model="loginFrom.username" :prefix-icon="User"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="loginFrom.password"
            type="password"
            :prefix-icon="Lock"
            show-password
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            @click="login"
            class="login_btn"
            type="primary"
            size="default"
            :loading="loding"
          >
            登录
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { User, Lock } from '@element-plus/icons-vue'
import { useUserStore } from '@/store/userStore/index'
import { useRouter, useRoute } from 'vue-router'
import { ElNotification } from 'element-plus'
import { getTime } from '@/utils/getTime'
let loginForms = ref()
// 用户输入
let loginFrom = reactive({ username: 'admin', password: 'atguigu123' })
let store = useUserStore()
let router = useRouter()
let route = useRoute()
// 控制登录加载效果
let loding = ref(false)
// 校验规则函数
// callback是否放行
// value：输入的数据
// rele 用户名等基本信息（基本不用）
let validatoruserName = (rule: any, value: any, callback: any) => {
  // console.log('我是rule', rule)
  // console.log('我是Value', value)
  if (value.length >= 5) {
    callback()
  } else {
    callback(new Error('用户名长度不够'))
  }
}

const validatorPassword = (rule: any, value: any, callback: any) => {
  if (value.length >= 6) {
    callback()
  } else {
    callback(new Error('密码长度至少六位'))
  }
}
// 校验规则
let rules = {
  username: [
    {
      trigger: 'change',
      validator: validatoruserName,
    },
  ],
  password: [
    {
      trigger: 'change',
      validator: validatorPassword,
    },
  ],
}
let redirect: any = route.query.redirect
console.log('我是redirect', redirect)
let login = async () => {
  loding.value = true
  // 这个方法会返回Promise对象
  await loginForms.value.validate()

  try {
    await store.userLogin(loginFrom)
    ElNotification({
      title: `${getTime()}`,
      message: '登录成功',
      type: 'success',
    })
    loding.value = false

    router.push({
      path: redirect || '/',
    })
  } catch (error) {
    ElNotification({
      title: `${getTime()}`,
      message: (error as Error).message,
      type: 'warning',
      position: 'top-right',
      customClass: 'changePos',
    })

    loding.value = false
  }
}
</script>

<style scoped lang="scss">
.login_container {
  width: 100vw;
  height: 100vh;
  background: url('../login/index.jpg') no-repeat center center;
  background-size: 100% 100%;
  margin: 0 auto;
  .box {
    position: relative;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 500px;
    height: 500px;
    background-color: rgba(19, 13, 15, 0.3);

    .login_form {
      width: 50%;
      position: relative;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
    }
    h1 {
      color: white;
      font-size: 20px;
    }

    h2 {
      font-size: 20px;
      color: white;
      margin: 20px 0px;
    }
  }
}
</style>
