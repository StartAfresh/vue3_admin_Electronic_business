// 定义路由的类型
import { RouteRecordRaw } from 'vue-router'

export interface UserSate {
  token: string | null
  // routerList：类型为 RouteRecordRaw[] 的变量，表示用户的路由列表。
  routerList: RouteRecordRaw[]
  avatar: string
  username: string
}
