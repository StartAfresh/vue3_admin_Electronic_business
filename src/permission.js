// 路由鉴权文件
import pinia from './store/index'
import { useUserStore } from '@/store/userStore'
// 引入路由
import router from './router'
// 引入进度条
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
// 清除加载Loding
NProgress.configure({ showSpinner: false })

// 路由切换之前
// 路由鉴权 let userStores = useUserStore(pinia) 必须放在路由守卫中，不然pinia持久化会失效
router.beforeEach(async (to, from, next) => {
  let userStores = useUserStore(pinia)
  if (userStores.token) {
    // 登录成功后访问，login页面自动跳转到home
    if (to.path === '/login') {
      next('/')

      // 访问的不是Login ，判断他是否有用户信息，有就放行没有就获取用户信息
    } else {
      // 强制刷新页面会触发路由守卫
      if (userStores.username) {
        next()
      } else {
        try {
          // 获取用户信息
          await userStores.userInfo()
          next()
        } catch (error) {
          await userStores.loginOut()
          next('/login')
        }
      }
    }
  } else {
    // 未登录访问login页面跳转到login
    if (to.path !== '/login') {
      next('/login')
    } else {
      // 跳转到Login 那就放行
      next()
    }
  }
  NProgress.start()
  next()
})

// 请注意，全局后置守卫没有next参数，因为它不会影响路由导航的流程。它只是在路由导航完成后被调用，所以你不需要调用next函数
// 路由切换之后
router.afterEach((to, from) => {
  document.title = '商城后台' + '-' + to.meta.title
  NProgress.done()
})
