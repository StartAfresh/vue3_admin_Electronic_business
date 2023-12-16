<template>
  <el-form :disabled="isShow" :inline="true" class="demo-form-inline">
    <el-form-item label="一级分类">
      <el-select v-model="useCategory.c1Id" @change="changeC1">
        <!-- label:即为展示数据 value:即为select下拉菜单收集的数据 -->
        <el-option
          v-for="(c1, index) in useCategory.C1Arr"
          :key="c1.id"
          :label="c1.name"
          :value="c1.id"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="二级分类">
      <el-select @change="changeC2" clearable v-model="useCategory.c2Id">
        <el-option
          v-for="c2 in useCategory.C2Arr"
          :key="c2.id"
          :label="c2.name"
          :value="c2.id"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="三级分类">
      <el-select v-model="useCategory.c3Id" clearable>
        <el-option
          v-for="c3 in useCategory.C3Arr"
          :key="c3.id"
          :label="c3.name"
          :value="c3.id"
        />
      </el-select>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
// 引入分类接口
import { onMounted, ref } from 'vue'
import useCategoryStore from '@/store/modules/Category'

let useCategory = useCategoryStore()
onMounted(() => {
  getCategoryDate()
})

let getCategoryDate = () => {
  useCategory.getCategoryC1()
}
// 当一级分类发生改变调用二级分类数据
let changeC1 = () => {
  useCategory.C3Arr = []
  useCategory.c3Id = ''
  useCategory.C2Arr = []
  useCategory.c2Id = ''
  useCategory.getCategoryC2()
}
// 当二级分类发生改变调用三级分类数据
let changeC2 = () => {
  useCategory.C3Arr = []
  useCategory.c3Id = ''
  useCategory.getCategoryC3()
}
// 表单是否禁用
defineProps(['isShow'])
</script>

<style scoped>
.demo-form-inline {
  text-align: center;
}

.el-form-item {
  margin: 0px;
  margin: 0 50px;
}
</style>
