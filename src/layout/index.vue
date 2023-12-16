<template>
  <div class="layout_contain">
    <div
      class="layout_slider"
      :class="{ changeScrollbarWidth: storeIsCollapse.isCollapse }"
    >
      <Logo></Logo>
      <el-scrollbar class="changeScrollbarHeight">
        <el-menu
          :collapse="storeIsCollapse.isCollapse"
          :default-active="$route.path"
          background-color="#333"
          text-color="#fff"
        >
          <Menu :menuList="store.routerList"></Menu>
        </el-menu>
      </el-scrollbar>
    </div>

    <div
      class="layout_tabbar"
      :class="{ changeScrollbarWidth: storeIsCollapse.isCollapse }"
    >
      <Tabbar :isCollapse="storeIsCollapse.isCollapse"></Tabbar>
    </div>
    <div
      class="layout_main"
      ref="el"
      :class="{ changeScrollbarWidth: storeIsCollapse.isCollapse }"
    >
      <el-scrollbar>
        <router-view :el="$el" v-if="flag"></router-view>
      </el-scrollbar>
    </div>
  </div>
</template>

<script setup lang="ts">
import Logo from '@/layout/logo/index.vue'
import Menu from '@/layout/menu/index.vue'
import Tabbar from '@/layout/tabbar/index.vue'
import { useUserStore } from '@/store/userStore/index'
import { useRoute } from 'vue-router'
import settingIsCollapse from '@/store/modules/setting'
import { ref, watch, nextTick } from 'vue'
let storeIsCollapse = settingIsCollapse()
let store = useUserStore()
let $route = useRoute()

// 控制路由的刷新
let flag = ref(true)

watch(
  () => storeIsCollapse.isRefresh,
  () => {
    flag.value = false
    nextTick(() => {
      flag.value = true
    })
  },
)
</script>

<style scoped lang="scss">
.layout_contain {
  width: 100vw;
  height: 100vh;

  .layout_slider {
    height: 100%;
    width: $base-menu-width;
    background-color: #333;
    transition: all 0.8s;
    .changeScrollbarHeight {
      height: calc(100% - $base-menu-logo-height);
      .el-menu {
        border-right: none;
      }
    }
    &.changeScrollbarWidth {
      width: 60px;
      left: 0 !important;
    }
  }
  // calc(100vh - $base-menu-logo-height);
  .layout_tabbar {
    display: flex;
    position: fixed;
    top: 0;
    left: $base-menu-width;
    transition: all 0.8s; // width: calc(100vh-$base-menu-width);
    width: calc(100vw - $base-menu-width);
    height: $base-tabbar-height;
    background-color: #282828;
    &.changeScrollbarWidth {
      width: calc(100vw - $base-menu-collapse-width);
      left: $base-menu-collapse-width;
    }
  }
  .layout_main {
    position: absolute;
    width: calc(100vw - $base-menu-width);
    height: calc(100vh - $base-tabbar-height);
    background-color: white;
    left: $base-menu-width;
    top: $base-tabbar-height;
    overflow: auto;
    padding: 10px 0px 10px 10px;
    transition: all 0.8s;
    &.changeScrollbarWidth {
      width: calc(100vw - $base-menu-collapse-width);
      left: $base-menu-collapse-width;
    }
  }

  // 滚动条样式
  .scrollbar-demo-item {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 50px;
    margin: 10px;
    text-align: center;
    border-radius: 4px;
    background: var(--el-color-primary-light-9);
    color: var(--el-color-primary);
  }
}
</style>
