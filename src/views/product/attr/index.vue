<template>
  <el-card style="margin: 0 30px; margin-top: 20px" class="box-card">
    <Category :isShow="isShow"></Category>
  </el-card>
  <!-- 点击添加属性展示不同的卡片 -->
  <div v-show="isShow == 0">
    <el-card style="margin: 0 30px; margin-top: 20px" class="box-card">
      <el-button
        style="margin-bottom: 20px"
        type="primary"
        icon="Plus"
        :disabled="useCategory.c3Id ? false : true"
        @click="addAttr"
      >
        添加平台属性
      </el-button>
      <el-table :data="categoryAttr" border style="width: 100%">
        <el-table-column
          type="index"
          label="序号"
          width="180"
          align="center"
        ></el-table-column>
        <el-table-column
          label="属性名称"
          width="180"
          align="center"
          prop="attrName"
        ></el-table-column>
        <el-table-column label="属性值名称" align="center">
          <template #default="{ row, $index }">
            <el-tag v-for="item in row.attrValueList" :key="item.id">
              {{ item.valueName }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="300px">
          <template #="{ row, $index }">
            <el-button
              type="primary"
              @click="editAttr(row, $index)"
              icon="Edit"
            >
              修改
            </el-button>

            <el-popconfirm
              :title="`你确定删除${row.attrName}?`"
              width="200px"
              @confirm="deleteAttr(row.id)"
            >
              <template #reference>
                <el-button type="primary" icon="Edit">删除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
  <div v-show="isShow == 1">
    <el-card style="margin: 0 30px; margin-top: 20px" class="box-card">
      <el-form :inline="true">
        <el-form-item label="属性名称">
          <el-input
            placeholder="请您输入属性的名字"
            v-model="attrParams.attrName"
          ></el-input>
        </el-form-item>
      </el-form>

      <el-button
        @click="addAttrValue"
        style="margin-bottom: 20px"
        type="primary"
        icon="Plus"
      >
        添加属性值
      </el-button>
      <el-button @click="delAllAttr" style="margin-bottom: 20px">
        取消
      </el-button>

      <el-table border style="width: 100%" :data="attrParams.attrValueList">
        <el-table-column
          type="index"
          label="序号"
          width="180"
          align="center"
        ></el-table-column>
        <el-table-column label="属性值名称" align="center">
          <template #default="{ row, $index }">
            <el-input
              :ref="(vc: any) => (inputArr[$index] = vc)"
              @blur="saveAttrValue(row, $index)"
              v-if="row.flag"
              v-model="row.valueName"
            ></el-input>
            <div @click="toEdit(row, $index)" v-else="row.flag">
              {{ row.valueName }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="left" width="300px">
          <template #default="{ row, $index }">
            <el-button
              @click="delAttrValue(row, $index)"
              type="primary"
              icon="Delete"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-button
        style="margin-top: 20px"
        type="primary"
        icon="Plus"
        @click="save"
        :disabled="attrParams.attrValueList.length == 0"
      >
        保存
      </el-button>
      <el-button style="margin-top: 20px" @click="cancelAddAttr">
        取消
      </el-button>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import {
  reqCategoryAttr,
  reqCategoryAttrAddOrUpdate,
  reqRemoveAttr,
} from '@/api/product/attr'
import useCategoryStore from '@/store/modules/Category'
import { ref, watch, reactive, nextTick, onBeforeUnmount } from 'vue'
import { ElMessage } from 'element-plus'
let useCategory = useCategoryStore()
let categoryAttr = ref([])
watch(
  () => useCategory.c3Id,
  async () => {
    if (!useCategory.c3Id) {
      categoryAttr.value = []
      return
    }
    getCategoryAttr()
  },
)

let getCategoryAttr = async () => {
  let result = await reqCategoryAttr(
    useCategory.c1Id,
    useCategory.c2Id,
    useCategory.c3Id,
  )
  if (result.code == 200) {
    categoryAttr.value = result.data
  }
}
let isShow = ref(0)

let addAttr = () => {
  isShow.value = 1
}

let cancelAddAttr = () => {
  isShow.value = 0
  Object.assign(attrParams, {
    attrName: '', //新增的属性的名字
    attrValueList: [
      //新增的属性值数组
    ],
    categoryId: '', //三级分类的ID
    categoryLevel: 3, //代表的是三级分类
  })
}

// 添加属性值,用于判断输入框是否失去焦点
let addAttrValue = () => {
  attrParams.attrValueList.push({
    valueName: '',
    flag: true,
  })

  //获取最后el-input组件聚焦
  nextTick(() => {
    inputArr.value[attrParams.attrValueList.length - 1].focus()
  })
}

// 新增属性
//收集新增的属性的数据
let attrParams = reactive<Attr>({
  attrName: '', //新增的属性的名字
  attrValueList: [
    //新增的属性值数组
  ],
  categoryId: '', //三级分类的ID
  categoryLevel: 3, //代表的是三级分类
})
// 保存添加的属性值
let save = async () => {
  attrParams.categoryId = useCategory.c3Id
  let result = await reqCategoryAttrAddOrUpdate(attrParams)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '保存成功',
    })
    isShow.value = 0
    Object.assign(attrParams, {
      attrName: '', //新增的属性的名字
      attrValueList: [
        //新增的属性值数组
      ],
      categoryId: '', //三级分类的ID
      categoryLevel: 3, //代表的是三级分类
    })
    getCategoryAttr()
  } else {
    ElMessage({
      type: 'error',
      message: '保存失败',
    })
  }
}
// 判断input是否失去焦点
let saveAttrValue = (row: any, $index: any) => {
  //非法情况判断1
  if (row.valueName.trim() == '') {
    //删除调用对应属性值为空的元素
    attrParams.attrValueList.splice($index, 1)
    //提示信息
    ElMessage({
      type: 'error',
      message: '属性值不能为空',
    })
    return
  }
  //非法情况2
  let repeat = attrParams.attrValueList.find((item) => {
    //切记把当前失却焦点属性值对象从当前数组扣除判断
    if (item != row) {
      return item.valueName === row.valueName
    }
  })
  console.log(repeat)

  if (repeat) {
    //将重复的属性值从数组当中干掉
    attrParams.attrValueList.splice($index, 1)
    //提示信息
    ElMessage({
      type: 'error',
      message: '属性值不能重复',
    })
    return
  }
  //相应的属性值对象flag:变为false,展示div
  row.flag = false
}
// 存储组件中的数据，来聚焦输入框
let inputArr = ref([])

// 编辑属性
let toEdit = (row: any, $index) => {
  row.flag = true
  nextTick(() => {
    inputArr.value[$index].focus()
  })
}
// 删除某个属性
let delAttrValue = (row: any, $index: any) => {
  attrParams.attrValueList.splice($index, 1)
}
// 删除所有属性
let delAllAttr = () => {
  attrParams.attrValueList = []
  attrParams.attrName = ''
}

// 修改平台属性
let editAttr = (row: any, index) => {
  isShow.value = 1
  nextTick(() => {
    //将已有的属性对象赋值给attrParams对象即为
    //ES6->Object.assign进行对象的合并
    Object.assign(attrParams, JSON.parse(JSON.stringify(row)))
    console.log('我是attrParams', attrParams)
  })
}
//删除某一个已有的属性方法回调
const deleteAttr = async (attrId: number) => {
  //发相应的删除已有的属性的请求
  let result: any = await reqRemoveAttr(attrId)
  //删除成功
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '删除成功',
    })
    //获取一次已有的属性与属性值
    getCategoryAttr()
  } else {
    ElMessage({
      type: 'error',
      message: '删除失败',
    })
  }
}

//路由组件销毁的时候，把仓库分类相关的数据清空
onBeforeUnmount(() => {
  //清空仓库的数据
  useCategory.$reset()
})
</script>

<style scoped></style>
