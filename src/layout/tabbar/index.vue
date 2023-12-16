<template>
  <div class="layout_tabbar" :class="{ fold: props.isCollapse }">
    <div class="tabbar_left">
      <el-icon @click="collapse" style="color: white; margin-left: 10px">
        <component :is="store.isCollapse ? 'Open' : 'TurnOff'"></component>
      </el-icon>
      <el-breadcrumb separator-icon="ArrowRight">
        <el-breadcrumb-item
          v-show="item.meta.title"
          v-for="(item, index) in $route.matched"
          :key="index"
          :to="item.path"
        >
          <el-icon><component :is="item.meta.icon"></component></el-icon>
          <span>{{ item.meta.title }}</span>
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div :class="{ fold: props.isCollapse }" class="tabbar_right">
      <el-row>
        <el-button
          @click="refresh"
          size="large"
          color="#626aef"
          icon="Refresh"
          circle
        />
        <el-button
          @click="fullScreen"
          size="large"
          type="primary"
          icon="FullScreen"
          circle
        />

        <el-button size="large" type="success" icon="Setting" circle />
      </el-row>
      <img class="avatar" :src="userStore.avatar" alt="" />
      <el-dropdown class="name">
        <span class="el-dropdown-link">
          {{ userStore.username }}
          <el-icon class="el-icon--right">
            <arrow-down />
          </el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="logOut">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <!-- <div class="name">
        <span>admin</span>
        <el-icon><ArrowDown /></el-icon>
      </div> -->
    </div>
  </div>
</template>

<script setup lang="ts">
// 控制全屏
import { useFullscreen } from '@vueuse/core'

import settingIsCollapse from '@/store/modules/setting'

import { useUserStore } from '@/store/userStore/index'

import { useRoute, useRouter } from 'vue-router'

let userStore = useUserStore()

let $route = useRoute()
let $router = useRouter()
console.log($route)
let props = defineProps(['isCollapse', 'el'])
const store = settingIsCollapse()
let collapse = () => {
  // 控制菜单的折叠，以及图标的变化
  store.isCollapse = !store.isCollapse
}
// 刷新
let refresh = () => {
  store.isRefresh = !store.isRefresh
}
// 控制全屏
const { isFullscreen, enter, exit } = useFullscreen(props.el)
let fullScreen = () => {
  if (!isFullscreen.value) {
    // 进入全屏
    enter()
  } else {
    // 离开全屏
    exit()
  }
}

// 退出登录
let logOut = async () => {
  await userStore.loginOut()
  $router.push({
    path: '/login',
    query: {
      redirect: $route.path,
    },
  })
}
</script>

<style scoped lang="scss">
.layout_tabbar {
  position: fixed;
  justify-content: space-between;
  align-items: center;
  height: $base-tabbar-height;

  .tabbar_left {
    display: flex;
    align-items: center;
    .el-icon {
      margin-right: 10px;
    }

    /* 不被选中时的颜色 */
    .el-breadcrumb ::v-deep .el-breadcrumb__inner {
      color: white !important;
      font-weight: 400 !important;
    }
    /* 被选中时的颜色 */
    .el-breadcrumb__item:last-child ::v-deep .el-breadcrumb__inner {
      color: white !important;
      // font-weight: 800 !important;
    }
  }
  .avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    margin-right: 10px;
  }
  .tabbar_right {
    display: flex;
    align-items: center;
    .el-button {
      margin-left: 15px;
      margin-right: 10px;
    }

    .name {
      color: white;
      width: 80px;
      text-align: center;
      margin-right: 15px;
    }
    img {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      margin-left: 10px;
    }
    &.fold {
      margin-right: -152px;
    }
  }

  &.fold {
    left: 0px !important;
    margin-left: $base-menu-collapse-width;
  }
}
</style>
