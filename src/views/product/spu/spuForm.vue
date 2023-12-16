<template>
  <el-form label-width="120px">
    <el-form-item label="spu名称">
      <el-input
        placeholder="请你输入SPU名称"
        v-model="SpuParams.spuName"
      ></el-input>
    </el-form-item>
    <el-form-item label="SPU品牌">
      <el-select v-model="SpuParams.tmId" placeholder="please select your zone">
        <el-option
          v-for="(item, index) in AllTradeMark"
          :key="item.id"
          :label="item.tmName"
          :value="item.id"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="SPU描述">
      <el-input
        v-model="SpuParams.description"
        type="textarea"
        placeholder="请你输入描述"
      />
    </el-form-item>
    <!-- 上传图片 -->
    <el-form-item label="SPU图片">
      <!-- 
        :show-file-list="false" : 是否展示上传的进度
        action ： 将图片上传到服务器
        :on-success="handleAvatarSuccess": 上传成功后的钩子函数
        :before-upload="beforeAvatarUpload" : 上传前的钩子函数

       -->
      <el-upload
        v-model:file-list="spuImageList"
        class="avatar-uploader"
        action="api/admin/product/fileUpload"
        list-type="picture-card"
        :on-preview="handlePictureCardPreview"
        :on-remove="handleRemove"
        :before-upload="handlerUpload"
      >
        <el-icon class="avatar-uploader-icon"><Plus /></el-icon>
      </el-upload>
      <el-dialog v-model="dialogVisible">
        <img w-full :src="dialogImageUrl" alt="Preview Image" />
      </el-dialog>
    </el-form-item>

    <el-form-item label="SUP销售属性">
      <el-select
        v-model="saleAttrIdAndValueName"
        :placeholder="unSelectSaleAttr.length > 0 ? '请选择' : '无可选项'"
      >
        <el-option
          v-for="item in unSelectSaleAttr"
          :key="item.id"
          :label="item.name"
          :value="`${item.id}:${item.name}`"
        />
      </el-select>
      <el-button
        @click="addSaleAttr"
        style="margin-left: 20px"
        type="primary"
        icon="Plus"
        :disabled="saleAttrIdAndValueName ? false : true"
      >
        添加销售属性
      </el-button>

      <!-- 表格 -->
      <el-table
        :data="spuHasSaleAttr"
        border
        style="width: 100%; margin-top: 20px"
      >
        <el-table-column
          label="序号"
          width="80px"
          align="center"
          type="index"
        ></el-table-column>
        <el-table-column
          align="center"
          label="销售属性名"
          width="180"
          prop="saleAttrName"
        >
          <!-- <template #default="{ row }">
        <pre>{{ row.tmName }}</pre>
      </template> -->
        </el-table-column>
        <el-table-column prop="" align="center" label="销售属性值">
          <template #default="{ row }">
            <el-tag
              v-for="tag in row.spuSaleAttrValueList"
              :key="tag.id"
              class="mx-1"
              closable
              :disable-transitions="false"
              @close="handleClose(tag, row.spuSaleAttrValueList)"
              style="margin-right: 20px"
            >
              {{ tag.saleAttrValueName }}
            </el-tag>
            <el-input
              style="width: 70px"
              v-if="row.flag == true"
              ref="InputRef"
              v-model="row.saleAttrValue"
              class="ml-1 w-20"
              size="small"
              @blur="toLook(row)"
            />
            <el-button
              v-else
              class="button-new-tag ml-1"
              size="small"
              @click="showInput(row)"
            >
              + New Tag
            </el-button>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template #="{ row, $index }">
            <el-popconfirm
              title="Are you sure to delete this?"
              @confirm="delTrademark($index)"
            >
              <template #reference>
                <el-button type="danger" icon="Delete">删除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>

    <el-form-item>
      <el-button
        :disabled="!spuHasSaleAttr.length"
        @click="save"
        type="primary"
      >
        保存
      </el-button>
      <el-button type="primary" @click="handle">取消</el-button>
    </el-form-item>
  </el-form>
</template>
<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
// 父子组件通信
const props = defineProps(['scene'])
const emit = defineEmits(['update:scene'])
import {
  reqAllTradeMark,
  reqSpuImageList,
  reqSpuHasSaleAttr,
  reqAllSaleAttr,
  reqAddOrUpdateSpu,
} from '@/api/product/spu'
let handle = () => {
  emit('update:scene', { flag: 0 })
  console.log(props.scene)
}
// 存储已有的spu这些数据
let AllTradeMark = ref([])
// 商品图片
let spuImageList = ref([])
// 已有的销售属性
let spuHasSaleAttr = ref([])
// 全部销售属性
let allSaleAttr = ref([])

//存储已有的SPU对象
let SpuParams = ref({
  category3Id: '', //收集三级分类的ID
  spuName: '', //SPU的名字
  description: '', //SPU的描述
  tmId: '', //品牌的ID
  spuImageList: [],
  spuSaleAttrList: [],
})
let getSpu = async (spu: any) => {
  console.log('我是spu:', spu)
  SpuParams.value = spu
  //spu:即为父组件传递过来的已有的SPU对象[不完整]
  //获取全部品牌的数据
  let result = await reqAllTradeMark()
  //获取某一个品牌旗下全部售卖商品的图片
  let result1 = await reqSpuImageList(spu.id as number)
  //获取已有的SPU销售属性的数据
  let result2 = await reqSpuHasSaleAttr(spu.id as number)
  //获取整个项目全部SPU的销售属性
  let result3 = await reqAllSaleAttr()

  AllTradeMark.value = result.data
  // 变成upload想要的参数
  spuImageList.value = result1.data.map((item) => {
    return {
      name: item.imgName,
      url: item.imgUrl,
    }
  })
  console.log(spuImageList.value)
  spuHasSaleAttr.value = result2.data
  allSaleAttr.value = result3.data
}
// 当父组件点击添加时清空数据
let initAddSpu = async (c3Id: any) => {
  SpuParams.value = {
    category3Id: '', //收集三级分类的ID
    spuName: '', //SPU的名字
    description: '', //SPU的描述
    tmId: '', //品牌的ID
    spuImageList: [],
    spuSaleAttrList: [],
  }
  //清空照片
  spuImageList.value = []
  //清空销售属性
  spuHasSaleAttr.value = []
  saleAttrIdAndValueName.value = ''
  //存储三级分类的ID
  SpuParams.value.category3Id = c3Id
  //获取全部品牌的数据
  let result = await reqAllTradeMark()
  let result1 = await reqAllSaleAttr()
  //存储数据
  AllTradeMark.value = result.data
  allSaleAttr.value = result1.data
}

// 控制预览图片的展示与隐藏
let dialogVisible = ref(false)
let dialogImageUrl = ref('')
// 照片墙点击预览按钮的时候触发的钩子
const handlePictureCardPreview: UploadProps['onPreview'] = (uploadFile) => {
  dialogImageUrl.value = uploadFile.url!
  dialogVisible.value = true
}
//照片钱上传成功之前的钩子约束文件的大小与类型
const handlerUpload = (file: any) => {
  if (
    file.type == 'image/png' ||
    file.type == 'image/jpeg' ||
    file.type == 'image/gif'
  ) {
    if (file.size / 1024 / 1024 < 3) {
      return true
    } else {
      ElMessage({
        type: 'error',
        message: '上传文件务必小于3M',
      })
      return false
    }
  } else {
    ElMessage({
      type: 'error',
      message: '上传文件务必PNG|JPG|GIF',
    })
    return false
  }
}
// 删除销售属性
let delTrademark = (index: any) => {
  spuHasSaleAttr.value.splice(index, 1)
}

//将来收集还未选择的销售属性的ID与属性值的名字
let saleAttrIdAndValueName = ref('')

//计算出当前SPU还未拥有的销售属性
let unSelectSaleAttr = computed(() => {
  //全部销售属性:颜色、版本、尺码
  //已有的销售属性:颜色、版本
  let unSelectArr = allSaleAttr.value.filter((item) => {
    return spuHasSaleAttr.value.every((item1) => {
      return item.name != item1.saleAttrName
    })
  })
  return unSelectArr
})

// 添加销售属性
let addSaleAttr = () => {
  let [baseSaleAttrId, saleAttrName] = saleAttrIdAndValueName.value.split(':')
  spuHasSaleAttr.value.push({
    baseSaleAttrId,
    saleAttrName,
    spuSaleAttrValueList: [],
  })
  saleAttrIdAndValueName.value = ''
}
// 销售属性值--------------------------------------------------------------------------------------
// 点击编辑与删除
let handleClose = (tag, spuSaleAttrValueList) => {
  console.log('我是handleClose', tag, spuSaleAttrValueList)
  spuSaleAttrValueList.splice(spuSaleAttrValueList.indexOf(tag), 1)
}

// 自动获取输入框焦点
let InputRef = ref()
let showInput = (row) => {
  //输入框的显示与隐藏
  row.flag = true
  nextTick(() => {
    InputRef.value.focus()
  })
}
let toLook = (row) => {
  if (row.saleAttrValue.trim() == '') {
    ElMessage({
      type: 'error',
      message: '属性值不能为空',
    })
    return
  }
  let repeat = row.spuSaleAttrValueList.find((item) => {
    return item.saleAttrValueName == row.saleAttrValue
  })

  if (repeat) {
    ElMessage({
      type: 'error',
      message: '属性值不能重复',
    })
    return
  }
  let { baseSaleAttrId, saleAttrValue } = row
  console.log('我是row', row)
  // 将属性push到spuSaleAttrValueList
  row.spuSaleAttrValueList.push({
    baseSaleAttrId,
    saleAttrValueName: saleAttrValue,
  })
  // 清空输入框
  row.saleAttrValue = ''
  row.flag = false
}

// 更新数据
let save = async () => {
  SpuParams.value.spuImageList = spuImageList.value.map((item) => {
    return {
      imgName: item.name,
      imgUrl: (item.response && item.response.data) || item.url,
    }
  })

  SpuParams.value.spuSaleAttrList = spuHasSaleAttr.value
  let result = await reqAddOrUpdateSpu(SpuParams.value)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: SpuParams.value.id ? '修改成功' : '添加成功',
    })
  } else {
    ElMessage({
      type: 'error',
      message: SpuParams.value.id ? '修改失败' : '添加失败',
    })
  }
  emit('update:scene', {
    flag: 0,
    params: SpuParams.value.id ? 'update' : 'add',
  })
}
defineExpose({
  getSpu,
  initAddSpu,
})
</script>
<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>
