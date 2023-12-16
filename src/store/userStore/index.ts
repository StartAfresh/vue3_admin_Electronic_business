import { defineStore } from 'pinia'
import { reqLogin, reqUserInfo, reqLogout } from '@/api/user/index'
// import type { loginForm } from '@/api/user/type'
// import { loginResponseData } from '@/api/user/type'
import { UserSate } from '@/store/type'
import { constantRoute } from '@/router/routers'

export const useUserStore = defineStore('userLoginInfo', {
  state: (): UserSate => {
    return {
      token: localStorage.getItem('TOKEN'),
      routerList: constantRoute,
      avatar: '',
      username: '',
    }
  },
  // 异步请求
  actions: {
    async userLogin(data: any) {
      const result = await reqLogin(data)
      // console.log(result)

      if (result.code == 200) {
        this.token = result.data as string
        return 'ok'
      } else {
        return Promise.reject(new Error(result.message))
      }
    },

    async userInfo() {
      const result = await reqUserInfo()
      if (result.code == 200) {
        this.avatar = result.data.avatar
        this.username = result.data.username
        return 'ok'
      } else {
        return Promise.reject('获取用户信息失败')
      }
    },
    async loginOut() {
      const result = await reqLogout()
      if (result.code == 200) {
        this.avatar = ''
        this.token = ''
        this.username = ''
        localStorage.removeItem('TOKEN')
        return 'ok'
      } else {
        return Promise.reject('退出登录失败')
      }
    },
  },
  // 持久化配置
  persist: {
    key: 'TOKEN',
    paths: ['token'],
  },
})
