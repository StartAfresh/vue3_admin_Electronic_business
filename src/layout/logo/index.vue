<template>
  <div class="logo">
    <img src="../../../public/avatar.jpeg" alt="" />
    <h1 v-if="!store.isCollapse">后台管理系统</h1>
  </div>
</template>

<script setup lang="ts">
import settingIsCollapse from '@/store/modules/setting'

const store = settingIsCollapse()
</script>

<style scoped lang="scss">
.logo {
  display: flex;
  width: 100%;
  height: $base-menu-logo-height;
  align-items: center;
  justify-content: center;
  img {
    width: 30px;
  }
  h1 {
    font-size: $base-logo-title-fontSize;
    color: white;
    margin: 0 20px;
    margin-left: 30px;
  }
}
</style>
