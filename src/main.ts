import { createApp } from 'vue'
import globalComponent from '@/components/index.ts'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
// 注册svg
import 'virtual:svg-icons-register'
import router from '@/router/index'
//@ts-expect-error忽略当前文件ts类型的检测否则有红色提示(打包会失败)
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import 'animate.css'
import pinia from './store'

// 引入鉴权
import '@/permission.js'
// pinia与piniaPluginPersistedstate进行持久化管理
// 定义全局插件
const app = createApp(App)
app.use(globalComponent)
app.use(ElementPlus, {
  locale: zhCn,
})
app.use(router)
app.use(pinia)
app.mount('#app')

// 清除默认样式
import '@/styles/index.scss'
//在开发环境，获取变量。在不同环境下，获取不同的值
// console.log(import.meta.env)

// axios({
//   url: '/api/user/login',
//   method: 'post',
//   data: {
//     username: 'admin',
//     password: '111111',
//   },
// })
