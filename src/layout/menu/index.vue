<template>
  <template v-for="item in menuList" :key="item.path">
    <!--没有子路由-->
    <template v-if="!item.children">
      <el-menu-item
        @click="goRouter"
        v-if="!item.meta.hidden"
        :index="item.path"
      >
        <el-icon><component :is="item.meta.icon"></component></el-icon>
        <span>{{ item.meta.title }}</span>
      </el-menu-item>
    </template>
    <!-- 有子路由但是只有一个子路由 -->

    <template v-else-if="item.children && item.children.length === 1">
      <el-menu-item
        v-if="!item.meta.hidden"
        :index="item.path"
        @click="goRouter"
      >
        <el-icon><component :is="item.meta.icon"></component></el-icon>
        <!-- 相当于加载他 -->
        <!-- <el-icon><HomeFilled /></el-icon> -->
        <span>{{ item.children[0].meta.title }}</span>
      </el-menu-item>
    </template>

    <!-- 有子路由且个数大于一个1 -->
    <!-- 注意：item.children && item.children.length必须配合使用，不然报错显示length不存在 -->
    <template v-if="item.children && item.children.length > 1">
      <el-sub-menu v-if="!item.meta.hidden" :index="item.path">
        <template #title>
          <el-icon><component :is="item.meta.icon"></component></el-icon>
          <span>{{ item.meta.title }}</span>
        </template>
        <Menu :menuList="item.children"></Menu>
      </el-sub-menu>
    </template>
  </template>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

defineProps(['menuList'])
let $router = useRouter()
// element ui回调参数VC
let goRouter = (VC: any) => {
  console.log('我是VC', VC)
  $router.push(VC.index)
}
</script>
<script lang="ts">
export default {
  name: 'Menu',
}
</script>
