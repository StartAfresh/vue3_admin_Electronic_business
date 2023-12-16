<template>
  <div>
    <h1>分页器</h1>
  </div>
</template>

<script setup lang="ts">
import { onUnmounted } from 'vue'
onUnmounted(() => {
  console.log('组件已被销毁')
})
</script>

<style scoped></style>
