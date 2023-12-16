<template>
  <el-card style="margin: 0 30px; margin-top: 20px" class="box-card">
    <Category :isShow="scene == 1 || scene == 2"></Category>
  </el-card>

  <!-- 点击添加属性展示不同的卡片 -->

  <el-card style="margin: 0 30px; margin-top: 20px" class="box-card">
    <div v-show="scene == 0">
      <el-button
        :disabled="!useCategory.c3Id"
        style="margin-bottom: 20px"
        type="primary"
        icon="Plus"
        @click="addSPU"
      >
        添加SPU
      </el-button>
      <el-table border style="width: 100%" :data="spuList">
        <el-table-column
          type="index"
          label="序号"
          width="180"
          align="center"
        ></el-table-column>
        <el-table-column
          label="SPU名称"
          width="180"
          align="center"
          prop="spuName"
        ></el-table-column>
        <el-table-column
          show-overflow-tooltip="true"
          label="SPU描述"
          align="center"
          prop="description"
        ></el-table-column>
        <el-table-column label="操作" align="center" width="300px">
          <template #default="{ row, $index }">
            <el-button
              type="primary"
              icon="Plus"
              @click="addSku(row)"
            ></el-button>
            <el-button
              type="primary"
              @click="editSpu(row)"
              icon="Edit"
            ></el-button>
            <el-button
              type="primary"
              @click="showSku(row)"
              icon="View"
            ></el-button>
            <el-button
              type="primary"
              @click="deleteSpu(row)"
              icon="Delete"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页器 -->
      <el-pagination
        style="margin-top: 20px"
        :small="true"
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[3, 5, 7, 9]"
        layout=" prev, pager, next, jumper,->,total, sizes,"
        :total="total"
        @current-change="getSpuDate"
        @size-change="changeSize"
      />
    </div>
    <spuForm
      ref="spuFormRef"
      :scene="scene"
      @update:scene="handle($event)"
      v-show="scene == 1"
    ></spuForm>
    <skuForm
      ref="skuFormRef"
      @changeScene="changeScene"
      v-show="scene == 2"
    ></skuForm>

    <el-dialog v-model="dialogVisible" title="SKU列表">
      <el-table border :data="showSkuDate">
        <el-table-column label="SKU名字" prop="skuName"></el-table-column>
        <el-table-column label="SKU价格" prop="price"></el-table-column>
        <el-table-column label="SKU重量" prop="weight"></el-table-column>
        <el-table-column label="SKU图片">
          <template #="{ row, $index }">
            <img :src="row.skuDefaultImg" style="width: 100px; height: 100px" />
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </el-card>
</template>

<script setup lang="ts">
import { reqSpuList, reqSkuList, reqRemoveSpu } from '@/api/product/spu/index'
import useCategoryStore from '@/store/modules/Category'
import skuForm from './skuForm.vue'
import spuForm from './spuForm.vue'
let useCategory = useCategoryStore()
import { ref, watch, onBeforeUnmount, toRefs, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
// 场景的数据
let scene = ref(0) //0 显示spu  1 添加或修改spu  2 添加sku
// 当前页
let currentPage = ref(1)
// 每页展示的条数
let pageSize = ref(3)
// 总条数
let total = ref(0)

let spuList = ref([])
let getSpuDate = async (pager = 1) => {
  currentPage.value = pager
  let result = await reqSpuList(
    currentPage.value,
    pageSize.value,
    useCategory.c3Id,
  )
  if (result.code == 200) {
    spuList.value = result.data.records
    total.value = result.data.total
  }
}
watch(
  () => useCategory.c3Id,
  () => {
    getSpuDate()
  },
)
watch(scene, () => {
  getSpuDate()
})
// 将下拉框发生改变时，将当前页选项置为一
const changeSize = () => {
  getSpuDate()
}

// 添加SPU
let addSPU = () => {
  scene.value = 1
  spuFormRef.value.initAddSpu(useCategory.c3Id)
}

// 编辑SPU
// 获取组件实例
let spuFormRef = ref(null)

let editSpu = (row) => {
  scene.value = 1
  localStorage.setItem('currentPage', JSON.stringify(currentPage.value))
  spuFormRef.value.getSpu(row)
}

let handle = (obj) => {
  scene.value = obj.flag
  console.log('我执行了')
  //更新留在当前页
  nextTick(() => {
    if (obj.params == 'update') {
      //更新留在当前页
      getSpuDate(JSON.parse(localStorage.getItem('currentPage')))
    } else {
      //添加留在第一页
      getSpuDate()
    }
  })
}
// SKU 模块 ---------------------
// 添加sku
let skuFormRef = ref(null)
let addSku = (row) => {
  scene.value = 2
  skuFormRef.value.initSkuData(
    useCategory.c1Id,
    useCategory.c2Id,
    useCategory.c3Id,
    row,
  )
}

let changeScene = (obj) => {
  scene.value = obj.flag
}

// 展示SKU列表
let dialogVisible = ref(false)
let showSkuDate = ref([])
let showSku = async (row) => {
  dialogVisible.value = true
  let result = await reqSkuList(row.id)
  showSkuDate.value = result.data
}
// 删除SPU
let deleteSpu = async (row) => {
  let result = await reqRemoveSpu(row.id)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '删除成功',
    })
    getSpuDate(JSON.parse(localStorage.getItem('currentPage')))
  } else {
    ElMessage({
      type: 'error',
      message: '删除失败',
    })
  }
}
//路由组件销毁前，情况仓库关于分类的数据
onBeforeUnmount(() => {
  useCategory.$reset()
})
</script>
<style scoped></style>
